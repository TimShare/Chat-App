from symtable import Class

from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Table
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

chat_user_association = Table(
    'chat_user_association',
    Base.metadata,
    Column('chat_id', Integer, ForeignKey('chats.id'), primary_key=True),
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True)
)





class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    created_at = Column(DateTime, default=datetime.now())
    is_online = Column(Boolean, default=False)
    messages = relationship("Message", back_populates="sender")
    permissions = relationship("ChatPermissions", back_populates="user")
    # Отношение для всех чатов, которые пользователь создал
    owned_chats = relationship("Chat", back_populates="owner", foreign_keys="[Chat.owner_id]")

    # Отношение для всех чатов, в которых пользователь участвует
    chats = relationship("Chat", secondary=chat_user_association, back_populates="users")


class Chat(Base):
    __tablename__ = 'chats'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    comment = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.now())
    updated_at = Column(DateTime, default=datetime.now())
    owner_id = Column(Integer, ForeignKey('users.id'))
    updated_by_id = Column(Integer, ForeignKey('users.id'))

    updated_by = relationship("User", foreign_keys=[updated_by_id])
    messages = relationship("Message", back_populates="chat")
    permissions = relationship("ChatPermissions", back_populates="chat")
    # Отношение к пользователю-владельцу
    owner = relationship("User", back_populates="owned_chats", foreign_keys=[owner_id])

    # Отношение для всех пользователей чата
    users = relationship("User", secondary=chat_user_association, back_populates="chats")


class Message(Base):
    __tablename__ = 'messages'

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String)
    created_at = Column(DateTime, default=datetime.now())
    updated_at = Column(DateTime, default=datetime.now())
    is_edited = Column(Boolean, default=False)
    chat_id = Column(Integer, ForeignKey('chats.id'))
    sender_id = Column(Integer, ForeignKey('users.id'))

    chat = relationship("Chat", back_populates="messages")
    sender = relationship("User", back_populates="messages")


class ChatPermissions(Base):
    __tablename__ = 'chat_permissions'

    id = Column(Integer, primary_key=True, index=True)
    chat_id = Column(Integer, ForeignKey('chats.id'))
    user_id = Column(Integer, ForeignKey('users.id'))
    role = Column(String)  # 'read_only' или 'read_and_write'

    chat = relationship("Chat", back_populates="permissions")
    user = relationship("User", back_populates="permissions")
