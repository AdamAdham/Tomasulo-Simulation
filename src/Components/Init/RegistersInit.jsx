import React, { useState, useContext, useEffect } from "react";
import { Table } from "antd";
import "./InstructionSelection.css";
import DropDown from "../Common/DropDown";
import TextField from "@mui/material/TextField";
import { IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

import { FloatingRegistersContext } from "../Common/Context/FloatingRegistersContext";
import { IntegerRegistersContext } from "../Common/Context/IntegerRegistersContext";

const columns = [
  {
    title: "Register",
    dataIndex: "registerName",
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
  const [integerRegistersTable, setIntegerRegistersTable] = useState([]);

  const { floatingRegisters, setFloatingRegisters } = useContext(
    FloatingRegistersContext
  );
  const [floatingRegistersTable, setFloatingRegistersTable] = useState([]);

  const [floatingRegister, setFloatingRegister] = useState(null);
  const [floatingValue, setFloatingValue] = useState(null);

  const [integerRegister, setIntegerRegister] = useState(null);
  const [integerValue, setIntegerValue] = useState(null);

  const modifyFloatingRegister = () => {
    setFloatingRegisters((prev) => ({
      ...prev,
      [floatingRegister]: floatingValue,
    }));
  };

  const modifyIntegerRegister = () => {
    setIntegerRegisters((prev) => ({
      ...prev,
      [integerRegister]: integerValue,
    }));
  };

  useEffect(() => {
    const temp = [];
    Object.keys(integerRegisters).forEach((key) => {
      temp.push({ registerName: key, value: integerRegisters[key] });
    });
    setIntegerRegistersTable(temp);
    console.log("temp", temp);
  }, [integerRegisters]);

  useEffect(() => {
    const temp = [];
    Object.keys(floatingRegisters).forEach((key) => {
      temp.push({ registerName: key, value: floatingRegisters[key] });
    });
    setFloatingRegistersTable(temp);
  }, [floatingRegisters]);

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
            onChange={(e) => setIntegerValue(e.target.value)}
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

        <Table
          bordered
          columns={columns}
          dataSource={integerRegistersTable}
          title={() => <h1 style={{ margin: "0" }}>Integer Registers</h1>}
          pagination={{ position: ["bottomCenter"] }}
        />
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
            onChange={(e) => setFloatingValue(e.target.value)}
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

        <Table
          bordered
          columns={columns}
          dataSource={floatingRegistersTable}
          title={() => (
            <h1 style={{ margin: "0" }}>Floating Point Registers</h1>
          )}
          pagination={{ position: ["bottomCenter"] }}
        />
      </div>
    </div>
  );
};

export default RegistersInit;
