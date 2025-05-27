from src.firestore import db

def add_test_data():
    db.collection("restaurants").add({
        "name": "Test Pizza",
        "location": {"lat": 40.7128, "lng": -74.0060},
        "cuisine": "Italian",
        "opening_hours": {"monday": "10:00-22:00"}
    })
    print("Added test restaurant!")

if __name__ == "__main__":
    add_test_data()