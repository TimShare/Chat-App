from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..dependency import get_db

router = APIRouter()


@router.post("/change_permission", response_model=schemas.ChatPermission)
def change_permissions(chat_permissions: schemas.ChatPermissionsBase, db: Session = Depends(get_db)):
    return crud.change_chat_permissions(chat_permission=chat_permissions, db=db)

@router.post("/", response_model=schemas.ChatPermission)
def create_permissions(chat_permissions: schemas.ChatPermissionsBase, db: Session = Depends(get_db)):
    return crud.create_chat_permissions(chat_permission=chat_permissions, db=db)


@router.get("/", response_model=schemas.ChatPermission)
def get_permissions(chat_id:int , user_id: int, db: Session = Depends(get_db)):
    return crud.get_chat_permissions(chat_id=chat_id, user_id=user_id, db=db)