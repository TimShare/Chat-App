from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from datetime import datetime
import json
from .. import crud, schemas
from ..dependency import get_db
from .message import create_message, edit_message

router = APIRouter()

active_connections = {}


@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int, db: Session = Depends(get_db)):
    await websocket.accept()
    crud.set_user_online(db, user_id)
    active_connections[user_id] = websocket
    try:
        while True:
            message = await websocket.receive_text()
            data = json.loads(message)
            print(data)
            action_type = data.get("action_type")
            if action_type == "send_message":
                chat_id = data.get("chat_id")
                content = data.get("content")
                sender_id = data.get("sender_id")

                if chat_id and content and sender_id:
                    mes = await create_message(message=schemas.MessageCreate(content=content), chat_id=chat_id,
                                               current_user=sender_id, db=db)
                    data["id"] = mes.id
                    data["username"] = crud.from_id_to_username(db=db, user_id=data["sender_id"])
                    data["created_at"] = datetime.now().isoformat()
                    data["is_edit"] = False
                    for connection in active_connections.values():
                        await connection.send_text(json.dumps(data))
                else:
                    await websocket.send_text("Некорректные данные")
            if action_type == "chat_deleted":
                for connection in active_connections.values():
                    await connection.send_text(json.dumps(data))
            if action_type == "permissions_changed":
                for connection in active_connections.values():
                    await connection.send_text(json.dumps(data))
            if action_type == "message_edited":
                mes_id = data.get("id")
                content = data.get("content")
                edited_message = await edit_message(message_edit=schemas.MessageEdit(id=mes_id, content=content), db=db)
                if edited_message:
                    # Сериализация отредактированного сообщения
                    message_data = {
                        "content": edited_message.content,
                        "id": edited_message.id,
                        "chat_id": edited_message.chat_id,
                        "sender_id": edited_message.sender_id,
                        "created_at": edited_message.created_at.isoformat(),
                        "updated_at": edited_message.updated_at.isoformat(),
                        "is_edited": True,
                        "username": edited_message.username,
                        "action_type": "message_edited"
                    }
                    for connection in active_connections.values():
                        await connection.send_text(json.dumps(message_data))
    except WebSocketDisconnect:
        crud.set_user_offline(db, user_id)
        del active_connections[user_id]
    except Exception as e:
        print(f"Ошибка WebSocket для пользователя {user_id}: {e}")
