import React, { useContext } from "react";
import { Table } from "antd";
import "./test.css";
import { InstructionsContext } from "../Common/Context/InstructionsContext";

const columns = [
  {
    title: "Label",
    dataIndex: "label",
  },
  {
    title: "Opcode",
    dataIndex: "opcode",
  },
  {
    title: "Register 1",
    dataIndex: "R1",
  },
  {
    title: "Register 2",
    dataIndex: "R2",
  },
  {
    title: "Register 3",
    dataIndex: "R3",
  },
  {
    title: "Register 3",
    dataIndex: "R3",
  },
  {
    title: "Immediate",
    dataIndex: "immediate",
  },
  {
    title: "Effective Address",
    dataIndex: "effective",
  },
  {
    title: "Destination Label",
    dataIndex: "toLabel",
  },
];

const DisplayInstructions = () => {
  const { instructions, setInstructions } = useContext(InstructionsContext);
  return (
    <div style={{ padding: "0 60px" }}>
      <Table
        bordered
        columns={columns}
        dataSource={instructions}
        title={() => <h1 style={{ margin: "0" }}>Instructions</h1>}
        pagination={{ position: ["bottomCenter"] }}
      />
    </div>
  );
};
export default DisplayInstructions;
