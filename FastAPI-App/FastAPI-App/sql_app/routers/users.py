from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..dependency import get_db

router = APIRouter()


@router.post("/register/", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@router.post("/login/", response_model=schemas.User)
def login(login_data: schemas.Login, db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, login=login_data.login, password=login_data.password)
    return user


@router.get("/{user_id}/chats", response_model=List[schemas.Chat])
def read_user_chats(user_id: int, db: Session = Depends(get_db)):
    print(user_id)
    chats = crud.get_user_chats(db, user_id)
    return chats


@router.get("/get_username")
def get_username(user_id: int, db: Session = Depends(get_db)):
    return crud.from_id_to_username(user_id=user_id, db=db)
