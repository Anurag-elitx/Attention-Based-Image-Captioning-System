import sys
import os
import json
import argparse
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.cm as cm
from PIL import Image

# Ensure project root is in sys.path for direct script execution
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

try:
    import skimage.transform
    SKIMAGE_AVAILABLE = True
except ImportError:
    SKIMAGE_AVAILABLE = False

try:
    import torch
    import torch.nn.functional as F
    TORCH_AVAILABLE = True
except (ImportError, OSError):
    TORCH_AVAILABLE = False

from ml.config import Config
from ml.inference import caption_image_beam_search

def visualize_att(image_path, seq, alphas, rev_word_map, smooth=True, show=True):
    """
    Visualizes caption with weights at every word.

    :param image_path: path to image that has been captioned
    :param seq: caption
    :param alphas: weights
    :param rev_word_map: reverse word mapping, i.e. ix2word
    :param smooth: smooth weights?
    :param show: display the matplotlib window?
    """
    image = Image.open(image_path)
    image = image.resize([14 * 24, 14 * 24], Image.LANCZOS)

    words = seq
    
    # Calculate grid size dynamically
    num_words = len(words)
    cols = min(num_words, 5) # max 5 columns
    rows = (num_words + cols - 1) // cols
    
    fig = plt.figure(figsize=(15, 3 * rows))

    for t in range(num_words):
        if t >= len(alphas):
            break
        plt.subplot(rows, cols, t + 1)

        plt.text(0, 1, '%s' % (words[t]), color='black', backgroundcolor='white', fontsize=12)
        plt.imshow(image)

        current_alpha = alphas[t, :]
        if smooth and SKIMAGE_AVAILABLE:
            alpha = skimage.transform.pyramid_expand(current_alpha.numpy(), upscale=24, sigma=8)
        elif SKIMAGE_AVAILABLE:
            alpha = skimage.transform.resize(current_alpha.numpy(), [14 * 24, 14 * 24])
        else:
            alpha_img = Image.fromarray((current_alpha.numpy() * 255).astype(np.uint8))
            alpha_img = alpha_img.resize((14 * 24, 14 * 24), Image.BILINEAR)
            alpha = np.array(alpha_img) / 255.0
            
        if t == 0:
            plt.imshow(alpha, alpha=0)
        else:
            plt.imshow(alpha, alpha=0.8)
            
        plt.axis('off')
        
    plt.tight_layout()
    output_filename = 'attention_visualization.png'
    plt.savefig(output_filename)
    print(f"Generated caption: {' '.join(words)}")
    print(f"Saved visualization to {output_filename}", flush=True)
    if show:
        plt.show()

def main():
    parser = argparse.ArgumentParser(description='Visualize Attention Mechanism')
    parser.add_argument('--image', type=str, default=None, help='path to image')
    parser.add_argument('--beam_size', type=int, default=5, help='beam size')
    parser.add_argument('--no_display', action='store_true', help='save to file only without opening window')
    args = parser.parse_args()
    
    # Check image path
    image_path = args.image
    if not image_path:
        sample_dir = os.path.join(Config.raw_data_dir, 'val2014')
        if os.path.exists(sample_dir):
            for file in os.listdir(sample_dir):
                if file.lower().endswith(('.jpg', '.jpeg', '.png')):
                    image_path = os.path.join(sample_dir, file)
                    print(f"No --image argument passed. Using sample image: {image_path}")
                    break
        if not image_path:
            print("Error: Please provide an image using --image <path_to_image>")
            return
    
    if not TORCH_AVAILABLE:
        print("Cannot run visualization: PyTorch is blocked by WDAC.")
        return

    device = torch.device(Config.device if torch.cuda.is_available() else "cpu")
    
    # Load model
    if not os.path.exists(Config.checkpoint_path):
        print(f"No checkpoint found at {Config.checkpoint_path}. Train the model first.")
        return
        
    checkpoint = torch.load(Config.checkpoint_path, map_location=device)
    decoder = checkpoint['decoder'].to(device)
    decoder.eval()
    
    encoder = checkpoint.get('encoder')
    if encoder is None:
        from ml.encoder import Encoder
        encoder = Encoder()
        encoder_path = os.path.join(Config.checkpoint_dir, "encoder_best.pt")
        if os.path.exists(encoder_path):
            try:
                encoder.load_state_dict(torch.load(encoder_path, map_location=device))
            except Exception as e:
                print(f"Loaded pretrained ResNet-101 encoder: {e}")
    encoder = encoder.to(device)
    encoder.eval()

    # Load word map
    with open(Config.word_map_path, 'r') as j:
        word_map = json.load(j)
    rev_word_map = {v: k for k, v in word_map.items()}
    
    # Run inference
    seq, alphas, _ = caption_image_beam_search(encoder, decoder, image_path, word_map, args.beam_size)
    
    # Reshape alphas to 14x14 grid (196 pixels)
    alphas = torch.FloatTensor(alphas) # (len(seq), 196)
    alphas = alphas.view(-1, 14, 14)
    
    # Visualize
    visualize_att(image_path, seq, alphas, rev_word_map, show=not args.no_display)

if __name__ == '__main__':
    main()
