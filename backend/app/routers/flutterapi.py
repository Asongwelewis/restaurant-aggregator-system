from models import flutterpay_request
from helper_function import initialise_payment
from fastapi import FastAPI

app = FastAPI(    
    description= "REstaurant Aggregator System API",
    tittle = "Restaurant Aggregator system",
    docs_url="/"
    )

@app.post("/flutterwave/pay/")
async def pay_now(payment:flutterpay_request):
    result = await initialise_payment(
        email = payment.email,
        amount= payment.amount,
        phone= payment.phone,
        name = payment.name,
        redirect_url= payment.redirect_url
   ) 
    if result["status"] == "success":
        return{
            "message":"payment link created",
            "payment_link": result["data"]["link"]
        }
    else:
        return{
            "message":"something when wrong",
            "error": result.get("message","Unknown error")
        }
    