import React, { createContext, useContext, useState } from "react";

// Create the Clock Context
export const ClockContext = createContext();

// Create a Provider Component
export const ClockProvider = ({ children }) => {
  const [clock, setClock] = useState(0); // Initialize clock to 0

  // Function to increment the clock
  const incrementClock = () => setClock((prev) => prev + 1);

  // Function to decrement the clock
  const decrementClock = () => {
    setClock((prev) => {
      const temp = prev - 1;
      if (temp < 0) return 0;
      return temp;
    });
  };
  // Function to reset the clock
  const resetClock = () => setClock(0);

  return (
    <ClockContext.Provider
      value={{ clock, setClock, incrementClock, decrementClock, resetClock }}
    >
      {children}
    </ClockContext.Provider>
  );
};
