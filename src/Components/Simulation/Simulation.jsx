import React, { useState, useContext, useEffect } from "react";
import { Divider, Tabs } from "antd";
import { Button, IconButton } from "@mui/material";
import { KeyboardArrowLeft } from "@mui/icons-material";

import { CacheContext } from "../Common/Context/CacheContext";
import { IntegerRegistersContext } from "../Common/Context/IntegerRegistersContext";
import { FloatingRegistersContext } from "../Common/Context/FloatingRegistersContext";
import { InstructionsContext } from "../Common/Context/InstructionsContext";
import { ClockContext } from "../Common/Context/ClockContext";
import { SimulationContext } from "../Common/Context/SimulationContext";

import DisplayRegisters from "../Common/DisplayRegisters";
import DisplayInstructionsSimulation from "../Common/DisplayInstructionsSimulation";
import ClockControl from "../Common/ClockControl";
import DisplayStations from "../Common/DisplayStations";
import DisplayStation from "../Common/DisplayStation";

import { ResourcesContext } from "../Common/Context/ResourcesContext";
import {
  simulateNextClock,
  simulateNextClockQueue,
  initializeCache,
} from "../Common/Functions";
import { MemoryContext } from "../Common/Context/MemoryContext";
import { InstructionLatencyContext } from "../Common/Context/InstructionLatencyContext";
import DisplayMemory from "../Common/DisplayMemory";
import DisplayCache from "../Common/DisplayCache";
import DisplayLatencies from "../Common/DisplayLatencies";
import DisplayIntegerStation from "../Common/DisplayIntegerStation";

import { memorySize } from "../../Constants/Constants";

import { useNavigate } from "react-router-dom";
let historyInstructions = [];
let historyQueue = [];

