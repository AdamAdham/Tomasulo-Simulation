import React, { useEffect, useState, useContext } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "./InstructionSelection.css";
import DropDown from "../Common/DropDown";
import TextField from "@mui/material/TextField";
import Colors from "../../Constants/Colors";

import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import AlertTitle from "@mui/material/AlertTitle";
import { InstructionsContext } from "../Common/Context/InstructionsContext";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const opcodeList = [
  // ALU Operations (Floating-Point)
  "ADD.D", // Floating-Point Add
  "SUB.D", // Floating-Point Subtract
  "MUL.D", // Floating-Point Multiply
  "DIV.D", // Floating-Point Divide,

  // Integer Operations
  "ADDI", // Integer Add Immediate
  "SUBI", // Integer Subtract Immediate

  // Load Operations
  "LW", // Load Word
  "LD", // Load Double Word
  "L.S", // Load Single-Precision Floating Point
  "L.D", // Load Double-Precision Floating Point

  // Store Operations
  "SW", // Store Word
  "SD", // Store Double Word
  "S.S", // Store Single-Precision Floating Point
  "S.D", // Store Double-Precision Floating Point

  // Branch Instructions
  "BEQ", // Branch if Equal
  "BNE", // Branch if Not Equal
  "J", // Jump (unconditional branch)
];
const integerAluOpcodes = ["ADDI", "SUBI"];
const loadStoreOpcodes = ["LW", "LD", "L.S", "L.D", "SW", "SD", "S.S", "S.D"];
const floatingAluOpcodes = ["ADD.D", "SUB.D", "MUL.D", "DIV.D"];
const branchOpcodes = ["BEQ", "BNE", "J"];
const integerRegisters = Array.from({ length: 30 }, (_, index) => `R${index}`);
const floatingRegisters = Array.from({ length: 30 }, (_, index) => `F${index}`);

