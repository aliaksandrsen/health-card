'use client';

import { createContext } from 'react';

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
}) => <UserContext.Provider value={value}>{children}</UserContext.Provider>;
