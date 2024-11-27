import React from "react";
import { Table } from "antd";

const columns = [
  {
    title: "Tag",
    dataIndex: "tag",
  },
  {
    title: "Busy",
    dataIndex: "busy",
  },
  {
    title: "op",
    dataIndex: "opcode",
  },
  {
    title: "Vj",
    dataIndex: "Vj",
  },
  {
    title: "Vk",
    dataIndex: "Vk",
  },
  {
    title: "Qj",
    dataIndex: "Qj",
  },
  {
    title: "Qj",
    dataIndex: "Qj",
  },
  {
    title: "A",
    dataIndex: "A",
  },
];

const DisplayStation = ({ name, station }) => {
  return (
    <Table
      bordered
      columns={columns}
      dataSource={station}
      title={() => <h1 style={{ margin: "0" }}>{name}</h1>}
      pagination={{ position: ["bottomCenter"] }}
    />
  );
};

export default DisplayStation;
