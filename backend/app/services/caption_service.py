from sqlmodel import Session, select
from typing import List, Optional, Tuple, Dict, Any
import time
import uuid
import os

from app.models.caption import CaptionRecord
from app.services.inference_engine import engine
from app.services.attention_viz import viz_service

class CaptionService:
    @staticmethod
    def create_caption(
        session: Session, 
        user_id: uuid.UUID, 
        image_path: str, 
        filename: str,
        image_url: Optional[str] = None
    ) -> Tuple[CaptionRecord, List[Dict[str, Any]]]:
        start_time = time.time()
        
        # 1. Run inference
        caption_tokens, alphas, confidence = engine.caption(image_path)
        inference_time = int((time.time() - start_time) * 1000)
        
        # Clean up caption tokens
        clean_caption = " ".join([t for t in caption_tokens if t not in ["<start>", "<end>", "<pad>"]])
        
        # 2. Extract structured attention data for each token
        attention_data = []
        if alphas:
            for idx, token in enumerate(caption_tokens):
                if token not in ["<start>", "<end>", "<pad>"]:
                    if idx < len(alphas):
                        a = alphas[idx]
                        a_list = a.tolist() if hasattr(a, 'tolist') else list(a)
                        attention_data.append({"word": token, "alpha": a_list})
                        
        # 3. Save to database
        db_caption = CaptionRecord(
            user_id=user_id,
            image_path=image_url or image_path,
            image_filename=filename,
            caption_text=clean_caption,
            confidence=confidence,
            beam_width=engine.beam_width,
            device=str(engine.device),
            inference_time_ms=inference_time,
            attention_overlay_url=None
        )
        
        session.add(db_caption)
        session.commit()
        session.refresh(db_caption)
        
        return db_caption, attention_data

    @staticmethod
    def get_history(session: Session, user_id: uuid.UUID, is_admin: bool = False, limit: int = 20, offset: int = 0) -> List[CaptionRecord]:
        if is_admin:
            statement = select(CaptionRecord).order_by(CaptionRecord.created_at.desc()).offset(offset).limit(limit)
        else:
            statement = select(CaptionRecord).where(CaptionRecord.user_id == user_id).order_by(CaptionRecord.created_at.desc()).offset(offset).limit(limit)
        
        return session.exec(statement).all()

    @staticmethod
    def delete_caption(session: Session, caption_id: uuid.UUID, user_id: uuid.UUID, is_admin: bool = False) -> bool:
        statement = select(CaptionRecord).where(CaptionRecord.id == caption_id)
        caption = session.exec(statement).first()
        
        if not caption:
            return False
            
        if not is_admin and caption.user_id != user_id:
            return False
            
        # Clean up file on disk if it exists
        if caption.image_path and caption.image_path.startswith("/static/"):
            # strip /static/ to find path on disk
            rel_path = caption.image_path.replace("/static/", "data/")
            if os.path.exists(rel_path):
                try:
                    os.remove(rel_path)
                except OSError:
                    pass
            
        session.delete(caption)
        session.commit()
        return True
