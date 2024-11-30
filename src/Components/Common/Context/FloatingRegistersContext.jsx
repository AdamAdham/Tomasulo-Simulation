import React, { createContext, useState } from "react";

// Create Context
export const FloatingRegistersContext = createContext();

let temp = {};
// for (let i = 0; i < 30; i++) {
//   temp[`F${i}`] = { value: 0, Qi: 0 };
// }
for (let i = 0; i < 30; i++) {
  temp[`F${i}`] = { value: i, Qi: 0 };
}
// Create Provider Component
export const FloatingRegistersProvider = ({ children }) => {
  const [floatingRegisters, setFloatingRegisters] = useState(temp);

  return (
    <FloatingRegistersContext.Provider
      value={{ floatingRegisters, setFloatingRegisters }}
    >
      {children}
    </FloatingRegistersContext.Provider>
  );
};
