import React, { useState, useEffect } from "react";
import { Table } from "antd";
import "./DisplayCache.css";

const columns = [
  {
    title: "Index",
    dataIndex: "index",
  },
  {
    title: "Block",
    children: [
      {
        title: "Block Offset",
        dataIndex: ["block", "blockOffset"], // For objects
        key: "blockOffset",
        render: (_, record) =>
          record.block.map((item) => (
            <div
              style={{
                borderBottom: "1px solid #303030",
                padding: "4px",
              }}
              key={item.blockOffset}
            >
              {item.blockOffset}
            </div>
          )),
      },
      {
        title: "Value",
        dataIndex: ["block", "value"], // For objects
        key: "value",
        render: (_, record) =>
          record.block.map((item) => (
            <div
              style={{
                borderBottom: "1px solid #303030",
                padding: "4px",
              }}
              key={item.blockOffset}
            >
              {item.value}
            </div>
          )),
      },
    ],
  },
];

const DisplayCache = ({ cache }) => {
  const [cacheTable, setCacheTable] = useState(cache);
  useEffect(() => {
    const tableData = cache?.map((block, index) => ({
      key: index,
      index,
      block: block?.map((value, blockOffset) => ({ blockOffset, value })),
    }));
    setCacheTable(tableData);
  }, [cache]);
  return (
    <Table
      className="cacheTable"
      bordered
      columns={columns}
      dataSource={cacheTable}
      title={() => <h1 style={{ margin: "0" }}>Cache</h1>}
      pagination={{ position: ["bottomCenter"] }}
    />
  );
};

export default DisplayCache;
