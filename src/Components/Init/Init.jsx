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

const Init = () => {
  const navigate = useNavigate();
  const { initializeCache } = useContext(CacheContext);
  const { instructions } = useContext(InstructionsContext);
  const { cache } = useContext(CacheContext);
  const {
    initializeResources,
    loadBuffer,
    storeBuffer,
    addSubRes,
    mulDivRes,
    integerRes,
  } = useContext(ResourcesContext);
  const { simulation, setSimulation } = useContext(SimulationContext);

  // const [instructions, setInstructions] = useState([]);
  const startSimulation = () => {
    initializeCache();

    initializeResources();

    // Init simulation clock cycle 0
    setSimulation({
      instructions,
      cache,
      loadBuffer,
      storeBuffer,
      addSubRes,
      mulDivRes,
      integerRes,
    });
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
