import React, { createContext, useState } from 'react';

export const RestaurantContext = createContext();

export function RestaurantProvider({ children }) {
  const [restaurants, setRestaurants] = useState([]);
  const [currentRestaurantId, setCurrentRestaurantId] = useState(null);

  const addRestaurant = (restaurant) => {
    setRestaurants((prev) => [...prev, restaurant]);
    setCurrentRestaurantId(restaurant.id); // Set as current
  };

  return (
    <RestaurantContext.Provider value={{ restaurants, addRestaurant, currentRestaurantId, setCurrentRestaurantId }}>
      {children}
    </RestaurantContext.Provider>
  );
}
