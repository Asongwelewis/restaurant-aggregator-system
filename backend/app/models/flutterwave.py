from pydantic import BaseModel
class flutterpay_request(BaseModel):
    email:str
    amount:int
    phone:str
    name:str
    redirect_url : str
