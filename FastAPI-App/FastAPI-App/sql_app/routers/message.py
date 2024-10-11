from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..dependency import get_db

router = APIRouter()

@router.post("/edit-message", response_model=schemas.Message)
async def edit_message(message_edit: schemas.MessageEdit, db: Session = Depends(get_db)):
    edited_message = crud.edit_message(db, message_edit)
    return schemas.Message.from_orm(edited_message)

@router.post("/", response_model=schemas.Message)
async def create_message(message: schemas.MessageCreate, chat_id: int, current_user: int, db: Session = Depends(get_db)):
    chat = crud.create_message(db=db, message=message, chat_id=chat_id, sender_id=current_user)
    return chat

@router.get("/", response_model=List[schemas.Message])
def get_messages_in_chat(chat_id: int, db: Session = Depends(get_db)):
    messages = crud.get_messages_in_chat(db=db, chat_id=chat_id)
    return messages
