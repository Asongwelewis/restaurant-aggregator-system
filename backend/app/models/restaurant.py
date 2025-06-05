from pydantic import BaseModel
from typing import Optional

class Restaurant(BaseModel):
    id: str
    name: str
    description: Optional[str]
    location: str
    rating: float = 0.0
    num_ratings: int = 0
