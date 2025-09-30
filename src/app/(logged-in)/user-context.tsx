'use client';

import { createContext, useContext } from 'react';

export type UserContextValue = {
  userId: number;
};

export const UserContext = createContext<UserContextValue | null>(null);

export const UserProvider = ({
  value,
  children,
}: {
  value: UserContextValue;
  children: React.ReactNode;
}) => <UserContext value={value}>{children}</UserContext>;

export const useUserContext = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }

  return context;
};
