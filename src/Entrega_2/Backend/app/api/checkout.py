from fastapi import APIRouter, WebSocket, WebSocketDisconnect, status, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api import deps
from pydantic import BaseModel
import json
import asyncio
from app.vision.detector import detector
from app.services.checkout_service import CheckoutService
from app.core.logger import logger

router = APIRouter(prefix="/checkout", tags=["Checkout"])

class ItemUpdate(BaseModel):
    new_name: str

@router.get("/classes")
def get_available_classes():
    if detector.model and hasattr(detector.model, "names"):
        return list(detector.model.names.values())
    return ["Suco de Uva", "Biscoito Recheado", "Achocolatado", "Macarrão", "Feijão", "Arroz", "Óleo de Soja", "Leite"]

@router.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await websocket.accept()
    CheckoutService.get_or_create_session(session_id)
        
    try:
        while True:
            data = await websocket.receive_text()
            detected_items = detector.detect_from_base64(data, conf=0.6)
            
            items, new_additions = CheckoutService.process_detected_items(session_id, detected_items)
            
            # Sending data every frame so frontend can draw bounding boxes
            await websocket.send_text(json.dumps({
                "event": "frame_result",
                "detections": detected_items,
                "inventory": items,
                "just_detected": new_additions
            }))
            
            await asyncio.sleep(0.01)
                
    except WebSocketDisconnect:
        logger.info(f"Client disconnected: {session_id}")

@router.delete("/item/{session_id}/{item_id}")
def delete_item(session_id: str, item_id: str):
    updated_items = CheckoutService.delete_item(session_id, item_id)
    return {"status": "success", "items": updated_items}

@router.put("/item/{session_id}/{item_id}")
def update_item(session_id: str, item_id: str, body: ItemUpdate):
    updated_items = CheckoutService.update_item(session_id, item_id, body.new_name)
    return {"status": "success", "items": updated_items}

@router.post("/commit/{session_id}", status_code=status.HTTP_200_OK)
async def commit_checkout(
    session_id: str, 
    db: Session = Depends(get_db), 
    current_user = Depends(deps.get_current_user)
):
    items_count = CheckoutService.commit_session(session_id, db, current_user.id)
    return {"status": "success", "message": f"{items_count} items saved successfully."}
