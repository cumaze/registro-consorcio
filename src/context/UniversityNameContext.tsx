"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type UniversityNameContextType = {
  universityName: string;
  setUniversityName: (name: string) => void;
  resetUniversityName: () => void;
};

const DEFAULT_UNIVERSITY_NAME = "Consortium Universitas";

const UniversityNameContext = createContext<UniversityNameContextType | undefined>(
  undefined
);

export function UniversityNameProvider({ children }: { children: ReactNode }) {
  // 👇 Siempre empieza en "Consortium Universitas" cada vez que se carga la app
  const [universityName, setUniversityNameState] = useState<string>(
    DEFAULT_UNIVERSITY_NAME
  );

  const setUniversityName = (name: string) => {
    const trimmed = name.trim();
    setUniversityNameState(
      trimmed === "" ? DEFAULT_UNIVERSITY_NAME : trimmed
    );
  };

  const resetUniversityName = () => {
    setUniversityNameState(DEFAULT_UNIVERSITY_NAME);
  };

  return (
    <UniversityNameContext.Provider
      value={{ universityName, setUniversityName, resetUniversityName }}
    >
      {children}
    </UniversityNameContext.Provider>
  );
}

export function useUniversityName() {
  const ctx = useContext(UniversityNameContext);
  if (!ctx) {
    throw new Error(
      "useUniversityName debe usarse dentro de un UniversityNameProvider"
    );
  }
  return ctx;
}
