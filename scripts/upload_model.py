import os
import argparse
from huggingface_hub import HfApi
from dotenv import load_dotenv

load_dotenv()

def main():
    parser = argparse.ArgumentParser(description="Upload model weights to HuggingFace Hub")
    parser.add_argument("--repo_id", type=str, default=os.getenv("HF_MODEL_REPO"), help="HF Repo ID")
    parser.add_argument("--src", type=str, default="checkpoints", help="Source folder")
    parser.add_argument("--token", type=str, default=os.getenv("HF_TOKEN"), help="HF Write Token")
    parser.add_argument("--commit_message", type=str, default="Update model checkpoints", help="Commit message")
    
    args = parser.parse_args()
    
    if not args.repo_id or not args.token:
        print("Error: HF_MODEL_REPO or HF_TOKEN not provided.")
        return
        
    api = HfApi()
    
    try:
        api.create_repo(repo_id=args.repo_id, exist_ok=True, token=args.token)
    except Exception as e:
        print(f"Warning/Error creating repo: {e}")
        
    files_to_upload = ["encoder_best.pt", "decoder_best.pt", "word_map.json"]
    
    print(f"Uploading from {args.src}/ to {args.repo_id}...")
    for filename in files_to_upload:
        local_path = os.path.join(args.src, filename)
        if not os.path.exists(local_path):
            print(f"File not found: {local_path}, skipping.")
            continue
            
        try:
            api.upload_file(
                path_or_fileobj=local_path,
                path_in_repo=filename,
                repo_id=args.repo_id,
                token=args.token,
                commit_message=args.commit_message
            )
            print(f"Uploaded {filename}")
        except Exception as e:
            print(f"Failed to upload {filename}: {e}")

if __name__ == "__main__":
    main()
