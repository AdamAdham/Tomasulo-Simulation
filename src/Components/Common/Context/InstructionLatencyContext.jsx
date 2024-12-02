import React, { createContext, useState } from "react";

// Create the context
export const InstructionLatencyContext = createContext();

// Create the provider component
export const InstructionLatencyProvider = ({ children }) => {
  const [latencyStore, setLatencyStore] = useState(1); // Default latency for `store`
  const [latencyLoad, setLatencyLoad] = useState(1); // Default latency for `load`
  const [latencyAdd, setLatencyAdd] = useState(1); // Default latency for `add`
  const [latencySub, setLatencySub] = useState(1); // Default latency for `sub`
  const [latencyMultiply, setLatencyMultiply] = useState(2); // Default latency for `multiply`
  const [latencyDivide, setLatencyDivide] = useState(5); // Default latency for `divide`
  const [latencyIntegerAdd, setLatencyIntegerAdd] = useState(1);
  const [latencyIntegerSub, setLatencyIntegerSub] = useState(1);
  const [latencyBranch, setLatencyBranch] = useState(1);

  return (
    <InstructionLatencyContext.Provider
      value={{
        latencyStore,
        setLatencyStore,
        latencyLoad,
        setLatencyLoad,
        latencyAdd,
        setLatencyAdd,
        latencySub,
        setLatencySub,
        latencyMultiply,
        setLatencyMultiply,
        latencyDivide,
        setLatencyDivide,
        latencyIntegerAdd,
        setLatencyIntegerAdd,
        latencyIntegerSub,
        setLatencyIntegerSub,
        latencyBranch,
        setLatencyBranch,
      }}
    >
      {children}
    </InstructionLatencyContext.Provider>
  );
};
