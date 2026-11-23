from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.entities import User, CoachMessage
from app.schemas.schemas import CoachMessageCreate
from app.services.ai_engine import get_coach_response

router = APIRouter(prefix="/coach", tags=["coach"])

@router.get("/messages")
def get_messages(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    msgs = db.query(CoachMessage).filter(CoachMessage.user_id == current_user.id).order_by(CoachMessage.created_at.asc()).all()
    if not msgs:
        # Seed welcome message
        welcome = CoachMessage(
            user_id=current_user.id,
            role="assistant",
            content=(
                "Welcome to your AI Career Intelligence workspace. I am your career coach.\n\n"
                "I analyze the specific requirements of the roles you are targeting, compare them against the verified evidence in your resume, and provide transparent, actionable strategies without fabricating experience.\n\n"
                "What opportunity or question would you like to explore today?"
            ),
            context="initial_greeting"
        )
        db.add(welcome)
        db.commit()
        db.refresh(welcome)
        msgs = [welcome]
    return msgs

@router.post("/chat")
def chat(
    req: CoachMessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Save user message
    user_msg = CoachMessage(
        user_id=current_user.id,
        role="user",
        content=req.content,
        context=req.context
    )
    db.add(user_msg)
    db.commit()

    # Generate assistant response
    ai_res = get_coach_response(req.content)
    
    asst_msg = CoachMessage(
        user_id=current_user.id,
        role="assistant",
        content=ai_res["content"],
        context=req.context,
        recommendations=ai_res.get("recommendations", [])
    )
    db.add(asst_msg)
    db.commit()
    db.refresh(asst_msg)
    return asst_msg
