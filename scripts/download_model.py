import os
import argparse
from huggingface_hub import hf_hub_download
from dotenv import load_dotenv

load_dotenv()

def main():
    parser = argparse.ArgumentParser(description="Download model weights from HuggingFace Hub")
    parser.add_argument("--repo_id", type=str, default=os.getenv("HF_MODEL_REPO"), help="HF Repo ID")
    parser.add_argument("--version", type=str, default="main", help="Git revision/branch/tag")
    parser.add_argument("--dest", type=str, default="checkpoints", help="Destination folder")
    
    args = parser.parse_args()
    
    if not args.repo_id:
        print("Error: HF_MODEL_REPO not provided via arguments or .env")
        return
        
    os.makedirs(args.dest, exist_ok=True)
    
    files_to_download = ["encoder_best.pt", "decoder_best.pt", "word_map.json"]
    
    print(f"Downloading from {args.repo_id}@{args.version} to {args.dest}/...")
    for filename in files_to_download:
        try:
            local_path = hf_hub_download(
                repo_id=args.repo_id,
                filename=filename,
                revision=args.version,
                local_dir=args.dest,
                local_dir_use_symlinks=False
            )
            print(f"Downloaded {filename} -> {local_path}")
        except Exception as e:
            print(f"Failed to download {filename}: {e}")

if __name__ == "__main__":
    main()
