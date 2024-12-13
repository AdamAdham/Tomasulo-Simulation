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
    render: (text) => (
      <div
        className="scrollModern"
        style={{ maxWidth: "45px", overflow: "auto" }}
      >
        {text}
      </div>
    ),
  },
  {
    title: "Vk",
    dataIndex: "Vk",
    render: (text) => (
      <div
        className="scrollModern"
        style={{ maxWidth: "45px", overflow: "auto" }}
      >
        {text}
      </div>
    ),
  },
  {
    title: "Qj",
    dataIndex: "Qj",
  },
  {
    title: "Qk",
    dataIndex: "Qk",
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
