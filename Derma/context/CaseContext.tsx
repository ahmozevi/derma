import React, { createContext, useContext, useState, useEffect } from 'react';
import { CaseRecord, Message } from '../types';

interface CaseContextType {
  cases: CaseRecord[];
  addCase: (newCase: CaseRecord) => void;
  currentImage: string | null;
  setCurrentImage: (img: string | null) => void;
  currentMessages: Message[];
  setCurrentMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const CaseContext = createContext<CaseContextType | undefined>(undefined);

export const CaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('derma_cases');
    if (saved) {
      try {
        setCases(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved cases", e);
      }
    }
  }, []);

  const addCase = (newCase: CaseRecord) => {
    setCases(prev => {
      const updated = [newCase, ...prev];
      localStorage.setItem('derma_cases', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <CaseContext.Provider value={{ 
      cases, 
      addCase, 
      currentImage, 
      setCurrentImage,
      currentMessages,
      setCurrentMessages
    }}>
      {children}
    </CaseContext.Provider>
  );
};

export const useCase = () => {
  const context = useContext(CaseContext);
  if (!context) throw new Error("useCase must be used within a CaseProvider");
  return context;
};
