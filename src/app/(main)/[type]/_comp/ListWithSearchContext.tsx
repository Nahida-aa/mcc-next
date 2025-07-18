import { createContext, useContext, useState } from 'react';

// interface ContextType extends ContextType {}
// type ContextType = boolean 

export const ListIsExpandContext = createContext<{
  state: boolean,
  setState: (state: boolean) => void;
} | undefined>(undefined);

export const ListIsExpandContextProvider = ({ children }: { children: React.ReactNode 
  // isExpanded?: boolean
}) => {
  const [state, setState] = useState(false);
  return <ListIsExpandContext.Provider value={{ state, setState }}>{children}</ListIsExpandContext.Provider>;
};

export const useListIsExpandContext = () => {
  const context = useContext(ListIsExpandContext);
  if (!context) {
    throw new Error('useListIsExpandContext must be used within a ListIsExpandContextProvider');
  }
  return context;
};