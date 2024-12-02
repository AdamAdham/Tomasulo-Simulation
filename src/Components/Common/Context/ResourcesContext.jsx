import React, { createContext, useState } from "react";

// Create the context
export const ResourcesContext = createContext();

// Provide the context
export const ResourcesProvider = ({ children }) => {
  const [loadBufferSize, setLoadBufferSize] = useState(3);
  const [storeBufferSize, setStoreBufferSize] = useState(3);
  const [addSubResSize, setAddSubResSize] = useState(3);
  const [mulDivResSize, setMulDivResSize] = useState(3);
  const [integerResSize, setIntegerResSize] = useState(3);

  const [loadBuffer, setLoadBuffer] = useState([]);
  const [storeBuffer, setStoreBuffer] = useState([]);
  const [addSubRes, setAddSubRes] = useState([]);
  const [mulDivRes, setMulDivRes] = useState([]);
  const [integerRes, setIntegerRes] = useState([]);

  const initializeResources = () => {
    const element = {
      busy: 0,
      opcode: null,
      Vj: null,
      Vk: null,
      Qj: 0,
      Qk: 0,
      A: null,
    };
    const loadBufferTemp = [];
    for (let i = 0; i < loadBufferSize; i++) {
      loadBufferTemp.push(element);
    }
    setLoadBuffer(loadBufferTemp);

    const storeBufferTemp = [];
    for (let i = 0; i < storeBufferSize; i++) {
      storeBufferTemp.push(element);
    }
    setStoreBuffer(storeBufferTemp);

    const addSubResTemp = [];
    for (let i = 0; i < addSubResSize; i++) {
      addSubResTemp.push(element);
    }
    setAddSubRes(addSubResTemp);

    const mulDivResTemp = [];
    for (let i = 0; i < mulDivResSize; i++) {
      mulDivResTemp.push(element);
    }
    setMulDivRes(mulDivResTemp);

    const integerResTemp = [];
    for (let i = 0; i < integerResSize; i++) {
      integerResTemp.push(element);
    }
    setIntegerRes(integerResTemp);
  };

  return (
    <ResourcesContext.Provider
      value={{
        loadBufferSize,
        setLoadBufferSize,
        storeBufferSize,
        setStoreBufferSize,
        addSubResSize,
        setAddSubResSize,
        mulDivResSize,
        setMulDivResSize,
        integerResSize,
        setIntegerResSize,
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
        initializeResources,
      }}
    >
      {children}
    </ResourcesContext.Provider>
  );
};
