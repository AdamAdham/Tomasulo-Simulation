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
import { simulateNextClock } from "../Common/Functions";
import { MemoryContext } from "../Common/Context/MemoryContext";
import { InstructionLatencyContext } from "../Common/Context/InstructionLatencyContext";
import DisplayMemory from "../Common/DisplayMemory";
import DisplayCache from "../Common/DisplayCache";
import DisplayLatencies from "../Common/DisplayLatencies";
import DisplayIntegerStation from "../Common/DisplayIntegerStation";

import { useNavigate } from "react-router-dom";
let history = [];

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
  const { cache, setCache, cachePenalty } = useContext(CacheContext);
  const { simulation, setSimulation } = useContext(SimulationContext);
  const {
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
    latencyLoad,
    latencyAdd,
    latencySub,
    latencyMultiply,
    latencyDivide,
    latencyIntegerAdd,
    latencyIntegerSub,
    latencyBranch,
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
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <DisplayMemory memory={memory} />
            <DisplayCache cache={cache} />
          </div>
        ),
      },
    ]);
  }, [integerRegisters]);

  const setContext = (simulationInstance) => {
    setInstructions([...simulationInstance.instructions]);
    setIntegerRegisters({ ...simulationInstance.integerRegisters });
    setFloatingRegisters({ ...simulationInstance.floatingRegisters });
    setCache([...simulationInstance.cache]);
    setMemory([...simulationInstance.memory]);
    setLoadBuffer([...simulationInstance.loadBuffer]);
    setStoreBuffer([...simulationInstance.storeBuffer]);
    setAddSubRes([...simulationInstance.addSubRes]);
    setMulDivRes([...simulationInstance.mulDivRes]);
    setIntegerRes([...simulationInstance.integerRes]);
  };
  useEffect(() => {
    if (history[clock]) {
      // Have already done it
      setContext(history[clock]);
    } else {
      // Has not been simulated
      // Generate new values
      // Give values of previous clock cycle
      // Get values of current cycle

      const nextSimulation = simulateNextClock(
        structuredClone(instructions),
        structuredClone(integerRegisters),
        structuredClone(floatingRegisters),
        structuredClone(cache),
        structuredClone(memory),
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
      setContext(nextSimulation);
      history.push(nextSimulation);
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

  const resetSimulation = () => {
    setClock(0);
    const initialSimulation = JSON.parse(
      localStorage.getItem("initialSimulation")
    );
    const initialInstructions = JSON.parse(
      localStorage.getItem("initialInstructions")
    );

    initialSimulation.instructions = initialInstructions;
    setContext(initialSimulation);
    history = [initialSimulation];
  };

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
        onClick={() => {
          navigate("/");
        }}
      >
        <KeyboardArrowLeft style={{ fontSize: "30px" }} />
      </IconButton>
      <h1 style={{ marginTop: "30px", fontSize: "40px" }}>Simulation</h1>
      <Divider />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="outlined"
          color="error"
          style={{ margin: "40px", fontSize: "15px", borderRadius: "10px" }}
          onClick={resetSimulation}
        >
          Reset
        </Button>
        <ClockControl />
      </div>
      <DisplayLatencies />
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