const Simulation = () => {
  const navigate = useNavigate();
  const { instructions, setInstructions } = useContext(InstructionsContext);
  const { integerRegisters, setIntegerRegisters } = useContext(
    IntegerRegistersContext
  );
  const { floatingRegisters, setFloatingRegisters } = useContext(
    FloatingRegistersContext
  );
  const { clock, setClock } = useContext(ClockContext);
  const {
    cache,
    setCache,
    cacheLatency,
    setCacheLatency,
    cachePenalty,
    setCachePenalty,
    cacheSize,
    blockSize,
    validity,
    setValidity,
    tags,
    setTags,
  } = useContext(CacheContext);
  const { simulation, setSimulation } = useContext(SimulationContext);

  const [instructionQueue, setInstructionQueue] = useState([]);
  const {
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
  } = useContext(ResourcesContext);

  const {
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
  } = useContext(InstructionLatencyContext);
  const { memory, setMemory } = useContext(MemoryContext);
  const [tabItems, setTabItems] = useState([
    {
      key: "1",
      label: "Registers",
      children: (
        <DisplayRegisters
          integerRegisters={integerRegisters}
          floatingRegisters={floatingRegisters}
        />
      ),
    },
    {
      key: "2",
      label: "Stations",
      children: (
        <DisplayStations
          loadBuffer={loadBuffer}
          storeBuffer={storeBuffer}
          addSubRes={addSubRes}
          mulDivRes={mulDivRes}
          integerRes={integerRes}
        />
      ),
    },
    {
      key: "3",
      label: "Tab 3",
      children: "Content of Tab Pane 3",
    },
  ]);

  // To make sure the items are correctly represented
  useEffect(() => {
    setTabItems([
      {
        key: "1",
        label: "Registers",
        children: (
          <DisplayRegisters
            integerRegisters={integerRegisters}
            floatingRegisters={floatingRegisters}
          />
        ),
      },
      {
        key: "2",
        label: "Load & Store Buffer",
        children: (
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <DisplayStation name={"Load Buffer"} station={loadBuffer} />
            <DisplayStation name={"Store Buffer"} station={storeBuffer} />
          </div>
        ),
      },
      {
        key: "3",
        label: "Reservation Stations",
        children: (
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <DisplayStation name={"Add/Sub Res"} station={addSubRes} />
            <DisplayStation name={"Mul/Div Res"} station={mulDivRes} />
            <DisplayIntegerStation name={"Integer Res"} station={integerRes} />
          </div>
        ),
      },
      {
        key: "4",
        label: "Memory & Cache",
        children: (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "45% 45%",
              gridGap: "10%",
              margin: "50px 100px",
            }}
          >
            <DisplayMemory memory={memory} />
            <DisplayCache cache={cache} />
          </div>
        ),
      },
    ]);
  }, [
    integerRegisters,
    floatingRegisters,
    loadBuffer,
    storeBuffer,
    addSubRes,
    mulDivRes,
    integerRes,
    memory,
    cache,
  ]);

  const setContext = (simulationInstance) => {
    // console.log(simulationInstance.validity);

    setInstructionQueue([...simulationInstance.instructionQueue]);
    setIntegerRegisters({ ...simulationInstance.integerRegisters });
    setFloatingRegisters({ ...simulationInstance.floatingRegisters });
    setCache([...simulationInstance.cache]);
    setValidity([...simulationInstance.validity]);
    setTags([...simulationInstance.tags]);
    setMemory([...simulationInstance.memory]);
    setLoadBuffer([...simulationInstance.loadBuffer]);
    setStoreBuffer([...simulationInstance.storeBuffer]);
    setAddSubRes([...simulationInstance.addSubRes]);
    setMulDivRes([...simulationInstance.mulDivRes]);
    setIntegerRes([...simulationInstance.integerRes]);
  };

  const setStatistics = (simulationInstance) => {
    setCacheLatency(simulationInstance?.cacheLatency);
    setCachePenalty(simulationInstance?.cachePenalty);

    setLoadBufferSize(simulationInstance?.loadBufferSize);
    setStoreBufferSize(simulationInstance?.storeBufferSize);
    setAddSubResSize(simulationInstance?.addSubResSize);
    setMulDivResSize(simulationInstance?.mulDivResSize);
    setIntegerResSize(simulationInstance?.integerResSize);

    setLatencyStore(simulationInstance?.latencyStore);
    setLatencyLoad(simulationInstance?.latencyLoad);
    setLatencyAdd(simulationInstance?.latencyAdd);
    setLatencySub(simulationInstance?.latencySub);
    setLatencyMultiply(simulationInstance?.latencyMultiply);
    setLatencyDivide(simulationInstance?.latencyDivide);
    setLatencyIntegerAdd(simulationInstance?.latencyIntegerAdd);
    setLatencyIntegerSub(simulationInstance?.latencyIntegerSub);
    setLatencyBranch(simulationInstance?.latencyBranch);
  };

  useEffect(() => {
    if (historyInstructions[clock]) {
      setInstructions(historyInstructions[clock]?.instructions);
    }
    if (historyQueue[clock]) {
      // Have already done it
      setContext(historyQueue[clock]);
    } else {
      // Has not been simulated
      // Generate new values
      // Give values of previous clock cycle
      // Get values of current cycle

      // const nextSimulation = null;
      let nextSimulation = null;
      // console.log(historyInstructions);

      if (historyInstructions[clock - 1]) {
        nextSimulation = simulateNextClock(
          structuredClone(historyInstructions[clock - 1].instructions),
          structuredClone(historyInstructions[clock - 1].integerRegisters),
          structuredClone(historyInstructions[clock - 1].floatingRegisters),
          structuredClone(historyInstructions[clock - 1].cache),
          structuredClone(historyInstructions[clock - 1].memory),
          structuredClone(historyInstructions[clock - 1].validity),
          structuredClone(historyInstructions[clock - 1].tags),
          memorySize,
          cacheSize,
          blockSize,
          structuredClone(historyInstructions[clock - 1].loadBuffer),
          structuredClone(historyInstructions[clock - 1].storeBuffer),
          structuredClone(historyInstructions[clock - 1].addSubRes),
          structuredClone(historyInstructions[clock - 1].mulDivRes),
          structuredClone(historyInstructions[clock - 1].integerRes),

          // Instruction Latencies
          latencyStore,
          latencyLoad,
          latencyAdd,
          latencySub,
          latencyMultiply,
          latencyDivide,
          latencyIntegerAdd,
          latencyIntegerSub,
          latencyBranch,

          clock,

          // Resource Latencies
          cachePenalty
        );
      }

      // console.log("instructs b4", {
      //   instructionQueue: structuredClone(instructionQueue),
      //   instructions: structuredClone(instructions),
      //   integerRegisters: structuredClone(integerRegisters),
      //   floatingRegisters: structuredClone(floatingRegisters),
      //   cache: structuredClone(cache),
      //   memory: structuredClone(memory),
      //   validity: structuredClone(validity),
      //   tags: structuredClone(tags),
      //   memorySize,
      //   cacheSize,
      //   blockSize,
      //   loadBuffer: structuredClone(loadBuffer),
      //   storeBuffer: structuredClone(storeBuffer),
      //   addSubRes: structuredClone(addSubRes),
      //   mulDivRes: structuredClone(mulDivRes),
      //   integerRes: structuredClone(integerRes),

      //   // Instruction Latencies
      //   latencyStore,
      //   latencyLoad,
      //   latencyAdd,
      //   latencySub,
      //   latencyMultiply,
      //   latencyDivide,
      //   latencyIntegerAdd,
      //   latencyIntegerSub,
      //   latencyBranch,

      //   clock,

      //   // Resource Latencies
      //   cachePenalty,
      // });
      const nextSimulationQueue = simulateNextClockQueue(
        structuredClone(instructionQueue),
        structuredClone(instructions),
        structuredClone(integerRegisters),
        structuredClone(floatingRegisters),
        structuredClone(cache),
        structuredClone(memory),
        structuredClone(validity),
        structuredClone(tags),
        memorySize,
        cacheSize,
        blockSize,
        structuredClone(loadBuffer),
        structuredClone(storeBuffer),
        structuredClone(addSubRes),
        structuredClone(mulDivRes),
        structuredClone(integerRes),

        // Instruction Latencies
        latencyStore,
        latencyLoad,
        latencyAdd,
        latencySub,
        latencyMultiply,
        latencyDivide,
        latencyIntegerAdd,
        latencyIntegerSub,
        latencyBranch,

        clock,

        // Resource Latencies
        cachePenalty
      );
      // Set new values to be displayed
      if (!nextSimulation) return; // Error occured not sure TODO
      // Set new values so that when clk is the same again we just get the value directly with no simulation
      setInstructionQueue(nextSimulationQueue.instructions);
      setContext(nextSimulationQueue);
      historyQueue.push(nextSimulationQueue);
      // console.log(historyQueue);

      setInstructions(nextSimulation.instructions);
      historyInstructions.push(nextSimulation);
      // console.log(historyInstructions);

      // setSimulation((prev) => {
      //   if (!prev[clock]) {
      //     prev = [...prev, nextSimulation];
      //   } else {
      //     prev[clock] = nextSimulation;
      //   }
      //   return prev;
      // });
    }
  }, [clock]);

  useEffect(() => {
    if (simulation[clock]) {
      setContext(simulation[clock]);
    }
  }, [simulation]);

  // const loadInstructions = () => {
  //   setClock(0);
  //   const initialSimulation = JSON.parse(
  //     localStorage.getItem("initialSimulation")
  //   );
  //   const initialInstructions = JSON.parse(
  //     localStorage.getItem("initialInstructions")
  //   );
  //   initialSimulation.instructionQueue = [];
  //   setContext(initialSimulation);
  //   historyInstructions = [initialSimulation];
  //   setInstructions(initialInstructions);
  // };

  // const resetSimulation = () => {
  //   setClock(0);
  //   setInstructions([]);
  //   let temp = {};
  //   // for (let i = 0; i < 30; i++) {
  //   //   temp[`R${i}`] = { value: 0, Qi: 0 };
  //   // }
  //   for (let i = 0; i < 30; i++) {
  //     temp[`R${i}`] = { value: i, Qi: 0 };
  //   }
  //   setIntegerRegisters(temp);

  //   let floatingTemp = {};
  //   // for (let i = 0; i < 30; i++) {
  //   //   temp[`F${i}`] = { value: 0, Qi: 0 };
  //   // }
  //   for (let i = 0; i < 30; i++) {
  //     floatingTemp[`F${i}`] = { value: i, Qi: 0 };
  //   }
  //   setFloatingRegisters(floatingTemp);

  //   const cacheInit = initializeCache();
  //   setCache(cacheInit);

  //   setMemory(Array(memorySize).fill(0));
  //   const initialSimulation = JSON.parse(
  //     localStorage.getItem("initialSimulation")
  //   );

  //   setLoadBuffer([]);
  //   setStoreBuffer([]);
  //   setAddSubRes([]);
  //   setMulDivRes([]);
  //   setIntegerRes([]);

  //   initialSimulation.instructionQueue = [];
  //   setContext(initialSimulation);
  //   historyInstructions = [initialSimulation];
  // };

  const goBack = () => {
    setClock(0);
    const initialSimulation = JSON.parse(
      localStorage.getItem("initialSimulation")
    );
    initialSimulation.instructionQueue = [];
    setContext(initialSimulation);
    // const memoryTemp = Array(memorySize)
    //   .fill("00000000")
    //   .map((_, index) => {
    //     let value = index % 256;
    //     return value.toString(2).padStart(8, "0");
    //   });
    // setMemory(memoryTemp);
    historyInstructions = [initialSimulation];
    historyQueue = [initialSimulation];
    navigate("/");
  };

  useEffect(() => {
    setClock(0);
    const initialSimulation = JSON.parse(
      localStorage.getItem("initialSimulation")
    );
    initialSimulation.instructionQueue = [];
    setContext(initialSimulation);
    setStatistics(initialSimulation);
    historyInstructions = [initialSimulation];
    historyQueue = [initialSimulation];
  }, []);

  return (
    <div
      style={{
        marginTop: "0",
        paddingBottom: "30px",
        borderTop: "1px solid transparent",
      }}
    >
      <IconButton
        color="#192126"
        style={{
          position: "absolute",
          left: "50px",
          top: "40px",
          height: "40px",
          width: "40px",
          backgroundColor: "#171c1f",
        }}
        onClick={goBack}
      >
        <KeyboardArrowLeft style={{ fontSize: "30px" }} />
      </IconButton>
      <h1 style={{ marginTop: "30px", fontSize: "40px" }}>Simulation</h1>
      <Divider />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex" }}>
          {/* <Button
            variant="outlined"
            color="error"
            style={{ margin: "40px", fontSize: "15px", borderRadius: "10px" }}
            onClick={resetSimulation}
          >
            Reset
          </Button>

          <Button
            variant="outlined"
            style={{ margin: "40px", fontSize: "15px", borderRadius: "10px" }}
            onClick={loadInstructions}
          >
            Load
          </Button> */}
        </div>

        <ClockControl />
      </div>
      <DisplayLatencies />
      <DisplayInstructionsSimulation instructions={instructionQueue} />
      <DisplayInstructionsSimulation instructions={instructions} />

      <Divider />
      <Tabs
        centered
        defaultActiveKey="1"
        items={tabItems}
        // onChange={onChange}
      />
    </div>
  );
};
export default Simulation;
