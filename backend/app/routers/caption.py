from fastapi import APIRouter, Depends, Form, HTTPException, UploadFile, File, status, Query
from sqlmodel import Session
import uuid
import os

from app.models.user import User
from app.database import get_session
from app.dependencies import get_current_user
from app.schemas.caption import CaptionResponse
from app.services.caption_service import CaptionService
from app.config import settings

router = APIRouter()

@router.post("/", response_model=CaptionResponse)
async def create_caption(
    file: UploadFile = File(...),
    language: str = Form("English (US)"),
    tone: str = Form("Default"),
    length: str = Form("Default"),
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Check available credits
    if current_user.credits < 1:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="Out of credits. Upgrade your plan to continue.",
        )

    # Validate file type
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File provided is not an image.")
        
    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File too large. Max 10MB.")
        
    uploads_dir = os.path.join(settings.STATIC_OUTPUT_DIR, "uploads")
    os.makedirs(uploads_dir, exist_ok=True)
    ext = os.path.splitext(file.filename or "")[1] or ".jpg"
    unique_name = f"{uuid.uuid4()}{ext}"
    saved_path = os.path.join(uploads_dir, unique_name)
    image_web_url = f"/static/outputs/uploads/{unique_name}"

    try:
        with open(saved_path, "wb") as f:
            f.write(content)
            
        caption_record, attention_data = CaptionService.create_caption(
            session=session,
            user_id=current_user.id,
            image_path=saved_path,
            filename=file.filename or unique_name,
            image_url=image_web_url,
            language=language,
            tone=tone,
            length=length,
        )

        # Deduct 1 credit per image generation
        current_user.credits = max(0, current_user.credits - 1)
        session.add(current_user)
        session.commit()
            
        return {
            "id": caption_record.id,
            "caption_text": caption_record.caption_text,
            "title": caption_record.title,
            "language": caption_record.language,
            "tone": caption_record.tone,
            "length": caption_record.length,
            "platform_captions": caption_record.platform_captions,
            "confidence": caption_record.confidence,
            "inference_time_ms": caption_record.inference_time_ms,
            "image_url": caption_record.image_path,
            "created_at": caption_record.created_at,
            "attention_data": attention_data,
            "attention_overlay_url": caption_record.attention_overlay_url
        }
    except Exception as e:
        if os.path.exists(saved_path):
            os.remove(saved_path)
        raise HTTPException(status_code=500, detail=f"Inference failed: {str(e)}")

@router.get("/history", response_model=list[CaptionResponse])
def get_history(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, le=100),
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    is_admin = current_user.role == "admin"
    records = CaptionService.get_history(session, current_user.id, is_admin, limit, skip)
    
    return [
        {
            "id": r.id,
            "caption_text": r.caption_text,
            "title": r.title,
            "language": r.language,
            "tone": r.tone,
            "length": r.length,
            "platform_captions": r.platform_captions,
            "confidence": r.confidence,
            "inference_time_ms": r.inference_time_ms,
            "image_url": r.image_path,
            "created_at": r.created_at,
            "attention_data": None,
            "attention_overlay_url": r.attention_overlay_url
        } for r in records
    ]

@router.delete("/{caption_id}")
def delete_caption(
    caption_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    is_admin = current_user.role == "admin"
    success = CaptionService.delete_caption(session, caption_id, current_user.id, is_admin)
    if not success:
        raise HTTPException(status_code=404, detail="Caption not found or unauthorized")
    return {"status": "deleted"}
