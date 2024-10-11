from fastapi import FastAPI

from . import models
from .database import engine
from .dependency import get_db
from .routers import users, chat, message, websocket, permissions
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)
get_db()

app = FastAPI()

origins = [
    "*",  # Например, для React, если он запущен на порту 3000
]

# Добавление CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение роутеров
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(chat.router, prefix="/chats", tags=["chats"])
app.include_router(message.router, prefix="/messages", tags=["messages"])
app.include_router(websocket.router, tags=["websocket"])
app.include_router(permissions.router, prefix="/permissions", tags=['permissions'])
