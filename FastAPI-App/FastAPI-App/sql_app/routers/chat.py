from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..dependency import get_db

router = APIRouter()

@router.get("/", response_model=List[schemas.Chat])
def get_chats(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_chats(db, skip=skip, limit=limit)

@router.post("/", response_model=schemas.Chat)
async def create_chat(chat: schemas.ChatCreate, db: Session = Depends(get_db)):
    return crud.create_chat(db=db, chat=chat)

@router.post("/{chat_id}/add_user/")
async def add_user_to_chat_endpoint(chat_id: int, user_id: int, db: Session = Depends(get_db)):
    return crud.add_user_to_chat(db, chat_id=chat_id, user_id=user_id)

@router.post("/private-chat/")
async def create_private_chat(to_user_id: int, current_user: int, db: Session = Depends(get_db)):
    return crud.create_private_chat(db=db, to_user_id=to_user_id, current_user=current_user)

@router.get("/users/")
def users_in_chat(chat_id: int, db: Session = Depends(get_db)):
    return crud.get_users_in_chat(chat_id=chat_id, db=db)

@router.delete("/{chat_id}", response_model=dict)
def delete_chat(chat_id: int, user_id:int,  db: Session = Depends(get_db)):
    return crud.delete_chat(db=db, chat_id=chat_id, user_id=user_id)