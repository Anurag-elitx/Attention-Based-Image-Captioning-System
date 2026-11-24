import json
import os
from collections import Counter

def build_vocab(karpathy_json_path, output_path, min_word_freq=5):
    """
    Reads the Karpathy JSON split, counts words in the 'train' split captions,
    and builds a word_map mapping tokens to indices.
    """
    print(f"Reading dataset from {karpathy_json_path}...")
    with open(karpathy_json_path, 'r') as f:
        data = json.load(f)
        
    word_freq = Counter()
    
    print("Counting words in training captions...")
    for img in data['images']:
        if img['split'] == 'train':
            for sentence in img['sentences']:
                # The 'tokens' list is pre-tokenized (lowercase, punctuation removed mostly)
                word_freq.update(sentence['tokens'])
                
    # Create word map with special tokens
    # Index 0 is often used for padding
    word_map = {
        '<pad>': 0,
        '<start>': 1,
        '<end>': 2,
        '<unk>': 3
    }
    
    idx = 4
    for word, freq in word_freq.items():
        if freq >= min_word_freq:
            word_map[word] = idx
            idx += 1
            
    print(f"Vocabulary built! Total tokens (including special): {len(word_map)}")
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w') as f:
        json.dump(word_map, f)
    
    print(f"Saved word map to {output_path}")

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    karpathy_json = os.path.join(base_dir, 'data', 'karpathy', 'dataset_coco.json')
    output_json = os.path.join(base_dir, 'data', 'processed', 'word_map.json')
    
    # We will wait for dataset to exist before running this script
    if os.path.exists(karpathy_json):
        build_vocab(karpathy_json, output_json, min_word_freq=5)
    else:
        print(f"File not found: {karpathy_json}")
        print("Please ensure the data download script has finished running.")
