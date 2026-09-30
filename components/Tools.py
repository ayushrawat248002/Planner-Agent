# tools.py
from datetime import datetime
from typing import Dict, Any

async def getTemperature(data: Dict[str, Any]) -> dict:
    city = data["city"]
    return {
        "city": city,
        "temperature": "25°C"
    }

async def getUser(data: Dict[str, Any]) -> dict:
    user_id = data["ctx"]["userId"]
    return {
        "userId": user_id,
        "name": "John Doe",
    }

async def getTime(data: Dict[str, Any]) -> dict:
    now = datetime.now()
    current_time = now.strftime("%H:%M:%S")
    return {
        "city": data.get("city"),
        "current_time": current_time
    }

Tools = {
    "getTemperature": getTemperature,
    "getUser": getUser,
    "getTime": getTime,
}
