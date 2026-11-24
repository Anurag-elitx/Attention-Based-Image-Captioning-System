import os
import urllib.request
import zipfile
import sys

def download_and_extract(url, target_path, extract_path):
    if not os.path.exists(target_path):
        print(f"Downloading {url} to {target_path}...")
        def reporthook(count, block_size, total_size):
            percent = int(count * block_size * 100 / total_size)
            sys.stdout.write(f"\rDownloading: {percent}%")
            sys.stdout.flush()
        urllib.request.urlretrieve(url, target_path, reporthook)
        print("\nDownload complete.")
    
    if target_path.endswith('.zip'):
        # Check if it was already extracted by looking for the specific inner folder
        inner_folder = target_path.replace('.zip', '')
        if not os.path.exists(inner_folder):
            print(f"Extracting {target_path} to {extract_path}...")
            with zipfile.ZipFile(target_path, 'r') as zip_ref:
                zip_ref.extractall(extract_path)
            print("Extraction complete.")
        else:
            print(f"Already extracted {target_path}.")

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_dir = os.path.join(base_dir, 'data')
    raw_dir = os.path.join(data_dir, 'raw')
    karpathy_dir = os.path.join(data_dir, 'karpathy')
    
    os.makedirs(raw_dir, exist_ok=True)
    os.makedirs(karpathy_dir, exist_ok=True)
    
    # Karpathy split JSON
    karpathy_url = "http://cs.stanford.edu/people/karpathy/deepimagesent/caption_datasets.zip"
    karpathy_zip = os.path.join(karpathy_dir, 'caption_datasets.zip')
    download_and_extract(karpathy_url, karpathy_zip, karpathy_dir)
    
    # In practice, for a real setup, COCO train/val 2014 are huge (~19GB). 
    # Providing the links, but maybe users run this manually if they have space.
    print("\nNote: COCO 2014 images are very large (~19GB total).")
    print("If you intend to download them now, uncomment the download lines in this script.")
    
    train_url = "http://images.cocodataset.org/zips/train2014.zip"
    train_zip = os.path.join(raw_dir, 'train2014.zip')
    train_extract = os.path.join(raw_dir, 'train2014')
    download_and_extract(train_url, train_zip, raw_dir)
    
    val_url = "http://images.cocodataset.org/zips/val2014.zip"
    val_zip = os.path.join(raw_dir, 'val2014.zip')
    val_extract = os.path.join(raw_dir, 'val2014')
    download_and_extract(val_url, val_zip, raw_dir)

if __name__ == "__main__":
    main()
