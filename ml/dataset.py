import os
os.environ["HDF5_USE_FILE_LOCKING"] = "FALSE"
import json
import h5py
import torch
from torch.utils.data import Dataset

class CocoCaptionDataset(Dataset):
    """
    A PyTorch Dataset class to be used in a PyTorch DataLoader to create batches.
    """
    def __init__(self, data_folder, split, max_len=50):
        """
        :param data_folder: folder where precomputed features and metadata are stored
        :param split: split, one of 'train', 'val', or 'test'
        :param max_len: maximum length of a caption (to which all are padded)
        """
        self.split = split
        self.max_len = max_len
        
        # Load word map
        word_map_path = os.path.join(data_folder, 'processed', 'word_map.json')
        with open(word_map_path, 'r') as f:
            self.word_map = json.load(f)
            
        # Load metadata
        metadata_path = os.path.join(data_folder, 'features', f'{split}_metadata.json')
        with open(metadata_path, 'r') as f:
            self.metadata = json.load(f)
            
        # Store data folder and lazy handle for HDF5 (multiprocessing safe)
        self.data_folder = data_folder
        self.h = None
        self.features = None
        
        # Calculate dataset length (total number of captions)
        self.dataset_size = 0
        self.image_caption_map = [] # stores (image_idx, sentence_idx)
        
        for img_idx, img_info in enumerate(self.metadata):
            for sent_idx, sentence in enumerate(img_info['sentences']):
                self.image_caption_map.append((img_idx, sent_idx))
                self.dataset_size += 1

    def __len__(self):
        return self.dataset_size

    def __getitem__(self, i):
        # Open HDF5 lazily per process/worker
        if self.h is None:
            h5_file = os.path.join(self.data_folder, 'features', f'{self.split}_features.h5')
            self.h = h5py.File(h5_file, 'r')
            self.features = self.h['features']

        # Determine which image and which sentence this index corresponds to
        img_idx, sent_idx = self.image_caption_map[i]
        
        # Get features
        # We read from HDF5 lazily. We take the img_idx row.
        # Output shape: (196, 2048)
        img_features = torch.FloatTensor(self.features[img_idx])
        
        # Get caption
        tokens = self.metadata[img_idx]['sentences'][sent_idx]['tokens']
        
        # Encode caption
        enc_c = [self.word_map['<start>']] + [self.word_map.get(word, self.word_map['<unk>']) for word in tokens] + [self.word_map['<end>']]
        
        # Truncate if too long
        if len(enc_c) > self.max_len:
            enc_c = enc_c[:self.max_len-1] + [self.word_map['<end>']]
            
        caplen = len(enc_c)
        
        # Pad up to max_len
        padding = [self.word_map['<pad>']] * (self.max_len - caplen)
        enc_c.extend(padding)
        
        enc_c = torch.LongTensor(enc_c)
        
        return img_features, enc_c, torch.tensor([caplen], dtype=torch.long)
        
    def close(self):
        if self.h is not None:
            self.h.close()

if __name__ == "__main__":
    # Simple test
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_dir = os.path.join(base_dir, 'data')
    
    # We can only test this if features are precomputed
    if os.path.exists(os.path.join(data_dir, 'features', 'train_features.h5')):
        dataset = CocoCaptionDataset(data_dir, 'train')
        print(f"Dataset length: {len(dataset)}")
        features, caption, caplen = dataset[0]
        print(f"Features shape: {features.shape}")
        print(f"Caption: {caption}")
        print(f"Caption length: {caplen}")
    else:
        print("Feature files not found, skipping dataset test.")
