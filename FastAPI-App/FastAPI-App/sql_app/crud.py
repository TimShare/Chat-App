from fastapi import HTTPException
from sqlalchemy import insert
from sqlalchemy.orm import Session
from datetime import datetime

from . import models, schemas


def get_user(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def get_user_by_email(db: Session, email: str):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User with this email not found")
    return user


def create_user(db: Session, user: schemas.UserCreate):
    existing_user = get_user_by_email(db, user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    created_date = datetime.now()
    password = user.password
    db_user = models.User(email=user.email, password=password, username=user.username, created_at=created_date)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, login: str, password: str):
    user = db.query(models.User).filter(
        (models.User.email == login) | (models.User.username == login)
    ).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid username or email")
    if user.password != password:
        raise HTTPException(status_code=400, detail="Incorrect password")
    return user


def get_chats(db: Session, skip: int = 0, limit: int = 10):
    chats = db.query(models.Chat).offset(skip).limit(limit).all()
    if not chats:
        raise HTTPException(status_code=404, detail="No chats found")
    return chats


def get_user_chats(db: Session, user_id: int):
    chats = db.query(models.Chat).join(models.chat_user_association).filter(
        models.chat_user_association.c.user_id == user_id
    ).all()
    return chats


def create_chat(db: Session, chat: schemas.ChatCreate):
    db_chat = models.Chat(
        title=chat.title,
        comment=chat.comment,
        created_at=datetime.now(),
        updated_at=datetime.now(),
        owner_id=chat.owner_id,
    )
    db.add(db_chat)
    db.commit()
    db.refresh(db_chat)
    stmt = insert(models.chat_user_association).values(
        user_id=chat.owner_id,
        chat_id=db_chat.id
    )
    db.execute(stmt)
    db.commit()
    chat_permission = schemas.ChatPermissionsBase(
        chat_id=db_chat.id,
        user_id=chat.owner_id,
        role="read_and_write"
    )
    create_chat_permissions(db, chat_permission)
    return db_chat


def create_message(db: Session, message: schemas.MessageCreate, chat_id: int, sender_id: int):
    chat = db.query(models.Chat).filter(models.Chat.id == chat_id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    chat.updated_at = datetime.now()
    chat.updated_by_id = sender_id
    db.commit()
    db.refresh(chat)
    db_message = models.Message(
        **message.dict(),
        chat_id=chat_id,
        sender_id=sender_id,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


def create_private_chat(db: Session, current_user: int, to_user_id: int):
    if current_user == to_user_id:
        raise HTTPException(status_code=400, detail="Cannot create a private chat with oneself")
    new_chat = models.Chat(
        title=f"Private chat between {current_user} and {to_user_id}",
        created_at=datetime.now(),
        updated_at=datetime.now(),
        owner_id=current_user
    )
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)
    stmt = insert(models.chat_user_association).values([
        {"user_id": current_user, "chat_id": new_chat.id},
        {"user_id": to_user_id, "chat_id": new_chat.id}
    ])
    db.execute(stmt)
    db.commit()
    chat_permission = schemas.ChatPermissionsBase(chat_id=new_chat.id, user_id=current_user, role="read_and_write")
    create_chat_permissions(db, chat_permission)
    chat_permission = schemas.ChatPermissionsBase(chat_id=new_chat.id, user_id=to_user_id, role="read_and_write")
    create_chat_permissions(db, chat_permission)
    return new_chat


def add_user_to_chat(db: Session, chat_id: int, user_id: int):
    chat = db.query(models.Chat).filter(models.Chat.id == chat_id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    user_in_chat = db.query(models.chat_user_association).filter(
        models.chat_user_association.c.chat_id == chat_id,
        models.chat_user_association.c.user_id == user_id
    ).first()
    if user_in_chat:
        raise HTTPException(status_code=400, detail="User already in chat")
    stmt = models.chat_user_association.insert().values(chat_id=chat_id, user_id=user_id)
    db.execute(stmt)
    db.commit()
    chat_permission = schemas.ChatPermissionsBase(chat_id=chat_id, user_id=user_id, role="read")
    create_chat_permissions(db, chat_permission)
    return {"message": "User successfully added to chat"}


def get_users_in_chat(db: Session, chat_id: int):
    users_in_chat = db.query(models.chat_user_association.c.user_id).filter(
        models.chat_user_association.c.chat_id == chat_id
    ).all()
    if not users_in_chat:
        raise HTTPException(status_code=404, detail="No users found in chat")
    return [user.user_id for user in users_in_chat]


def get_messages_in_chat(db: Session, chat_id: int):
    messages = (
        db.query(models.Message, models.User.username)
        .join(models.User, models.Message.sender_id == models.User.id)
        .filter(models.Message.chat_id == chat_id)
        .all()
    )
    if not messages:
        raise HTTPException(status_code=404, detail="No messages found in chat")
    result = []
    for message, username in messages:
        result.append({
            "id": message.id,
            "content": message.content,
            "sender_id": message.sender_id,
            "chat_id": message.chat_id,
            "username": username,
            "created_at": message.created_at,
            "updated_at": message.updated_at,
            "is_edited": message.is_edited
        })
    return result


def set_user_online(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_online = True
    db.commit()
    db.refresh(user)
    return user


def set_user_offline(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_online = False
    db.commit()
    db.refresh(user)
    return user


def from_id_to_username(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.username


def create_chat_permissions(db: Session, chat_permission: schemas.ChatPermissionsBase):
    permissions_in_chat = db.query(models.chat_user_association).filter(
        models.ChatPermissions.chat_id == chat_permission.chat_id,
        models.ChatPermissions.user_id == chat_permission.user_id
    ).first()
    if permissions_in_chat:
        raise HTTPException(status_code=400, detail="Permissions already exist for user in this chat")
    db_chat_permission = models.ChatPermissions(**chat_permission.dict())
    db.add(db_chat_permission)
    db.commit()
    db.refresh(db_chat_permission)
    return db_chat_permission


def change_chat_permissions(db: Session, chat_permission: schemas.ChatPermissionsBase):
    permissions_in_chat = db.query(models.ChatPermissions).filter(
        models.ChatPermissions.chat_id == chat_permission.chat_id,
        models.ChatPermissions.user_id == chat_permission.user_id
    ).first()
    if not permissions_in_chat:
        create_chat_permissions(db, chat_permission)
    permissions_in_chat.role = chat_permission.role
    db.commit()
    db.refresh(permissions_in_chat)
    return permissions_in_chat


def get_chat_permissions(db: Session, chat_id: int, user_id: int):
    permissions = db.query(models.ChatPermissions).filter(
        models.ChatPermissions.chat_id == chat_id,
        models.ChatPermissions.user_id == user_id
    ).first()
    if not permissions:
        raise HTTPException(status_code=404, detail="No permissions found for user in this chat")
    return permissions


def delete_chat(db: Session, chat_id: int, user_id: int):
    chat = db.query(models.Chat).filter(models.Chat.id == chat_id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    if chat.owner_id != user_id:
        raise HTTPException(status_code=403, detail="Only the owner can delete this chat")
    db.query(models.Message).filter(models.Message.chat_id == chat_id).delete()
    db.query(models.ChatPermissions).filter(models.ChatPermissions.chat_id == chat_id).delete()
    db.execute(models.chat_user_association.delete().where(models.chat_user_association.c.chat_id == chat_id))
    db.delete(chat)
    db.commit()
    return {"detail": "Chat and related data successfully deleted"}


def edit_message(db: Session, message_edit: schemas.MessageEdit):
    to_edit_message = db.query(models.Message).filter(models.Message.id == message_edit.id).first()
    if not to_edit_message:
        raise HTTPException(status_code=404, detail="Message not found")
    to_edit_message.content = message_edit.content
    to_edit_message.is_edited = True
    to_edit_message.updated_at = datetime.now()
    db.commit()
    db.refresh(to_edit_message)
    return to_edit_message
