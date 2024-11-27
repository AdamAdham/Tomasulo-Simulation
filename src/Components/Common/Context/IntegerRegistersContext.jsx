import React, { createContext, useState } from "react";

// Create Context
export const IntegerRegistersContext = createContext();

// Create Provider Component
let temp = {};
for (let i = 0; i < 30; i++) {
  temp[`R${i}`] = { value: 0, Qi: 0 };
}
export const IntegerRegistersProvider = ({ children }) => {
  const [integerRegisters, setIntegerRegisters] = useState(temp);

  return (
    <IntegerRegistersContext.Provider
      value={{ integerRegisters, setIntegerRegisters }}
    >
      {children}
    </IntegerRegistersContext.Provider>
  );
};
