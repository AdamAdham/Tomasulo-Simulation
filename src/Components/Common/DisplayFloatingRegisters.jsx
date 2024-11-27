import React, { useState, useEffect } from "react";
import { Table } from "antd";

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

const DisplayfloatingRegisters = ({ floatingRegisters }) => {
  const [floatingRegistersTable, setFloatingRegistersTable] = useState([]);

  useEffect(() => {
    // Formatting table values for display, needed in array format
    const temp = [];
    Object.keys(floatingRegisters).forEach((key) => {
      temp.push({
        key: key,
        registerName: key,
        value: floatingRegisters[key]?.value,
        Qi: floatingRegisters[key]?.Qi,
      });
    });
    setFloatingRegistersTable(temp);
  }, [floatingRegisters]);

  return (
    <Table
      bordered
      columns={columns}
      dataSource={floatingRegistersTable}
      title={() => <h1 style={{ margin: "0" }}>Floating Registers</h1>}
      pagination={{ position: ["bottomCenter"] }}
    />
  );
};
export default DisplayfloatingRegisters;
