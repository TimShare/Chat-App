from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

from sqlalchemy import false


class Login(BaseModel):
    login: str | None
    password: str

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    isOnline: bool | None = False
    class Config:
        orm_mode = True

class ChatBase(BaseModel):
    title: str
    comment: Optional[str] = None
    owner_id: int

class ChatCreate(ChatBase):
    pass

class Chat(ChatBase):
    id: int
    created_at: datetime
    updated_at: datetime
    updated_by_id: Optional[int] = None
    class Config:
        orm_mode = True

class MessageBase(BaseModel):
    content: str

class MessageCreate(MessageBase):
    pass

class Message(MessageBase):
    id: int
    chat_id: int
    sender_id: int
    created_at: datetime
    updated_at: datetime
    is_edited: bool
    username: Optional[str] = None
    class Config:
        orm_mode = True
