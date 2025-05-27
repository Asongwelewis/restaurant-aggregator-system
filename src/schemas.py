from pydantic import BaseModel

class Restaurant(BaseModel):
    name: str
    location: dict
    cuisine: str
    opening_hours: dict