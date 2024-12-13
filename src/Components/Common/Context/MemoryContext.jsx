import React, { createContext, memo, useState } from "react";
import { memorySize } from "../../../Constants/Constants";

// Create Context
export const MemoryContext = createContext();
const memoryTemp = Array(memorySize)
  .fill("00000001")
  .map((_, index) => {
    let value = index % 256;
    return value.toString(2).padStart("0");
  });
// Create Provider Component
export const MemoryProvider = ({ children }) => {
  const [memory, setMemory] = useState(memoryTemp);

  return (
    <MemoryContext.Provider value={{ memory, setMemory }}>
      {children}
    </MemoryContext.Provider>
  );
};
