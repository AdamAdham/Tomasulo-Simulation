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

const Init = () => {
  const navigate = useNavigate();
  const { instructions } = useContext(InstructionsContext);
  const { cacheSize, blockSize, cache, setCache } = useContext(CacheContext);
  const { memory } = useContext(MemoryContext);
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
    const updatedCache = initializeCache(cacheSize, blockSize);
    setCache(updatedCache);

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
        instructions,
        integerRegisters,
        floatingRegisters,
        cache: updatedCache,
        memory,
        loadBuffer: loadBufferUpdated,
        storeBuffer: storeBufferUpdated,
        addSubRes: addSubResUpdated,
        mulDivRes: mulDivResUpdated,
        integerRes: integerResUpdated,
      },
    ]);
    localStorage.setItem(
      "initialSimulation",
      JSON.stringify({
        instructions,
        integerRegisters,
        floatingRegisters,
        cache: updatedCache,
        memory,
        loadBuffer: loadBufferUpdated,
        storeBuffer: storeBufferUpdated,
        addSubRes: addSubResUpdated,
        mulDivRes: mulDivResUpdated,
        integerRes: integerResUpdated,
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
      <Divider />

      <h1>Initialize Memory</h1>
      <div>Still questions</div>
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