const InstructionSelection = () => {
  const { instructions, setInstructions } = useContext(InstructionsContext);

  const [errorMessage, setErrorMessage] = useState(null);

  const [label, setLabel] = useState(null);
  const [toLabel, setToLabel] = useState(null); // Destination is a label for branch intructions
  const [opcode, setOpcode] = useState(null);
  const [R1, setR1] = useState(null);
  const [R2, setR2] = useState(null);
  const [R3, setR3] = useState(null);
  const [immediate, setImmediate] = useState(null);
  const [effective, setEffective] = useState(null);
  const [openFeedback, setOpenFeedback] = useState(false);

  const resetValues = (except) => {
    if (except != 1) {
      setR1(null);
    } else {
      setR2(null);
      setR3(null);
      setImmediate(null);
      setEffective(null);
    }
  };
  useEffect(() => {
    resetValues();
    // Reset values
  }, [opcode]);
  const handleOpcodeChange = (event) => {
    setOpcode(event.target.value);
  };
  const handleR1Change = (event) => {
    setR1(event.target.value);
  };
  const handleR2Change = (event) => {
    setR2(event.target.value);
  };
  const handleR3Change = (event) => {
    setR3(event.target.value);
  };
  const handleImmediateChange = (event) => {
    let value = parseInt(event.target.value, 10); // Convert to integer
    if (isNaN(value)) {
      value = 0; // Default to 0 if the input is not a valid number
    } else if (value > 65535) {
      value = 65535;
    }
    setImmediate(value);
  };

  const handleEffectiveChange = (event) => {
    let value = parseInt(event.target.value, 10); // Convert to integer
    if (isNaN(value)) {
      value = 0; // Default to 0 if the input is not a valid number
    } else if (value > 65535) {
      value = 65535;
    }
    setEffective(value);
  };

  const handleLabelChange = (event) => {
    setLabel(event.target.value);
  };

  const handleToLabelChange = (event) => {
    setToLabel(event.target.value);
  };

  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    resetValues(1);
    setValue(newValue);
  };

  const addInstruction = () => {
    if (integerAluOpcodes.includes(opcode)) {
      if (R1 && R2 && immediate) {
        const instruction = { R1, R2, immediate, label, opcode };
        setInstructions((prev) => [...prev, instruction]); // Corrected to use array
      } else {
        setOpenFeedback(true);
        setErrorMessage("Missing input, please enter all the fields");
      }
    } else if (floatingAluOpcodes.includes(opcode)) {
      if (R1 && R2 && R3) {
        const instruction = { R1, R2, R3, label, opcode };
        setInstructions((prev) => [...prev, instruction]); // Corrected to use array
      } else {
        setOpenFeedback(true);
        setErrorMessage("Missing input, please enter all the fields");
      }
    } else if (loadStoreOpcodes.includes(opcode)) {
      if (R1 && R2 && immediate) {
        const instruction = { R1, R2, immediate, label, opcode };
        setInstructions((prev) => [...prev, instruction]); // Corrected to use array
      } else if (R1 && effective) {
        const instruction = { R1, effective, label, opcode };
        setInstructions((prev) => [...prev, instruction]); // Corrected to use array
      } else {
        setOpenFeedback(true);
        setErrorMessage("Missing input, please enter all the fields");
      }
    } else if (opcode === "J") {
      if (toLabel) {
        const instruction = { toLabel, label };
        setInstructions((prev) => [...prev, instruction]); // Corrected to use array
      } else {
        setOpenFeedback(true);
        setErrorMessage("Missing input, please enter all the fields");
      }
    } else if (opcode === "BEQ" || opcode === "BNE") {
      if (R1 && R2 && toLabel) {
        const instruction = { R1, R2, toLabel, label };
        setInstructions((prev) => [...prev, instruction]); // Corrected to use array
      } else {
        setOpenFeedback(true);
        setErrorMessage("Missing input, please enter all the fields");
      }
    }
  };

  useEffect(() => {
    console.log(instructions);
  }, [instructions]);

  return (
    <div>
      <div
        style={{ display: "flex", margin: "0 40px", justifyContent: "center" }}
      >
        <TextField
          id="outlined-basic"
          label="Label"
          variant="outlined"
          value={label}
          onChange={handleLabelChange}
          style={{ width: "110px" }}
        />

        <DropDown
          value={opcode}
          label={"Opcode"}
          onChange={handleOpcodeChange}
          dropDownItems={opcodeList}
        />

        {/* Integer ALU operations so 2 integerRegisters and immediate */}
        {integerAluOpcodes.includes(opcode) ? (
          <div>
            <DropDown
              value={R1}
              label={"REG1"}
              onChange={handleR1Change}
              dropDownItems={integerRegisters}
            />
            <DropDown
              value={R2}
              label={"REG2"}
              onChange={handleR2Change}
              dropDownItems={integerRegisters}
            />
            <TextField
              id="outlined-basic"
              label="Immediate"
              variant="outlined"
              value={immediate}
              onChange={handleImmediateChange}
              style={{ width: "110px", marginLeft: "20px" }}
            />
          </div>
        ) : null}

        {/* Floating point ALU operations */}
        {floatingAluOpcodes.includes(opcode) ? (
          <div>
            <DropDown
              value={R1}
              label={"REG1"}
              onChange={handleR1Change}
              dropDownItems={floatingRegisters}
            />
            <DropDown
              value={R2}
              label={"REG2"}
              onChange={handleR2Change}
              dropDownItems={floatingRegisters}
            />
            <DropDown
              value={R3}
              label={"REG3"}
              onChange={handleR3Change}
              dropDownItems={floatingRegisters}
            />
          </div>
        ) : null}

        {/* Loads and Stores*/}
        {loadStoreOpcodes.includes(opcode) ? (
          <DropDown
            value={R1}
            label={"REG1"}
            onChange={handleR1Change}
            dropDownItems={floatingRegisters}
          />
        ) : null}

        {/* Tabs for effective address or register and offset combo */}
        {loadStoreOpcodes.includes(opcode) ? (
          <Box
            sx={{}}
            style={{
              marginTop: "-72px",
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              style={{ backgroundColor: Colors.background }}
            >
              <Tab label="Register Immediate" {...a11yProps(0)} />
              <Tab label="Effective Address" {...a11yProps(1)} />
            </Tabs>
            <TabPanel value={value} index={0}>
              <DropDown
                value={R2}
                label={"REG2"}
                onChange={handleR2Change}
                dropDownItems={integerRegisters}
              />

              <TextField
                id="outlined-basic"
                label="Immediate"
                variant="outlined"
                value={immediate}
                onChange={handleImmediateChange}
                style={{ width: "110px", marginLeft: "20px" }}
              />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <TextField
                id="outlined-basic"
                label="Effective"
                variant="outlined"
                value={effective}
                onChange={handleEffectiveChange}
                style={{ width: "110px" }}
              />
            </TabPanel>
          </Box>
        ) : null}

        {/* Branch Instructions */}
        {opcode == "J" ? (
          <TextField
            id="outlined-basic"
            label="Label Dest"
            variant="outlined"
            value={toLabel}
            onChange={handleToLabelChange}
            style={{ width: "110px", marginLeft: "20px" }}
          />
        ) : null}

        {opcode == "BEQ" || opcode == "BNE" ? (
          <div>
            <DropDown
              value={R1}
              label={"REG1"}
              onChange={handleR1Change}
              dropDownItems={floatingRegisters}
            />
            <DropDown
              value={R2}
              label={"REG2"}
              onChange={handleR2Change}
              dropDownItems={floatingRegisters}
            />
            <TextField
              id="outlined-basic"
              label="Label Dest"
              variant="outlined"
              value={toLabel}
              onChange={handleToLabelChange}
              style={{ width: "110px", marginLeft: "20px" }}
            />
          </div>
        ) : null}

        {/* Add Instruction Button */}
        <IconButton
          color="primary"
          style={{
            height: "50px",
            width: "50px",
            position: "absolute",
            right: "100px",
            backgroundColor: "#192126",
          }}
          onClick={addInstruction}
        >
          <AddIcon style={{ fontSize: "30px" }} />
        </IconButton>
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Collapse style={{ marginTop: "40px" }} in={openFeedback}>
            <Alert
              severity="error"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpenFeedback(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2, width: "500px" }}
            >
              <AlertTitle style={{ textAlign: "left", fontWeight: "bolder" }}>
                Error
              </AlertTitle>
              <span sx={{ fontWeight: 100 }}>{errorMessage}</span>
            </Alert>
          </Collapse>
        </div>
      </div>
    </div>
  );
};

export default InstructionSelection;