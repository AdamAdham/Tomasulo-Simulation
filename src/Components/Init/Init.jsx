import React, { useState } from "react";
import Colors from "../../Constants/Colors";
import InstructionSelection from "./InstructionSelection";
import DisplayInstructions from "./DisplayInstructions";
import { Divider } from "antd";
import RegistersInit from "./RegistersInit";
import InitStatistics from "./InitStatistics";
const Init = () => {
  const [instructions, setInstructions] = useState([]);

  return (
    <div
      style={{
        backgroundColor: Colors.background,
        border: "1px solid transparent", // Due to margin collapse
      }}
    >
      <h1
        style={{ marginTop: "80px", marginBottom: "120px", fontSize: "50px" }}
      >
        Initialize Simulation
        <Divider />
      </h1>

      <h1>Initialize Instructions</h1>
      <InstructionSelection
        instructions={instructions}
        setInstructions={setInstructions}
      />
      <DisplayInstructions instructions={instructions} />
      <Divider />

      <h1>Initialize Memory</h1>
      <div>Still questions</div>
      <Divider />
      <h1>Initialize Registers</h1>
      <RegistersInit />
      <Divider />
      <h1>Initialize Statistics</h1>
      <InitStatistics />
    </div>
  );
};

export default Init;
