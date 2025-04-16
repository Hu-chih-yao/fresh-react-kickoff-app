
import React, { createContext, useContext, useState } from 'react';
import { SoapNoteData } from '../components/soap-notes/SoapNote';

// Interface for the SoapNote context
interface SoapNoteContextType {
  soapNoteData: SoapNoteData;
  updateSoapNote: (data: Partial<SoapNoteData>) => void;
  resetSoapNote: () => void;
  hasChanges: boolean;
}

// Default SOAP note data
const defaultSoapNoteData: SoapNoteData = {
  patientName: "Anonymous Patient",
  dateOfBirth: "",
  visitDate: new Date().toISOString().split('T')[0],
  chiefComplaint: "",
  subjective: "",
  objective: "Virtual consultation - no physical examination performed",
  assessment: "",
  plan: "",
  icdCodes: []
};

// Create the context
const SoapNoteContext = createContext<SoapNoteContextType | undefined>(undefined);

// Provider component
export const SoapNoteProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [soapNoteData, setSoapNoteData] = useState<SoapNoteData>(defaultSoapNoteData);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Function to update the SOAP note data partially
  const updateSoapNote = (data: Partial<SoapNoteData>) => {
    setSoapNoteData(prev => {
      const newData = { ...prev };
      
      // Update fields with non-empty values
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // For string fields, append new content if the field already has content
          if (typeof value === 'string' && typeof newData[key as keyof SoapNoteData] === 'string') {
            // Only append if there's new information that isn't already included
            const existingValue = newData[key as keyof SoapNoteData] as string;
            
            if (existingValue && value && !existingValue.includes(value)) {
              newData[key as keyof SoapNoteData] = `${existingValue}\n${value}` as any;
            } else if (!existingValue) {
              newData[key as keyof SoapNoteData] = value as any;
            }
          } else {
            newData[key as keyof SoapNoteData] = value as any;
          }
        }
      });
      
      return newData;
    });
    
    setHasChanges(true);
  };
  
  // Function to reset the SOAP note
  const resetSoapNote = () => {
    setSoapNoteData(defaultSoapNoteData);
    setHasChanges(false);
  };
  
  return (
    <SoapNoteContext.Provider value={{ 
      soapNoteData, 
      updateSoapNote, 
      resetSoapNote,
      hasChanges
    }}>
      {children}
    </SoapNoteContext.Provider>
  );
};

// Custom hook to use the SoapNote context
export const useSoapNote = () => {
  const context = useContext(SoapNoteContext);
  if (context === undefined) {
    throw new Error('useSoapNote must be used within a SoapNoteProvider');
  }
  return context;
};
