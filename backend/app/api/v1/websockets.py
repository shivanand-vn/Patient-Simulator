from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.core.ws_manager import ws_manager
import json

router = APIRouter(tags=["WebSockets"])

@router.websocket("/ws/simulation/{session_id}")
async def simulation_websocket_endpoint(websocket: WebSocket, session_id: str):
    """
    Subscribes the desktop or web client to real-time events for an active simulation:
    - Dynamic vitals monitor ticks (ECG, Heart Rate, BP, SpO2, RR)
    - Speech recognition turn status
    - State machine transitions
    """
    await ws_manager.connect(session_id, websocket)
    try:
        while True:
            # Client can ping or send client-side heartbeat
            data = await websocket.receive_text()
            try:
                payload = json.loads(data)
                if payload.get("action") == "PING":
                    await websocket.send_json({"event": "PONG"})
            except Exception:
                pass
    except WebSocketDisconnect:
        ws_manager.disconnect(session_id, websocket)
