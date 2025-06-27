import React, { createContext, useContext, useState, useEffect } from 'react';
import { isGuestMode, clearGuestData } from '../utils/guestUtils';

const GuestContext = createContext();

export const useGuest = () => {
  const context = useContext(GuestContext);
  if (!context) {
    throw new Error('useGuest must be used within a GuestProvider');
  }
  return context;
};

export const GuestProvider = ({ children }) => {
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkGuestMode();
  }, []);

  const checkGuestMode = async () => {
    try {
      const guestMode = await isGuestMode();
      setIsGuest(guestMode);
    } catch (error) {
      console.error('Error checking guest mode:', error);
      setIsGuest(false);
    } finally {
      setLoading(false);
    }
  };

  const convertToRegisteredUser = async () => {
    try {
      await clearGuestData();
      setIsGuest(false);
      return true;
    } catch (error) {
      console.error('Error converting to registered user:', error);
      return false;
    }
  };

  const value = {
    isGuest,
    loading,
    checkGuestMode,
    convertToRegisteredUser,
  };

  return (
    <GuestContext.Provider value={value}>
      {children}
    </GuestContext.Provider>
  );
}; 