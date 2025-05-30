from pydantic import BaseModel
from typing import Optional

class Restaurant(BaseModel):
    id: Optional[str]
    name: str
    cuisine: str
    opening_hours: Optional[str]
    address: Optional[str]

class Rating(BaseModel):
    id: Optional[str]
    restaurant_id: str
    value: float
    comment: Optional[str]
    user_id: Optional[str]