import { createContext, useContext, useState } from 'react';

// interface ContextType extends ContextType {}
type ContextType = boolean 

export const ListIsExpandContext = createContext<{
  state: ContextType,
  setState: (state: ContextType) => void;
} | undefined>(undefined);

export const ListIsExpandContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState(true);
  return <ListIsExpandContext.Provider value={{ state, setState }}>{children}</ListIsExpandContext.Provider>;
};

export const useListIsExpandContext = () => {
  const context = useContext(ListIsExpandContext);
  if (!context) {
    throw new Error('useListIsExpandContext must be used within a ListIsExpandContextProvider');
  }
  return context;
};