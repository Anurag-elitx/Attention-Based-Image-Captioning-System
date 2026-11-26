import os
import json
from pathlib import Path
import torch
from ml.encoder import Encoder
from ml.decoder import AttentionLSTMDecoder
from ml.inference import caption_image_beam_search
from app.config import settings

REPO_ROOT = Path(__file__).resolve().parents[3]

class InferenceEngine:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(InferenceEngine, cls).__new__(cls)
            cls._instance.encoder = None
            cls._instance.decoder = None
            cls._instance.word_map = None
            cls._instance.rev_word_map = None
            cls._instance.vocab_size = 0
            cls._instance.device = torch.device(settings.DEVICE)
            cls._instance.beam_width = 5
        return cls._instance

    def load_model(self):
        if self.encoder is not None and self.decoder is not None and self.word_map is not None:
            return
            
        print("Loading ML models on-demand...")
        raw_dir = Path(settings.CHECKPOINT_DIR)
        if raw_dir.is_absolute():
            checkpoint_dir = str(raw_dir)
        elif raw_dir.exists():
            checkpoint_dir = str(raw_dir)
        else:
            checkpoint_dir = str(REPO_ROOT / raw_dir)

        encoder_path = os.path.join(checkpoint_dir, "encoder_best.pt")
        decoder_path = os.path.join(checkpoint_dir, "decoder_best.pt")
        word_map_path = os.path.join(checkpoint_dir, "word_map.json")

        if not os.path.exists(encoder_path) or not os.path.exists(decoder_path) or not os.path.exists(word_map_path):
            print("Warning: Model checkpoints not found. Inference will run in mock mode.")
            return

        try:
            import gc
            # Load word map
            with open(word_map_path, 'r') as j:
                self.word_map = json.load(j)
            self.rev_word_map = {v: k for k, v in self.word_map.items()}
            self.vocab_size = len(self.word_map)

            # Initialize and load models
            self.encoder = Encoder()
            self.encoder.load_state_dict(torch.load(encoder_path, map_location=self.device, weights_only=True))
            self.encoder.to(self.device)
            self.encoder.eval()
            gc.collect()

            self.decoder = AttentionLSTMDecoder(
                attention_dim=512,
                embed_dim=512,
                decoder_dim=512,
                vocab_size=self.vocab_size,
                dropout=0.5
            )
            self.decoder.load_state_dict(torch.load(decoder_path, map_location=self.device, weights_only=True))
            self.decoder.to(self.device)
            self.decoder.eval()
            gc.collect()

            print("Model loaded successfully.")
        except Exception as e:
            print(f"Error loading model: {e}")

    def caption(self, image_path: str):
        if self.encoder is None or self.decoder is None or self.word_map is None:
            self.load_model()

        if self.encoder is None or self.decoder is None or self.word_map is None:
            # Mock mode
            import time
            time.sleep(1)
            caption_tokens = ["a", "beautiful", "landscape", "with", "mountains", "in", "the", "background", "<end>"]
            alphas = []
            confidence = 0.95
        else:
            caption_tokens, alphas, confidence = caption_image_beam_search(
                encoder=self.encoder,
                decoder=self.decoder,
                image_path=image_path,
                word_map=self.word_map,
                beam_size=self.beam_width
            )

        return caption_tokens, alphas, confidence

engine = InferenceEngine()
