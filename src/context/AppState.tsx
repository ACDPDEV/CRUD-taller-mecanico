import { createContext, useState } from 'react';

interface AppStateContextProps {
  appState: string;
  setAppState: React.Dispatch<React.SetStateAction<string>>;
}

export const AppStateContext = createContext<AppStateContextProps | undefined>(
  undefined
);

export function AppStateProvider({ children }: { children: JSX.Element }) {
  const [appState, setAppState] = useState('home');
  return (
    <AppStateContext.Provider value={{ appState, setAppState }}>
      {children}
    </AppStateContext.Provider>
  );
}
