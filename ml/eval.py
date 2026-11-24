import json
import os
import argparse
import torch
from pycocoevalcap.bleu.bleu import Bleu
from pycocoevalcap.cider.cider import Cider
from pycocoevalcap.meteor.meteor import Meteor
from pycocoevalcap.rouge.rouge import Rouge
from tqdm import tqdm

from ml.config import Config
from ml.encoder import Encoder
from ml.decoder import AttentionLSTMDecoder
from ml.inference import caption_image_beam_search

def evaluate(beam_size=5, checkpoint_path=None, max_images=None):
    """
    Evaluation function calculating BLEU, CIDEr, METEOR, ROUGE-L.
    """
    device = torch.device(Config.device if torch.cuda.is_available() else "cpu")
    ckpt_path = checkpoint_path or Config.checkpoint_path

    if not os.path.exists(ckpt_path):
        raise FileNotFoundError(f"Checkpoint not found at {ckpt_path}")

    # Load model checkpoint
    checkpoint = torch.load(ckpt_path, map_location=device)
    
    # Decoder
    if isinstance(checkpoint.get('decoder'), torch.nn.Module):
        decoder = checkpoint['decoder']
    else:
        # Load word map first to get vocab_size
        word_map_path = Config.word_map_path
        if not os.path.exists(word_map_path):
            word_map_path = os.path.join(Config.data_dir, 'processed', 'word_map.json')
        with open(word_map_path, 'r') as j:
            wm = json.load(j)
        decoder = AttentionLSTMDecoder(
            attention_dim=Config.attention_dim,
            embed_dim=Config.emb_dim,
            decoder_dim=Config.decoder_dim,
            vocab_size=len(wm),
            dropout=Config.dropout
        )
        if 'decoder' in checkpoint and isinstance(checkpoint['decoder'], dict):
            decoder.load_state_dict(checkpoint['decoder'])
        elif os.path.exists(os.path.join(Config.checkpoint_dir, 'decoder_best.pt')):
            decoder.load_state_dict(torch.load(os.path.join(Config.checkpoint_dir, 'decoder_best.pt'), map_location=device))
    
    decoder = decoder.to(device)
    decoder.eval()

    # Encoder
    encoder = checkpoint.get('encoder')
    if encoder is None or not isinstance(encoder, torch.nn.Module):
        encoder = Encoder()
        encoder_path = os.path.join(Config.checkpoint_dir, 'encoder_best.pt')
        if os.path.exists(encoder_path):
            encoder.load_state_dict(torch.load(encoder_path, map_location=device, weights_only=True))
    encoder = encoder.to(device)
    encoder.eval()

    # Load word map
    word_map_path = Config.word_map_path
    if not os.path.exists(word_map_path):
        word_map_path = os.path.join(Config.data_dir, 'processed', 'word_map.json')
    with open(word_map_path, 'r') as j:
        word_map = json.load(j)

    # Load Karpathy dataset split
    karpathy_path = os.path.join(Config.data_dir, 'karpathy', 'dataset_coco.json')
    if not os.path.exists(karpathy_path):
        karpathy_path = os.path.join(Config.data_dir, 'dataset_coco.json')
    with open(karpathy_path, 'r') as j:
        coco = json.load(j)
    
    # We'll evaluate on the test split
    test_images = [img for img in coco['images'] if img['split'] == 'test']
    if max_images is not None:
        test_images = test_images[:max_images]
            
    # Dictionaries for pycocoevalcap
    predictions = {}
    references = {}
    
    print(f"Evaluating {len(test_images)} test images using beam search (k={beam_size})...")
    
    for i, img in enumerate(tqdm(test_images)):
        image_path = os.path.join(Config.raw_data_dir, img['filepath'], img['filename'])
        
        # Ground truths
        img_caps = [c['raw'] for c in img['sentences']]
        references[str(i)] = img_caps
        
        # Prediction
        seq, _, _ = caption_image_beam_search(encoder, decoder, image_path, word_map, beam_size)
        
        # Remove <start>, <end>, <pad>
        seq = [w for w in seq if w not in ['<start>', '<end>', '<pad>']]
        pred_caption = ' '.join(seq)
        
        predictions[str(i)] = [pred_caption]
        
    # Calculate scores
    print("Calculating metrics...")
    scorers = [
        (Bleu(4), ["Bleu_1", "Bleu_2", "Bleu_3", "Bleu_4"]),
        (Meteor(), "METEOR"),
        (Rouge(), "ROUGE_L"),
        (Cider(), "CIDEr")
    ]
    
    metrics = {}
    for scorer, method in scorers:
        try:
            print(f"Computing {method}...")
            score, scores = scorer.compute_score(references, predictions)
            if isinstance(method, list):
                for sc, scs, m in zip(score, scores, method):
                    metrics[m] = float(sc)
                    print(f"{m}: {sc*100:.2f}")
            else:
                metrics[method] = float(score)
                print(f"{method}: {score*100:.2f}")
        except Exception as e:
            print(f"Warning: Failed to compute {method}: {e}")
            
    # Save metrics
    metrics_path = os.path.join(Config.base_dir, "eval_metrics.json")
    with open(metrics_path, "w") as f:
        json.dump(metrics, f, indent=4)
        
    print(f"Evaluation completed and metrics saved to {metrics_path}")
    return metrics

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Evaluate Image Captioning Model")
    parser.add_argument("--beam_size", type=int, default=5)
    parser.add_argument("--max_images", type=int, default=None)
    parser.add_argument("--checkpoint", type=str, default=None)
    args = parser.parse_args()
    evaluate(beam_size=args.beam_size, checkpoint_path=args.checkpoint, max_images=args.max_images)
