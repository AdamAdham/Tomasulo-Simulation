import React, { createContext, useState } from "react";

// Create Context
export const SimulationContext = createContext();

// Create Provider Component
export const SimulationProvider = ({ children }) => {
  const [simulation, setSimulation] = useState([]);

  return (
    <SimulationContext.Provider value={{ simulation, setSimulation }}>
      {children}
    </SimulationContext.Provider>
  );
};
