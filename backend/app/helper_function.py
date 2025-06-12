import httpx
import requests
from firebase_config import ref
from typing import Dict, Any, List

secret_key = "FLWSECK_TEST-887b2dbc48925fef8dc88b61c120d7d6-X"

headers = {
    "Authorization": f"Bearer {secret_key}",
    "Content-type": "application/json"
}
 
async def initialise_payment(email: str,amount: int, phone: str, name: str, redirect_url:str):
    url = "https://api.flutterwave.com/v3/payments"

    data = {
        "tx_ref": "TX-12345-abc",
        "amount" : amount,
        "currency": "XAF",
        "redirect_url": redirect_url,
        "payment_options": "card,mobilemoney",
        "customer": {
            "email": email,
            "phonenumber": phone,
            "name": name
        },
        "customizations":{
            "title": "odis",
            "description": "pay for food or bookings",
            "logo": None
        }
    }

    async with httpx.AsyncClient() as client:
     response = await client.post(url,headers=headers, json=data)
     return response.json()

async def verify_payment(transaction_id:str):
   headers= {
      "Authorization": f"Bearer{secret_key}"
   }
   url = f"https://api.flutterwave.com/v3/transactions/{transaction_id}/verify"
   response = requests.get(url,headers=headers)
   return response.json()

async def store_payment(user_id:str, payment_data:dict):
  ref(f"payment/{user_id}").push(payment_data)

async def get_bookings_by_restaurant(restaurant_id: str) -> List[Dict[str, Any]]:
    book_ref = ref.child("bookings")
    all_bookings = book_ref.get()

    if not all_bookings:
        return []
    
    matching_resto = []
    for booking_id, booking_data in all_bookings.items():
        if booking_data.get("restaurant_id") == restaurant_id:
            booking_data["booking_id"] = booking_id
            matching_resto.append(booking_data)
    return matching_resto