import os
import sys
import subprocess

# Ensure backend directory is first in sys.path so 'app' refers to backend/app package
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(BASE_DIR, "backend")

if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

# Auto-download model weights if missing
ckpt_file = os.path.join(BASE_DIR, "checkpoints", "decoder_best.pt")
if not os.path.exists(ckpt_file):
    print("Downloading model weights from Hugging Face Hub...")
    subprocess.run([sys.executable, os.path.join(BASE_DIR, "scripts", "download_model.py"), "--repo_id", os.getenv("HF_MODEL_REPO", "Anurag-Elitx/attention-image-captioning")], check=False)

# Auto-seed database
print("Seeding database...")
subprocess.run([sys.executable, os.path.join(BASE_DIR, "scripts", "seed_db.py")], check=False)

import uvicorn
from app.main import app as fastapi_app

try:
    import gradio as gr

    def gradio_caption(image):
        if image is None:
            return "Please upload an image."
        from app.services.inference_engine import engine
        engine.load_model()
        temp_img = "temp_gradio.jpg"
        image.save(temp_img)
        tokens, alphas, conf = engine.caption(temp_img)
        if os.path.exists(temp_img):
            try:
                os.remove(temp_img)
            except OSError:
                pass
        clean = " ".join([t for t in tokens if t not in ["<start>", "<end>", "<pad>"]])
        return f"{clean} (Confidence: {conf*100:.1f}%)"

    demo = gr.Interface(
        fn=gradio_caption,
        inputs=gr.Image(type="pil"),
        outputs=gr.Textbox(label="Generated Caption"),
        title="Attention-Based Image Captioning API",
        description="FastAPI Backend & Interactive Preview for Attention-Based Image Captioning System. Powers the React Frontend on Vercel via /api/v1!"
    )
    app = gr.mount_gradio_app(fastapi_app, demo, path="/")
except Exception as e:
    print(f"Gradio mounting skipped or exception: {e}")
    app = fastapi_app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    uvicorn.run(app, host="0.0.0.0", port=port)
