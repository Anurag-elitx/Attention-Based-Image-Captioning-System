import os
import json
import uuid
import time
from sqlmodel import Session

# Import models
from app.models.evaluation import EvaluationRun

class EvaluationService:
    @staticmethod
    def run_evaluation(session: Session, user_id: uuid.UUID) -> EvaluationRun:
        """
        Triggers ml/eval.py programmatically. 
        Note: This could block for a long time if running synchronously.
        """
        start_time = time.time()
        
        # Placeholder for actual evaluation trigger
        # We can either run it via subprocess or import the main function from ml.eval
        # For now we'll just read the existing output or return mock metrics if it doesn't exist
        
        metrics = {
            "bleu_1": 0.0,
            "bleu_2": 0.0,
            "bleu_3": 0.0,
            "bleu_4": 0.0,
            "meteor": 0.0,
            "cider": 0.0
        }
        
        eval_file = "eval_metrics.json"
        if os.path.exists(eval_file):
            try:
                with open(eval_file, "r") as f:
                    data = json.load(f)
                    # Normalize scores: if values are between 0 and 1, multiply by 100 for BLEU / ROUGE / CIDEr
                    b1 = data.get("Bleu_1") or data.get("BLEU_1", 0.0)
                    b2 = data.get("Bleu_2") or data.get("BLEU_2", 0.0)
                    b3 = data.get("Bleu_3") or data.get("BLEU_3", 0.0)
                    b4 = data.get("Bleu_4") or data.get("BLEU_4", 0.0)
                    meteor = data.get("METEOR") or data.get("meteor", 0.0)
                    cider = data.get("CIDEr") or data.get("cider", 0.0)
                    
                    metrics["bleu_1"] = b1 * 100 if b1 <= 1.0 else b1
                    metrics["bleu_2"] = b2 * 100 if b2 <= 1.0 else b2
                    metrics["bleu_3"] = b3 * 100 if b3 <= 1.0 else b3
                    metrics["bleu_4"] = b4 * 100 if b4 <= 1.0 else b4
                    metrics["meteor"] = meteor * 100 if meteor <= 1.0 else meteor
                    metrics["cider"] = cider * 100 if cider <= 1.0 else cider
            except Exception as e:
                print(f"Error reading {eval_file}: {e}")
                
        execution_time = int(time.time() - start_time)
        
        # Create DB record
        run = EvaluationRun(
            triggered_by=user_id,
            execution_time_s=execution_time,
            bleu_1=metrics["bleu_1"],
            bleu_2=metrics["bleu_2"],
            bleu_3=metrics["bleu_3"],
            bleu_4=metrics["bleu_4"],
            meteor=metrics["meteor"],
            cider=metrics["cider"]
        )
        
        session.add(run)
        session.commit()
        session.refresh(run)
        
        return run
