import React, { createContext, useState } from "react";

// Create Context
export const InstructionsContext = createContext();

// Create Provider Component
export const InstructionsProvider = ({ children }) => {
  const [instructions, setInstructions] = useState([]);

  return (
    <InstructionsContext.Provider value={{ instructions, setInstructions }}>
      {children}
    </InstructionsContext.Provider>
  );
};
