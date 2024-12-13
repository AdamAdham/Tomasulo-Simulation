import React, { useState, useContext } from "react";
import Colors from "../../Constants/Colors";
import InstructionSelection from "./InstructionSelection";
import DisplayInstructions from "./DisplayInstructions";
import { Divider } from "antd";
import RegistersInit from "./RegistersInit";
import InitStatistics from "./InitStatistics";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { CacheContext } from "../Common/Context/CacheContext";
import { InstructionsContext } from "../Common/Context/InstructionsContext";
import { ResourcesContext } from "../Common/Context/ResourcesContext";
import { SimulationContext } from "../Common/Context/SimulationContext";
import { IntegerRegistersContext } from "../Common/Context/IntegerRegistersContext";
import { FloatingRegistersContext } from "../Common/Context/FloatingRegistersContext";
import { initializeCache, initializeResources } from "../Common/Functions";
import { MemoryContext } from "../Common/Context/MemoryContext";
import InitMemory from "./InitMemory";
import { InstructionLatencyContext } from "../Common/Context/InstructionLatencyContext";

const Init = () => {
  const navigate = useNavigate();
  const { instructions } = useContext(InstructionsContext);
  const {
    cache,
    setCache,
    cacheLatency,
    cachePenalty,
    cacheSize,
    blockSize,
    validity,
    setValidity,
    tags,
    setTags,
  } = useContext(CacheContext);

  const {
    latencyStore,
    latencyLoad,
    latencyAdd,
    latencySub,
    latencyMultiply,
    latencyDivide,
    latencyIntegerAdd,
    latencyIntegerSub,
    latencyBranch,
  } = useContext(InstructionLatencyContext);

  const { memory, memorySize } = useContext(MemoryContext);
  const {
    // initializeResources,
    loadBufferSize,
    storeBufferSize,
    addSubResSize,
    mulDivResSize,
    integerResSize,
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
  } = useContext(ResourcesContext);
  const { integerRegisters } = useContext(IntegerRegistersContext);

  const { floatingRegisters } = useContext(FloatingRegistersContext);
  const { simulation, setSimulation } = useContext(SimulationContext);

  // const [instructions, setInstructions] = useState([]);
  const startSimulation = () => {
    const [updatedCache, tagsTemp, validityTemp] = initializeCache(
      cacheSize,
      blockSize
    );
    setCache(updatedCache);
    setValidity(validityTemp);
    setTags(tagsTemp);

    const updatedResources = initializeResources(
      loadBufferSize,
      storeBufferSize,
      addSubResSize,
      mulDivResSize,
      integerResSize
    );
    const loadBufferUpdated = updatedResources.loadBuffer;
    const storeBufferUpdated = updatedResources.storeBuffer;
    const addSubResUpdated = updatedResources.addSubRes;
    const mulDivResUpdated = updatedResources.mulDivRes;
    const integerResUpdated = updatedResources.integerRes;
    setLoadBuffer(loadBufferUpdated);
    setStoreBuffer(storeBufferUpdated);
    setAddSubRes(addSubResUpdated);
    setMulDivRes(mulDivResUpdated);
    setIntegerRes(integerResUpdated);

    // Init simulation clock cycle 0
    setSimulation([
      {
        instructionQueue: [],
        instructions,
        integerRegisters,
        floatingRegisters,
        cache: updatedCache,
        memory,
        validity: validityTemp,
        tags: tagsTemp,
        cacheSize,
        blockSize,
        loadBuffer: loadBufferUpdated,
        storeBuffer: storeBufferUpdated,
        addSubRes: addSubResUpdated,
        mulDivRes: mulDivResUpdated,
        integerRes: integerResUpdated,

        cacheLatency,
        cachePenalty,

        loadBufferSize,
        storeBufferSize,
        addSubResSize,
        mulDivResSize,
        integerResSize,

        latencyStore,
        latencyLoad,
        latencyAdd,
        latencySub,
        latencyMultiply,
        latencyDivide,
        latencyIntegerAdd,
        latencyIntegerSub,
        latencyBranch,
      },
    ]);
    localStorage.setItem(
      "initialSimulation",
      JSON.stringify({
        instructionQueue: [],
        instructions,
        integerRegisters,
        floatingRegisters,
        cache: updatedCache,
        memory,
        validity: validityTemp,
        tags: tagsTemp,
        cacheSize,
        blockSize,
        loadBuffer: loadBufferUpdated,
        storeBuffer: storeBufferUpdated,
        addSubRes: addSubResUpdated,
        mulDivRes: mulDivResUpdated,
        integerRes: integerResUpdated,

        cacheLatency,
        cachePenalty,

        loadBufferSize,
        storeBufferSize,
        addSubResSize,
        mulDivResSize,
        integerResSize,

        latencyStore,
        latencyLoad,
        latencyAdd,
        latencySub,
        latencyMultiply,
        latencyDivide,
        latencyIntegerAdd,
        latencyIntegerSub,
        latencyBranch,
      })
    );
    navigate("simulation");
  };
  return (
    <div
      style={{
        backgroundColor: Colors.background,
        border: "1px solid transparent", // Due to margin collapse
      }}
    >
      <h1
        style={{ marginTop: "80px", marginBottom: "100px", fontSize: "50px" }}
      >
        Initialize Simulation
        <Divider />
      </h1>
      <InstructionSelection />
      <DisplayInstructions />
      {/* <Divider />
          <h1>Initialize Memory</h1>
          <InitMemory /> */}
      <Divider />
      <h1>Initialize Registers</h1>
      <RegistersInit />
      <Divider />
      <h1>Initialize Statistics</h1>
      <InitStatistics />
      <Button
        variant="contained"
        style={{ margin: "40px", fontSize: "25px", borderRadius: "10px" }}
        onClick={startSimulation}
      >
        Start
      </Button>
    </div>
  );
};

export default Init;
