import React from "react";
import DisplayIntegerRegisters from "./DisplayIntegerRegisters";
import DisplayfloatingRegisters from "./DisplayFloatingRegisters";

const DisplayRegisters = ({ integerRegisters, floatingRegisters }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "45% 45%",
        gridGap: "10%",
        margin: "50px 40px",
      }}
    >
      <DisplayIntegerRegisters integerRegisters={integerRegisters} />
      <DisplayfloatingRegisters floatingRegisters={floatingRegisters} />
    </div>
  );
};

export default DisplayRegisters;
