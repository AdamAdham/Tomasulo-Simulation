import React, { createContext, memo, useState } from "react";
import { memorySize } from "../../../Constants/Constants";

// Create Context
export const MemoryContext = createContext();
const memoryTemp = Array(memorySize)
  .fill(0)
  .map((_, index) => index);
// Create Provider Component
export const MemoryProvider = ({ children }) => {
  const [memory, setMemory] = useState(memoryTemp);

  return (
    <MemoryContext.Provider value={{ memory, setMemory }}>
      {children}
    </MemoryContext.Provider>
  );
};
