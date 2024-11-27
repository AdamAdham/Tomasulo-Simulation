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

const DisplayIntegerRegisters = ({ integerRegisters }) => {
  const [integerRegistersTable, setIntegerRegistersTable] = useState([]);

  useEffect(() => {
    // Formatting table values for display, needed in array format
    const temp = [];
    Object.keys(integerRegisters).forEach((key) => {
      temp.push({
        key: key,
        registerName: key,
        value: integerRegisters[key]?.value,
        Qi: integerRegisters[key]?.Qi,
      });
    });
    setIntegerRegistersTable(temp);
  }, [integerRegisters]);

  return (
    <Table
      bordered
      columns={columns}
      dataSource={integerRegistersTable}
      title={() => <h1 style={{ margin: "0" }}>Integer Registers</h1>}
      pagination={{ position: ["bottomCenter"] }}
    />
  );
};
export default DisplayIntegerRegisters;
