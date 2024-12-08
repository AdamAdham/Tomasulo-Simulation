import { IconButton } from "@mui/material";
import React, { useContext, useRef } from "react";

import { KeyboardArrowRight, KeyboardArrowLeft } from "@mui/icons-material";
import { ClockContext } from "./Context/ClockContext";

const ClockControl = () => {
  const { clock, incrementClock, decrementClock } = useContext(ClockContext);
  const minTimeDifference = 500;
  const lastUpdateTime = useRef(Date.now());

  const handleClock = (operation) => {
    const currentTime = Date.now();

    if (currentTime - lastUpdateTime.current >= minTimeDifference) {
      // Update clock and the last increment time
      if (operation == "increment") incrementClock();
      else decrementClock();
      lastUpdateTime.current = currentTime;
    } else {
      // console.log(
      //   `Cannot ${operation} clock. Wait for`,
      //   minTimeDifference - (currentTime - lastUpdateTime.current),
      //   "ms"
      // );
    }
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "end",
        alignItems: "center",
        marginTop: "0",
        marginBottom: "30px",
      }}
    >
      <IconButton
        color="primary"
        style={{
          height: "40px",
          width: "40px",
          backgroundColor: "#192126",
        }}
        onClick={() => handleClock("decrement")}
      >
        <KeyboardArrowLeft style={{ fontSize: "30px" }} />
      </IconButton>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: "26px",
          margin: "0 10px",
          border: "solid 2px #90caf9",
          padding: "0 10px",
          height: "100%",
          borderRadius: "7px",
          backgroundColor: "#192126",
        }}
      >
        {clock}
      </div>
      <IconButton
        color="primary"
        style={{
          height: "40px",
          width: "40px",
          backgroundColor: "#192126",
        }}
        onClick={() => handleClock("increment")}
      >
        <KeyboardArrowRight style={{ fontSize: "30px" }} />
      </IconButton>
    </div>
  );
};

export default ClockControl;
