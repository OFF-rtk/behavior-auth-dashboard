"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type SelectedUserContextType = {
  userId: string | null;
  setUserId: (id: string) => void;
};

const SelectedUserContext = createContext<SelectedUserContextType | undefined>(undefined);

export function SelectedUserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);

  return (
    <SelectedUserContext.Provider value={{ userId, setUserId }}>
      {children}
    </SelectedUserContext.Provider>
  );
}

export function useSelectedUser() {
  const context = useContext(SelectedUserContext);
  if (!context) throw new Error("useSelectedUser must be used inside SelectedUserProvider");
  return context;
}
