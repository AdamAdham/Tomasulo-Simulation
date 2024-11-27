import React, { createContext, useState } from "react";

// Create the context
export const ResourcesContext = createContext();

// Provide the context
export const ResourcesProvider = ({ children }) => {
  const [loadBuffer, setLoadBuffer] = useState(0);
  const [storeBuffer, setStoreBuffer] = useState(0);
  const [addSubRes, setAddSubRes] = useState(0);
  const [mulDivRes, setMulDivRes] = useState(0);
  const [integerRes, setIntegerRes] = useState(0);

  return (
    <ResourcesContext.Provider
      value={{
        loadBuffer,
        setLoadBuffer,
        storeBuffer,
        setStoreBuffer,
        addSubRes,
        setAddSubRes,
        mulDivRes,
        setMulDivRes,
        integerRes,
        setIntegerRes,
      }}
    >
      {children}
    </ResourcesContext.Provider>
  );
};
