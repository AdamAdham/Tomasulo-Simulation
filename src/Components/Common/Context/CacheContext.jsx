import React, { createContext, useEffect, useState } from "react";
import { useFetcher } from "react-router-dom";

// Create the context
export const CacheContext = createContext();

// Create the provider component
export const CacheProvider = ({ children }) => {
  const [cacheLatency, setCacheLatency] = useState(1); // Default value
  const [cachePenalty, setCachePenalty] = useState(5); // Default value
  const [cacheSize, setCacheSize] = useState(128);
  const [blockSize, setBlockSize] = useState(32);
  const [cache, setCache] = useState([]);
  const [validity, setValidity] = useState([]);
  const [tags, setTags] = useState([]);

  const initializeCache = () => {
    let sets = cacheSize / blockSize;
    let cacheTemp = [];
    let block = [];
    let tagsTemp = [];
    let validityTemp = [];
    for (let i = 0; i < blockSize / 8; i++) {
      // create block of size BlockSize/8
      block.push("empty");
    }
    for (let i = 0; i < sets; i++) {
      // create block of size BlockSize/8
      cacheTemp.push(block);
      tagsTemp.push("empty");
      validityTemp.push(0);
    }

    setCache(cacheTemp);
    setValidity(validityTemp);
    setTags(tagsTemp);
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
        validity,
        setValidity,
        tags,
        setTags,
      }}
    >
      {children}
    </CacheContext.Provider>
  );
};
