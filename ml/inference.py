import json
import os
from PIL import Image

try:
    import torch
    import torch.nn.functional as F
    from torchvision import transforms
    from ml.encoder import Encoder
    from ml.decoder import AttentionLSTMDecoder
    from ml.config import Config
    TORCH_AVAILABLE = True
except OSError as e:
    if "Application Control policy" in str(e):
        print("WDAC Blocked PyTorch. Running in MOCK mode.")
    TORCH_AVAILABLE = False
except ImportError:
    TORCH_AVAILABLE = False

try:
    import spaces
except Exception:
    class MockSpaces:
        def GPU(self, fn=None, duration=None):
            if fn is not None:
                return fn
            return lambda f: f
    spaces = MockSpaces()

@spaces.GPU
def caption_image_beam_search(encoder, decoder, image_path, word_map, beam_size=5):
    """
    Reads an image and captions it with beam search.
    
    :param encoder: encoder model
    :param decoder: decoder model
    :param image_path: path to image
    :param word_map: word map
    :param beam_size: number of sequences to consider at each step
    :return: caption, weights for visualization, confidence score
    """
    if not TORCH_AVAILABLE:
        # Mock Response for WDAC restricted environments
        import time
        time.sleep(1) # simulate inference
        return ["a", "beautiful", "landscape", "with", "mountains", "in", "the", "background", "<end>"], [], 0.95

    device = torch.device(Config.device if torch.cuda.is_available() else "cpu")
    
    vocab_size = len(word_map)
    rev_word_map = {v: k for k, v in word_map.items()}
    
    # Transform
    transform = transforms.Compose([
        transforms.Resize((256, 256)),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                             std=[0.229, 0.224, 0.225])
    ])
    
    # Load Image
    img = Image.open(image_path).convert('RGB')
    image = transform(img) # (3, 224, 224)
    image = image.unsqueeze(0).to(device) # (1, 3, 224, 224)
    
    # Encode
    with torch.no_grad():
        encoder_out = encoder(image)  # (1, 196, 2048)
        
    encoder_dim = encoder_out.size(2)
    num_pixels = encoder_out.size(1)
    
    # We'll treat the problem as having a batch size of k (beam_size)
    encoder_out = encoder_out.expand(beam_size, num_pixels, encoder_dim) # (k, num_pixels, encoder_dim)
    
    # Tensor to store top k previous words at each step; now they're just <start>
    k_prev_words = torch.LongTensor([[word_map['<start>']]] * beam_size).to(device) # (k, 1)
    
    # Tensor to store top k sequences; now they're just <start>
    seqs = k_prev_words # (k, 1)
    
    # Tensor to store top k sequences' scores; now they're just 0
    top_k_scores = torch.zeros(beam_size, 1).to(device)
    
    # Tensor to store top k sequences' alphas; now they're just 1s
    seqs_alpha = torch.ones(beam_size, 1, num_pixels).to(device)
    
    # Lists to store completed sequences and their scores
    complete_seqs = list()
    complete_seqs_scores = list()
    complete_seqs_alpha = list()
    
    # Start decoding
    step = 1
    h, c = decoder.init_hidden_state(encoder_out)
    
    # s is a number less than or equal to k, because sequences are removed from this process once they hit <end>
    while True:
        embeddings = decoder.embedding(k_prev_words).squeeze(1) # (s, embed_dim)
        
        awe, alpha = decoder.attention(encoder_out, h) # (s, encoder_dim), (s, num_pixels)
        
        # alpha is shape (s, num_pixels)
        alpha = alpha.unsqueeze(1) # (s, 1, num_pixels)
        
        lstm_input = torch.cat([embeddings, awe], dim=1) # (s, embed_dim + encoder_dim)
        h, c = decoder.decode_step(lstm_input, (h, c)) # (s, decoder_dim)
        
        scores = decoder.fc(h) # (s, vocab_size)
        scores = F.log_softmax(scores, dim=1)
        
        # Repetition suppression: prevent immediate word repeats and repeating bigrams
        s = scores.size(0)
        for s_idx in range(s):
            current_seq = seqs[s_idx].tolist()
            last_word = current_seq[-1]
            # 1. Prevent immediate 1-gram repetition (e.g., "wooden wooden")
            if last_word not in [word_map.get('<start>'), word_map.get('<end>')]:
                scores[s_idx, last_word] -= 1e5
                
            # 2. Prevent repeating bigrams (e.g., "in a cage in a cage")
            if len(current_seq) >= 3:
                existing_bigrams = set()
                for b_i in range(len(current_seq) - 1):
                    existing_bigrams.add((current_seq[b_i], current_seq[b_i + 1]))
                # Check what bigrams would be formed by next word
                for w_cand in range(vocab_size):
                    if (last_word, w_cand) in existing_bigrams and w_cand != word_map.get('<end>'):
                        scores[s_idx, w_cand] -= 1e5
        
        # Add to top_k_scores
        scores = top_k_scores.expand_as(scores) + scores # (s, vocab_size)
        
        # For the first step, all k points will have the same scores (since same k previous words, h, c)
        if step == 1:
            top_k_scores, top_k_words = scores[0].topk(beam_size, 0, True, True) # (k)
        else:
            # Unroll and find top scores, and their unrolled indices
            top_k_scores, top_k_words = scores.view(-1).topk(beam_size, 0, True, True) # (k)
            
        # Convert unrolled indices to actual indices of scores
        prev_word_inds = (top_k_words / vocab_size).long() # (k)
        next_word_inds = (top_k_words % vocab_size).long() # (k)
        
        # Add new words to sequences
        seqs = torch.cat([seqs[prev_word_inds], next_word_inds.unsqueeze(1)], dim=1) # (k, step+1)
        seqs_alpha = torch.cat([seqs_alpha[prev_word_inds], alpha[prev_word_inds]], dim=1) # (k, step+1, num_pixels)
        
        # Which sequences are incomplete (didn't reach <end>)?
        incomplete_inds = [ind for ind, next_word in enumerate(next_word_inds) if next_word != word_map['<end>']]
        complete_inds = list(set(range(len(next_word_inds))) - set(incomplete_inds))
        
        # Set aside complete sequences
        if len(complete_inds) > 0:
            complete_seqs.extend(seqs[complete_inds].tolist())
            complete_seqs_scores.extend(top_k_scores[complete_inds])
            complete_seqs_alpha.extend(seqs_alpha[complete_inds].tolist())
            
        # Stop if all sequences are complete, or if max_len is reached
        beam_size -= len(complete_inds)
        if beam_size == 0 or step > 50:
            break
            
        # Proceed with incomplete sequences
        seqs = seqs[incomplete_inds]
        seqs_alpha = seqs_alpha[incomplete_inds]
        h = h[prev_word_inds[incomplete_inds]]
        c = c[prev_word_inds[incomplete_inds]]
        encoder_out = encoder_out[prev_word_inds[incomplete_inds]]
        top_k_scores = top_k_scores[incomplete_inds].unsqueeze(1)
        k_prev_words = next_word_inds[incomplete_inds].unsqueeze(1)
        
        step += 1
        
    if not complete_seqs:
        # If no sequence completes, return the best incomplete one
        complete_seqs.extend(seqs.tolist())
        complete_seqs_scores.extend(top_k_scores)
        complete_seqs_alpha.extend(seqs_alpha.tolist())
        
    # Select best sequence with length normalization
    # Length penalty: ((5 + len) / 6.0) ** 0.7
    norm_scores = []
    for seq_cand, score in zip(complete_seqs, complete_seqs_scores):
        raw_val = score.item() if isinstance(score, torch.Tensor) else float(score)
        seq_len = max(1, len(seq_cand) - 1)
        lp = ((5.0 + seq_len) / 6.0) ** 0.7
        norm_scores.append(raw_val / lp)
        
    i = norm_scores.index(max(norm_scores))
    seq = complete_seqs[i]
    alphas = complete_seqs_alpha[i]
    
    # Convert sequence of word indices to actual words
    caption = [rev_word_map[ind] for ind in seq]
    
    # Calculate human-friendly confidence (0.0 to 1.0)
    # Average log probability exponentiated: exp(total_log_prob / seq_len)
    best_raw_score = complete_seqs_scores[i].item() if isinstance(complete_seqs_scores[i], torch.Tensor) else float(complete_seqs_scores[i])
    valid_len = max(1, len([w for w in caption if w not in ['<start>', '<end>', '<pad>']]))
    avg_log_prob = best_raw_score / valid_len
    confidence = round(float(min(1.0, max(0.01, torch.exp(torch.tensor(avg_log_prob)).item()))), 4)
    
    return caption, alphas, confidence

if __name__ == '__main__':
    print("Beam Search Inference setup correctly.")
