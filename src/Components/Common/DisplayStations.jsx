import React from "react";
import DisplayStation from "./DisplayStation";
import DisplayIntegerStation from "./DisplayIntegerStation";

const DisplayStations = ({
  loadBuffer,
  storeBuffer,
  addSubRes,
  mulDivRes,
  integerRes,
}) => {
  return (
    <div style={{ display: "flex" }}>
      <DisplayStation name={"Load Buffer"} station={loadBuffer} />
      <DisplayStation name={"Store Buffer"} station={storeBuffer} />
      <DisplayStation name={"Add/Sub Res"} station={addSubRes} />
      <DisplayStation name={"Mul/Div Res"} station={mulDivRes} />
      <DisplayIntegerStation name={"Integer Res"} station={integerRes} />
    </div>
  );
};

export default DisplayStations;
