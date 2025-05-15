from django.urls import path
from .views import RestaurantListCreate, RestaurantRetrieveUpdateDestroy

urlpatterns = [
    path('restaurants/', RestaurantListCreate.as_view(), name='restaurant-list'),
    path('restaurants/<int:pk>/', RestaurantRetrieveUpdateDestroy.as_view(), name='restaurant-detail'),
]
