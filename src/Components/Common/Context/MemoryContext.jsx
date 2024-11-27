import React, { createContext, memo, useState } from "react";
import { memorySize } from "../../../Constants/Constants";

// Create Context
export const MemoryContext = createContext();
// Create Provider Component
export const MemoryProvider = ({ children }) => {
  const [memory, setMemory] = useState(Array(memorySize).fill(0));
  console.log(memory);

  return (
    <MemoryContext.Provider value={{ memory, setMemory }}>
      {children}
    </MemoryContext.Provider>
  );
};
