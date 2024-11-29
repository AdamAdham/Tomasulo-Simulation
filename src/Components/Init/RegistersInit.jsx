import React, { useState, useContext, useEffect } from "react";
import { Table } from "antd";
import "./InstructionSelection.css";
import DropDown from "../Common/DropDown";
import TextField from "@mui/material/TextField";
import { IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

import { FloatingRegistersContext } from "../Common/Context/FloatingRegistersContext";
import { IntegerRegistersContext } from "../Common/Context/IntegerRegistersContext";
import DisplayIntegerRegisters from "../Common/DisplayIntegerRegisters";
import DisplayfloatingRegisters from "../Common/DisplayFloatingRegisters";

const columns = [
  {
    title: "Register",
    dataIndex: "registerName",
  },
  {
    title: "Qi",
    dataIndex: "Qi",
  },
  {
    title: "Value",
    dataIndex: "value",
  },
];
const RegistersInit = () => {
  const { integerRegisters, setIntegerRegisters } = useContext(
    IntegerRegistersContext
  );

  const { floatingRegisters, setFloatingRegisters } = useContext(
    FloatingRegistersContext
  );
  console.log(floatingRegisters);

  const [floatingRegister, setFloatingRegister] = useState("F0");
  const [floatingValue, setFloatingValue] = useState(0);

  const [integerRegister, setIntegerRegister] = useState("R0");
  const [integerValue, setIntegerValue] = useState(0);

  const modifyFloatingRegister = () => {
    setFloatingRegisters((prev) => ({
      ...prev,
      [floatingRegister]: {
        ...prev[floatingRegister],
        value: parseFloat(floatingValue),
      }, // why add here parseFloat? Because we allow the user to enter a number ending with '.' to continue there value, so if left ending with . and did not parseFloat will get added as string
    }));
  };

  const modifyIntegerRegister = () => {
    setIntegerRegisters((prev) => ({
      ...prev,
      [integerRegister]: { ...prev[integerRegister], value: integerValue },
    }));
  };

  const handleRegisterValue = (value, type) => {
    let temp = value; // Keep the raw input for intermediate states

    if (type === "integer") {
      temp = parseInt(value, 10);
      if (isNaN(temp)) {
        temp = 0; // Default to 0 if the input is not a valid number
      } else if (temp > 1.8446744e19) {
        temp = 1.8446744e19;
      }
      setIntegerValue(temp);
    } else {
      // For floating-point, handle intermediate input
      if (!isNaN(parseFloat(value)) || value.endsWith(".")) {
        setFloatingValue(value); // Temporarily allow invalid intermediate values like "5."
      } else if (value === "") {
        setFloatingValue(""); // Allow empty input
      }
    }
  };
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "45% 45%",
        gridGap: "10%",
        margin: "50px 40px",
      }}
    >
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
          <DropDown
            value={integerRegister}
            label={"Register"}
            onChange={(e) => setIntegerRegister(e.target.value)}
            dropDownItems={Object.keys(integerRegisters)}
          />
          <TextField
            id="outlined-basic"
            label="Value"
            variant="outlined"
            value={integerValue}
            onChange={(e) => handleRegisterValue(e.target.value, "integer")}
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
            onClick={modifyIntegerRegister}
          >
            <CheckIcon style={{ fontSize: "20px" }} />
          </IconButton>
        </div>

        <DisplayIntegerRegisters integerRegisters={integerRegisters} />
      </div>
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
          <DropDown
            value={floatingRegister}
            label={"Register"}
            onChange={(e) => setFloatingRegister(e.target.value)}
            dropDownItems={Object.keys(floatingRegisters)}
          />
          <TextField
            id="outlined-basic"
            label="Value"
            variant="outlined"
            value={floatingValue}
            onChange={(e) => handleRegisterValue(e.target.value, "floating")}
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
            onClick={modifyFloatingRegister}
          >
            <CheckIcon style={{ fontSize: "20px" }} />
          </IconButton>
        </div>

        <DisplayfloatingRegisters floatingRegisters={floatingRegisters} />
      </div>
    </div>
  );
};

export default RegistersInit;
