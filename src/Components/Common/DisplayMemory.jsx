import React, { useState, useEffect } from "react";
import { Table } from "antd";

const columns = [
  {
    title: "Address",
    dataIndex: "address",
  },
  {
    title: "Value",
    dataIndex: "value",
  },
];

const DisplayMemory = ({ memory }) => {
  const [memoryTable, setMemoryTable] = useState(memory);
  useEffect(() => {
    setMemoryTable(
      memory.map((memoryRow, index) => {
        return { address: index, value: memoryRow };
      })
    );
  }, [memory]);
  return (
    <Table
      bordered
      columns={columns}
      dataSource={memoryTable}
      title={() => <h1 style={{ margin: "0" }}>Memory</h1>}
      pagination={{ position: ["bottomCenter"] }}
    />
  );
};

export default DisplayMemory;
