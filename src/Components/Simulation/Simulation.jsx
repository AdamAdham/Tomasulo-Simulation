import React, { useState, useContext, useEffect } from "react";
import { Divider, Tabs } from "antd";

import { CacheContext } from "../Common/Context/CacheContext";
import { IntegerRegistersContext } from "../Common/Context/IntegerRegistersContext";
import { FloatingRegistersContext } from "../Common/Context/FloatingRegistersContext";
import { InstructionsContext } from "../Common/Context/InstructionsContext";
import { ClockContext } from "../Common/Context/ClockContext";
import { SimulationContext } from "../Common/Context/SimulationContext";

import DisplayRegisters from "../Common/DisplayRegisters";
import DisplayInstructionsSimulation from "../Common/DisplayInstructionsSimulation";
import ClockControl from "../Common/ClockControl";
import { ResourcesContext } from "../Common/Context/ResourcesContext";
import DisplayStations from "../Common/DisplayStations";
import DisplayStation from "../Common/DisplayStation";
import { simulateNextClock } from "../Common/Functions";

const Simulation = () => {
  const { instructions, setInstructions } = useContext(InstructionsContext);
  const { integerRegisters, setIntegerRegisters } = useContext(
    IntegerRegistersContext
  );
  const { floatingRegisters, setFloatingRegisters } = useContext(
    FloatingRegistersContext
  );
  const { clock, setClock, incrementClock, decrementClock, resetClock } =
    useContext(ClockContext);
  const { cache, setCache } = useContext(CacheContext);
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
  console.log("Instructions", instructions);
  console.log("integerRegister", integerRegisters);
  console.log("floatingRegister", floatingRegisters);

  console.log(loadBuffer, storeBuffer, addSubRes, mulDivRes, integerRes);

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
            <DisplayStation name={"Integer Res"} station={integerRes} />
          </div>
        ),
      },
    ]);
  }, [integerRegisters]);

  useEffect(() => {
    if (simulation[clock]) {
      // Have already done it
      setInstructions(simulation[clock].instructions);
      setIntegerRegisters(simulation[clock].integerRegisters);
      setFloatingRegisters(simulation[clock].floatingRegisters);
      setCache(simulation[clock].cache);
      setLoadBuffer(simulation[clock].loadBuffer);
      setStoreBuffer(simulation[clock].storeBuffer);
      setAddSubRes(simulation[clock].addSubRes);
      setMulDivRes(simulation[clock].setMulDivRes);
      setIntegerRes(simulation[clock].setIntegerRes);
    } else {
      // Has not been simulated
      // Generate new values
      // Give values of previous clock cycle
      // Get values of current cycle
      const nextSimulation = simulateNextClock(
        instructions,
        integerRegisters,
        floatingRegisters,
        cache,
        loadBuffer,
        storeBuffer,
        addSubRes,
        setMulDivRes,
        setIntegerRes,
        clock // Produce values for that clock cycle (current clock cycle)
      );

      // Set new values to be displayed
      if (!nextSimulation) return;
      setInstructions(simulation[clock].instructions);
      setIntegerRegisters(simulation[clock].integerRegisters);
      setFloatingRegisters(simulation[clock].floatingRegisters);
      setCache(simulation[clock].cache);
      setLoadBuffer(simulation[clock].loadBuffer);
      setStoreBuffer(simulation[clock].storeBuffer);
      setAddSubRes(simulation[clock].addSubRes);
      setMulDivRes(simulation[clock].setMulDivRes);
      setIntegerRes(simulation[clock].setIntegerRes);

      // Set new values so that when clk is the same again we just get the value directly with no simulation
      setSimulation((prev) => prev.push(nextSimulation));
    }
  }, [clock]);
  return (
    <div
      style={{
        marginTop: "0",
        paddingBottom: "30px",
        borderTop: "1px solid transparent",
      }}
    >
      <h1 style={{ marginTop: "30px", fontSize: "40px" }}>Simulation</h1>
      <Divider />
      <ClockControl
        clock={clock}
        incrementClock={incrementClock}
        decrementClock={decrementClock}
      />
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
