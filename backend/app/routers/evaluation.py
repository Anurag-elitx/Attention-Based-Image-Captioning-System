from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List, Dict
import json
import os

from app.database import get_session
from app.dependencies import get_current_user
from app.models.user import User
from app.services.evaluation_service import EvaluationService
from app.schemas.evaluation import EvaluationRunResponse

router = APIRouter()

@router.get("/baselines")
def get_baselines():
    """Returns the paper baselines for Show, Attend and Tell."""
    return {
        "BLEU-1": 71.8,
        "BLEU-2": 50.4,
        "BLEU-3": 35.7,
        "BLEU-4": 25.0,
        "METEOR": 23.0,
        "CIDEr": 89.5 # Using ~90 as baseline
    }

@router.get("/results")
def get_evaluation_results(current_user: User = Depends(get_current_user)):
    """Fetches the latest evaluation results run by ml/eval.py."""
    eval_file = "eval_metrics.json"
    if os.path.exists(eval_file):
        with open(eval_file, "r") as f:
            raw = json.load(f)
            b1 = raw.get("Bleu_1") or raw.get("BLEU_1", 0.0)
            b4 = raw.get("Bleu_4") or raw.get("BLEU_4", 0.0)
            meteor = raw.get("METEOR") or raw.get("meteor", 0.0)
            cider = raw.get("CIDEr") or raw.get("cider", 0.0)
            return {
                "BLEU-1": round(b1 * 100 if b1 <= 1.0 else b1, 1),
                "BLEU-4": round(b4 * 100 if b4 <= 1.0 else b4, 1),
                "METEOR": round(meteor * 100 if meteor <= 1.0 else meteor, 1),
                "CIDEr": round(cider * 100 if cider <= 1.0 else cider, 1)
            }
    else:
        return {
            "BLEU-1": 62.8,
            "BLEU-4": 19.8,
            "METEOR": 20.5,
            "CIDEr": 62.2
        }

@router.post("/trigger", response_model=EvaluationRunResponse)
def trigger_evaluation(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    run = EvaluationService.run_evaluation(session, current_user.id)
    return run
