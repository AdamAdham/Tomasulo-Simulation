import React, { createContext, useState } from "react";

// Create the context
export const CacheContext = createContext();

// Create the provider component
export const CacheProvider = ({ children }) => {
  const [cacheLatency, setCacheLatency] = useState(1); // Default value
  const [cachePenalty, setCachePenalty] = useState(10); // Default value
  const [cacheSize, setCacheSize] = useState(1024); // Default value in KB
  const [blockSize, setBlockSize] = useState(64); // Default value in bytes

  return (
    <CacheContext.Provider
      value={{
        cacheLatency,
        setCacheLatency,
        cachePenalty,
        setCachePenalty,
        cacheSize,
        setCacheSize,
        blockSize,
        setBlockSize,
      }}
    >
      {children}
    </CacheContext.Provider>
  );
};
