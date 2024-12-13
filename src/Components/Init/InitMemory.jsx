import React, { useState, useContext } from "react";
import { IconButton, TextField } from "@mui/material";
import DropDown from "../Common/DropDown";

import CheckIcon from "@mui/icons-material/Check";
import { MemoryContext } from "../Common/Context/MemoryContext";
import DisplayMemory from "../Common/DisplayMemory";
import { memorySize } from "../../Constants/Constants";
import { originalWrite } from "../Common/Context/MemoryAccess";
import { CacheContext } from "../Common/Context/CacheContext";

const InitMemory = () => {
  const { memory, setMemory } = useContext(MemoryContext);

  const [memoryAddress, setMemoryAddress] = useState("");
  const [value, setValue] = useState("");

  const handleAddress = (value) => {
    let temp = value; // Keep the raw input for intermediate states
    temp = parseInt(value, 10);
    if (isNaN(temp)) {
      temp = 0; // Default to 0 if the input is not a valid number
    } else if (temp >= memorySize - 1) {
      temp = memorySize - 1;
    }
    setMemoryAddress(temp);
  };

  const handleValue = (value) => {
    let temp = value; // Keep the raw input for intermediate states

    // For floating-point, handle intermediate input
    if (!isNaN(parseFloat(value)) || value.endsWith(".")) {
      setValue(value); // Temporarily allow invalid intermediate values like "5."
    } else if (value === "") {
      setValue(""); // Allow empty input
    }
  };

  const modifyMemory = () => {
    setMemory((prev) => {
      const newMemory = [...prev];
      newMemory[memoryAddress] = parseFloat(value);
      return newMemory;
    });
  };
  return (
    <div>
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <TextField
          id="outlined-basic"
          label="Address"
          variant="outlined"
          value={memoryAddress}
          onChange={(e) => handleAddress(e.target.value)}
          style={{ width: "110px", marginLeft: "20px" }}
        />
        <TextField
          id="outlined-basic"
          label="Value"
          variant="outlined"
          value={value}
          onChange={(e) => handleValue(e.target.value)}
          style={{ width: "110px", marginLeft: "20px" }}
        />
        <IconButton
          color="primary"
          style={{
            height: "30px",
            width: "30px",
            position: "absolute",
            right: "100px",
            backgroundColor: "#192126",
          }}
          onClick={modifyMemory}
        >
          <CheckIcon style={{ fontSize: "20px" }} />
        </IconButton>
      </div>
      <div style={{ width: "50%", margin: "0 auto" }}>
        <DisplayMemory memory={memory} />
      </div>
    </div>
  );
};

export default InitMemory;
