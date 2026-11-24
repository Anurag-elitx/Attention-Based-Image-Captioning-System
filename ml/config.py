import os

class Config:
    # Model parameters
    emb_dim = 512  # dimension of word embeddings
    attention_dim = 512  # dimension of attention linear layers
    decoder_dim = 512  # dimension of decoder RNN
    dropout = 0.5
    device = "cuda"  # Will be dynamically set in train.py based on availability

    # Training parameters
    epochs = 40
    batch_size = 32
    workers = 0 if os.name == 'nt' else 4
    encoder_lr = 1e-4
    decoder_lr = 4e-4
    grad_clip = 5.
    alpha_c = 1.0  # regularization parameter for 'doubly stochastic attention'
    fine_tune_encoder = False  # Set to True later if we want to fine-tune layer4

    # Gradient accumulation
    grad_accumulation_steps = 1 # Set higher if memory is an issue with batch_size 32

    # Paths
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_folder = os.path.join(base_dir, 'data')
    data_dir = data_folder
    raw_data_dir = os.path.join(data_folder, 'raw')
    checkpoint_dir = os.path.join(base_dir, 'checkpoints')
    checkpoint_path = os.path.join(checkpoint_dir, 'BEST_checkpoint_coco.pth.tar')
    word_map_path = os.path.join(checkpoint_dir, 'word_map.json')
    
    os.makedirs(checkpoint_dir, exist_ok=True)
