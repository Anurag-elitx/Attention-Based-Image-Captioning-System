import os
import sys

try:
    sys.stdout.reconfigure(line_buffering=True)
except Exception:
    pass

from sqlmodel import Session, select
from passlib.context import CryptContext

# Add project root and backend dir to sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)
BACKEND_DIR = os.path.join(BASE_DIR, "backend")
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

try:
    from app.database import engine, init_db
    from app.models.user import User
    from app.models.checkpoint import ModelCheckpoint
except ImportError:
    from backend.app.database import engine, init_db
    from backend.app.models.user import User
    from backend.app.models.checkpoint import ModelCheckpoint

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def seed():
    init_db()
    
    with Session(engine) as session:
        # Check if admin exists
        statement = select(User).where(User.username == "admin")
        admin = session.exec(statement).first()
        
        if not admin:
            print("Creating default admin user...")
            hashed_password = pwd_context.hash("admin123")
            admin = User(
                username="admin",
                email="admin@example.com",
                hashed_password=hashed_password,
                role="admin"
            )
            session.add(admin)
        else:
            print("Admin user already exists.")
            
        # Check if default checkpoint row exists
        statement = select(ModelCheckpoint).where(ModelCheckpoint.version == "v1.0.0")
        ckpt = session.exec(statement).first()
        
        if not ckpt:
            print("Creating default model_checkpoint row...")
            ckpt = ModelCheckpoint(
                version="v1.0.0",
                encoder_path="checkpoints/encoder_best.pt",
                decoder_path="checkpoints/decoder_best.pt",
                word_map_path="checkpoints/word_map.json",
                vocab_size=10000,
                embed_dim=512,
                hidden_dim=512,
                attention_dim=512,
                beam_width_default=5,
                best_bleu4=0.0,
                epoch=0
            )
            session.add(ckpt)
        else:
            print("Default model_checkpoint row already exists.")
            
        session.commit()
        print("Database seeded successfully.")

if __name__ == "__main__":
    seed()
