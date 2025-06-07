# RAS Platform API Documentation

## Authentication

All endpoints require an API key in the header:

```
X-API-Key: 123
```

---

## Endpoints

### 1. Restaurants

#### Create a restaurant
- **URL:** `/api/restaurants/`
- **Method:** `POST`
- **Headers:** `X-API-Key`
- **Body:** (JSON)
    ```json
    {
      "name": "Pizza Palace",
      "location": "Downtown",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "menu": {"Pizza": 12.5, "Salad": 7.0},
      "services": ["dine-in", "delivery"],
      "open_hours": "09:00",
      "close_hours": "22:00",
      "description": "Best pizza in town"
    }
    ```
- **Response:** Restaurant ID

#### Get a restaurant
- **URL:** `/api/restaurants/{restaurant_id}`
- **Method:** `GET`
- **Headers:** `X-API-Key`
- **Response:** Restaurant data

#### Update a restaurant
- **URL:** `/api/restaurants/{restaurant_id}`
- **Method:** `PUT`
- **Headers:** `X-API-Key`
- **Body:** (same as create)
- **Response:** Success message

#### Delete a restaurant
- **URL:** `/api/restaurants/{restaurant_id}`
- **Method:** `DELETE`
- **Headers:** `X-API-Key`
- **Response:** Success message

---

### 2. Ratings

#### Submit a rating
- **URL:** `/api/ratings/{restaurant_id}`
- **Method:** `POST`
- **Headers:** `X-API-Key`
- **Body:** (JSON)
    ```json
    {
      "user_id": "user123",
      "rating": 4.5,
      "comment": "Great food!"
    }
    ```
- **Response:** Rating ID

#### Get all ratings for a restaurant
- **URL:** `/api/ratings/{restaurant_id}`
- **Method:** `GET`
- **Headers:** `X-API-Key`
- **Response:** List of ratings

---

### 3. Search

#### Search for restaurants
- **URL:** `/api/search/`
- **Method:** `GET`
- **Headers:** `X-API-Key`
- **Query Parameters:**
    - `q` (string, optional): Search term
    - `lat` (float, optional): Latitude
    - `lon` (float, optional): Longitude
    - `radius_km` (float, optional): Search radius in kilometers
- **Response:** List of matching restaurants

---

## Example Request (with curl)

```sh
curl -X GET "http://localhost:8000/api/search/?q=pizza" -H "X-API-Key: 123"
```

---

## Notes

- All endpoints require the `X-API-Key` header.
- All data is sent and received as JSON.
- See `/docs` on the running backend for interactive API documentation.