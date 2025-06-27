import React, { createContext, useState } from 'react';

export const AccountTypeContext = createContext();

export function AccountTypeProvider({ children }) {
  const [accountType, setAccountType] = useState('user'); // 'user' or 'restaurant'

  const switchAccount = (type) => setAccountType(type);

  return (
    <AccountTypeContext.Provider value={{ accountType, switchAccount }}>
      {children}
    </AccountTypeContext.Provider>
  );
}
