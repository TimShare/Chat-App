from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from datetime import datetime
import json
from .. import crud, schemas
from ..dependency import get_db
from .message import create_message
router = APIRouter()

# Глобальная переменная для хранения активных соединений
active_connections = {}



@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int, db: Session = Depends(get_db)):
    await websocket.accept()
    crud.set_user_online(db, user_id)
    active_connections[user_id] = websocket
    try:
        while True:
            message = await websocket.receive_text()
            print(message)
            data = json.loads(message)

            chat_id = data.get("chat_id")
            content = data.get("content")
            sender_id = data.get("sender_id")

            if chat_id and content and sender_id:
                await create_message(message=schemas.MessageCreate(content=content), chat_id=chat_id,
                                     current_user=sender_id, db=db)
                for connection in active_connections.values():
                    data["type"] = "new_message"
                    data["username"] = crud.from_id_to_username(db=db, user_id=data["sender_id"])
                    data["created_at"] = datetime.now().isoformat()
                    await connection.send_text(json.dumps(data))
            else:
                await websocket.send_text("Некорректные данные")
    except WebSocketDisconnect:
        crud.set_user_offline(db, user_id)
        del active_connections[user_id]
    except Exception as e:
        print(f"Ошибка WebSocket для пользователя {user_id}: {e}")
