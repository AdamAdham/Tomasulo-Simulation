import { IconButton } from "@mui/material";
import React from "react";

import { KeyboardArrowRight, KeyboardArrowLeft } from "@mui/icons-material";

const ClockControl = ({ clock, incrementClock, decrementClock }) => {
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
          height: "50px",
          width: "50px",
          backgroundColor: "#192126",
        }}
        onClick={decrementClock}
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
          height: "80%",
          borderRadius: "7px",
          backgroundColor: "#192126",
        }}
      >
        {clock}
      </div>
      <IconButton
        color="primary"
        style={{
          height: "50px",
          width: "50px",
          backgroundColor: "#192126",
        }}
        onClick={incrementClock}
      >
        <KeyboardArrowRight style={{ fontSize: "30px" }} />
      </IconButton>
    </div>
  );
};

export default ClockControl;
