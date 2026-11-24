import os
import sys

# Ensure project root is in sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

os.environ["HDF5_USE_FILE_LOCKING"] = "FALSE"
import json
import h5py
import torch
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
from PIL import Image
from tqdm import tqdm
import argparse
from ml.encoder import Encoder

class ImageDataset(Dataset):
    def __init__(self, image_paths, transform=None):
        self.image_paths = image_paths
        self.transform = transform

    def __len__(self):
        return len(self.image_paths)

    def __getitem__(self, i):
        path = self.image_paths[i]
        try:
            img = Image.open(path).convert('RGB')
        except Exception as e:
            # Handle corrupted images or missing files gracefully
            print(f"Error opening image {path}: {e}")
            img = Image.new('RGB', (224, 224))
            
        if self.transform is not None:
            img = self.transform(img)
            
        return img, path

def precompute_features(karpathy_json_path, raw_images_dir, output_dir, 
                        batch_size=64, dtype="float16", compression="lzf", 
                        num_workers=0, max_train=None, max_val=None, max_test=None):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")
    print(f"Feature precision: {dtype}, Compression: {compression}")
    
    # Load model
    encoder = Encoder()
    encoder.eval()
    encoder.to(device)
    
    # Image transforms (standard ImageNet normalization)
    transform = transforms.Compose([
        transforms.Resize((256, 256)),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                             std=[0.229, 0.224, 0.225])
    ])
    
    # Read Karpathy JSON
    print(f"Reading dataset from {karpathy_json_path}...")
    with open(karpathy_json_path, 'r') as f:
        data = json.load(f)
        
    # Group images by split
    splits = {'train': [], 'val': [], 'test': []}
    
    for img in data['images']:
        split = img['split']
        if split == 'val':
            split_key = 'val'
        elif split == 'test':
            split_key = 'test'
        else:
            split_key = 'train' # train, restval
            
        filename = img['filename']
        folder = img['filepath'] # typically 'train2014' or 'val2014'
        
        filepath = os.path.join(raw_images_dir, folder, filename)
        
        splits[split_key].append({
            'filepath': filepath,
            'imgid': img['imgid'],
            'sentences': img['sentences']
        })

    # Apply limits if requested
    if max_train is not None:
        splits['train'] = splits['train'][:max_train]
    if max_val is not None:
        splits['val'] = splits['val'][:max_val]
    if max_test is not None:
        splits['test'] = splits['test'][:max_test]
        
    os.makedirs(output_dir, exist_ok=True)
    
    # Process each split
    for split_name, img_data_list in splits.items():
        print(f"\nProcessing {split_name} split ({len(img_data_list)} images)...")
        
        if len(img_data_list) == 0:
            continue
            
        h5_path = os.path.join(output_dir, f"{split_name}_features.h5")
        metadata_path = os.path.join(output_dir, f"{split_name}_metadata.json")
        
        image_paths = [img['filepath'] for img in img_data_list]
        dataset = ImageDataset(image_paths, transform)
        dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=False, num_workers=num_workers)
        
        num_images = len(image_paths)
        comp_arg = None if compression == "none" else compression
        
        if os.path.exists(h5_path):
            try:
                os.remove(h5_path)
            except OSError:
                pass

        with h5py.File(h5_path, 'w') as h5f:
            features_dset = h5f.create_dataset('features', 
                                               shape=(num_images, 196, 2048),
                                               dtype=dtype,
                                               chunks=(1, 196, 2048),
                                               compression=comp_arg)
            
            img_idx = 0
            with torch.no_grad():
                for imgs, paths in tqdm(dataloader, desc=f"Extracting features for {split_name}"):
                    imgs = imgs.to(device)
                    # (batch_size, 196, 2048)
                    features = encoder(imgs)
                    
                    if dtype == "float16":
                        features_np = features.half().cpu().numpy()
                    else:
                        features_np = features.cpu().numpy()

                    batch_len = features_np.shape[0]
                    features_dset[img_idx:img_idx+batch_len] = features_np
                    img_idx += batch_len
                    
        # Save metadata (useful for dataset.py to map index -> captions)
        print(f"Saving metadata for {split_name}...")
        with open(metadata_path, 'w') as f:
            json.dump(img_data_list, f)
            
    print("\nFeature precomputation complete!")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Precompute ResNet features")
    parser.add_argument("--batch_size", type=int, default=64)
    parser.add_argument("--dtype", type=str, default="float16", choices=["float16", "float32"],
                        help="Data precision (float16 saves 50% space and fits on disk)")
    parser.add_argument("--compression", type=str, default="lzf", choices=["none", "lzf", "gzip"],
                        help="HDF5 compression format")
    parser.add_argument("--num_workers", type=int, default=0 if os.name == 'nt' else 4,
                        help="DataLoader worker count (0 recommended on Windows)")
    parser.add_argument("--max_train", type=int, default=None, help="Maximum number of train images")
    parser.add_argument("--max_val", type=int, default=None, help="Maximum number of val images")
    parser.add_argument("--max_test", type=int, default=None, help="Maximum number of test images")
    args = parser.parse_args()
    
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    karpathy_json = os.path.join(base_dir, 'data', 'karpathy', 'dataset_coco.json')
    raw_images_dir = os.path.join(base_dir, 'data', 'raw')
    output_dir = os.path.join(base_dir, 'data', 'features')
    
    if not os.path.exists(karpathy_json):
        print(f"Cannot find {karpathy_json}. Please download dataset first.")
    else:
        precompute_features(
            karpathy_json, 
            raw_images_dir, 
            output_dir, 
            batch_size=args.batch_size,
            dtype=args.dtype,
            compression=args.compression,
            num_workers=args.num_workers,
            max_train=args.max_train,
            max_val=args.max_val,
            max_test=args.max_test
        )
