import React, { useContext, useEffect, useState } from "react";
import { Table } from "antd";
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
  {
    title: <div style={{ fontSize: "16px", fontWeight: "900" }}>Issue</div>,
    dataIndex: "issue",
  },
  {
    title: (
      <div style={{ fontSize: "16px", fontWeight: "900" }}>Exec Start</div>
    ),
    dataIndex: "execStart",
  },
  {
    title: <div style={{ fontSize: "16px", fontWeight: "900" }}>Exec End</div>,
    dataIndex: "execEnd",
  },
  {
    title: (
      <div style={{ fontSize: "16px", fontWeight: "900" }}>Write Result</div>
    ),
    dataIndex: "writeResult",
  },
];

const DisplayInstructionsSimulation = ({ instructions }) => {
  const [instructionsTable, setInstructionsTable] = useState(null);

  useEffect(() => {
    // Just add key, to remove the error
    let instructionsTableTemp = instructions?.map((instruction, index) => {
      return { ...instruction, key: index };
    });
    setInstructionsTable(instructionsTableTemp);
  }, [instructions]);

  return (
    <div style={{ padding: "0 60px" }}>
      <Table
        bordered
        columns={columns}
        dataSource={instructionsTable}
        title={() => <h1 style={{ margin: "0" }}>Instructions</h1>}
        pagination={{ position: ["bottomCenter"] }}
      />
    </div>
  );
};
export default DisplayInstructionsSimulation;
