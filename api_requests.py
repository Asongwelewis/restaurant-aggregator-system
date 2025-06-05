
import requests

BASE_URL = "http://localhost:8000"

def register_user():
    url = f"{BASE_URL}/register"
    payload = {
        "email": "user@example.com",
        "password": "secure123",
        "name": "John Doe",
        "phone": "1234567890"
    }
    res = requests.post(url, json=payload)
    print("Register:", res.status_code, res.json())
    return res.json()

def login_user():
    url = f"{BASE_URL}/login"
    payload = {
        "email": "user@example.com",
        "password": "secure123"
    }
    res = requests.post(url, json=payload)
    print("Login:", res.status_code, res.json())
    return res.json()

def create_guest_session():
    url = f"{BASE_URL}/guest-session"
    res = requests.post(url)
    print("Guest session:", res.status_code, res.json())
    return res.json()

def get_profile(id_token):
    url = f"{BASE_URL}/profile"
    headers = {
        "id-token": id_token
    }
    res = requests.get(url, headers=headers)
    print("Profile:", res.status_code, res.json())
    return res.json()

def update_profile(id_token):
    url = f"{BASE_URL}/profile/update"
    headers = {
        "id-token": id_token,
        "Content-Type": "application/json"
    }
    payload = {
        "phone": "9998887777",
        "name": "John D."
    }
    res = requests.post(url, json=payload, headers=headers)
    print("Update profile:", res.status_code, res.json())
    return res.json()

if __name__ == "__main__":
    # Optional: register_user()

    login_data = login_user()
    token = login_data.get("id_token")

    if token:
        get_profile(token)
        update_profile(token)

    # Optional: create_guest_session()
