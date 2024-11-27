import React, { createContext, useEffect, useState } from "react";
import { useFetcher } from "react-router-dom";

// Create the context
export const CacheContext = createContext();

// Create the provider component
export const CacheProvider = ({ children }) => {
  const [cacheLatency, setCacheLatency] = useState(1); // Default value
  const [cachePenalty, setCachePenalty] = useState(10); // Default value
  const [cacheSize, setCacheSize] = useState(1024); // Default value in KB
  const [blockSize, setBlockSize] = useState(64); // Default value in bytes
  const [cache, setCache] = useState([]);

  const initializeCache = () => {
    let sets = cacheSize / blockSize;
    let cacheTemp = [];
    let block = [];
    for (let i = 0; i < blockSize / 8; i++) {
      // create block of size BlockSize/8
      block.push(0);
    }
    for (let i = 0; i < sets; i++) {
      // create block of size BlockSize/8
      cacheTemp.push(block);
    }
    setCache(cacheTemp);
  };

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
        cache,
        setCache,
        initializeCache,
      }}
    >
      {children}
    </CacheContext.Provider>
  );
};
