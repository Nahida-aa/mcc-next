"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { DBProj } from "~/lib/db/schema/proj";

interface ContextType extends DBProj {}

const Context = createContext<{
  state: ContextType | null;
  setState: (state: ContextType | null) => void;
} | undefined>(undefined);

export const ProjectProvider = ({ children,
  defaultState
}: { children: ReactNode, defaultState: ContextType }) => {
  const [state, setState] = useState<ContextType | null>(defaultState);

  return (
    <Context.Provider value={{ state, setState }}>
      {children}
    </Context.Provider>
  );
};

export const useProject = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useProjectProvider must be used within a ProjectProvider");
  }
  return context;
};