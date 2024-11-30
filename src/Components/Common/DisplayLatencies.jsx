import React, { useContext } from "react";
import { TextField } from "@mui/material";
import { InstructionLatencyContext } from "./Context/InstructionLatencyContext";

const DisplayLatencies = () => {
  const {
    latencyStore,
    latencyLoad,
    latencyAdd,
    latencySub,
    latencyMultiply,
    latencyDivide,
    latencyIntegerAdd,
    latencyIntegerSub,
    latencyBranch,
  } = useContext(InstructionLatencyContext);
  return (
    <div style={{ marginBottom: "30px", marginTop: "-30px" }}>
      <h2 style={{ marginBottom: "30px" }}>Instruction Latencies</h2>
      <TextField
        id="latency-store"
        label="Store Latency"
        variant="outlined"
        value={latencyStore}
        slotProps={{
          input: {
            readOnly: true,
          },
        }}
        style={{ width: "120px", marginLeft: "20px" }}
      />

      <TextField
        id="latency-load"
        label="Load Latency"
        variant="outlined"
        value={latencyLoad}
        slotProps={{
          input: {
            readOnly: true,
          },
        }}
        style={{ width: "120px", marginLeft: "20px" }}
      />

      <TextField
        id="latency-add"
        label="Add Latency"
        variant="outlined"
        value={latencyAdd}
        slotProps={{
          input: {
            readOnly: true,
          },
        }}
        style={{ width: "120px", marginLeft: "20px" }}
      />

      <TextField
        id="latency-sub"
        label="Subtract Latency"
        variant="outlined"
        value={latencySub}
        slotProps={{
          input: {
            readOnly: true,
          },
        }}
        style={{ width: "120px", marginLeft: "20px" }}
      />

      <TextField
        id="latency-multiply"
        label="Multiply Latency"
        variant="outlined"
        value={latencyMultiply}
        slotProps={{
          input: {
            readOnly: true,
          },
        }}
        style={{ width: "120px", marginLeft: "20px" }}
      />

      <TextField
        id="latency-divide"
        label="Divide Latency"
        variant="outlined"
        value={latencyDivide}
        slotProps={{
          input: {
            readOnly: true,
          },
        }}
        style={{ width: "120px", marginLeft: "20px" }}
      />

      <TextField
        id="latency-integer-sub"
        label="Int Sub Latency"
        variant="outlined"
        value={latencyIntegerSub}
        slotProps={{
          input: {
            readOnly: true,
          },
        }}
        style={{ width: "120px", marginLeft: "20px" }}
      />

      <TextField
        id="latency-integer-add"
        label="Int Add Latency"
        variant="outlined"
        value={latencyIntegerAdd}
        slotProps={{
          input: {
            readOnly: true,
          },
        }}
        style={{ width: "120px", marginLeft: "20px" }}
      />

      <TextField
        id="latency-branch"
        label="Branch Latency"
        variant="outlined"
        value={latencyBranch}
        slotProps={{
          input: {
            readOnly: true,
          },
        }}
        style={{ width: "120px", marginLeft: "20px" }}
      />
    </div>
  );
};

export default DisplayLatencies;
