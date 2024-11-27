import React, { useContext } from "react";
import TextField from "@mui/material/TextField";

import { CacheContext } from "../Common/Context/CacheContext";
import { InstructionLatencyContext } from "../Common/Context/InstructionLatencyContext";
import { ResourcesContext } from "../Common/Context/ResourcesContext";

const InitStatistics = () => {
  const {
    cacheLatency,
    setCacheLatency,
    cachePenalty,
    setCachePenalty,
    cacheSize,
    setCacheSize,
    blockSize,
    setBlockSize,
  } = useContext(CacheContext);

  const {
    latencyStore,
    setLatencyStore,
    latencyLoad,
    setLatencyLoad,
    latencyAdd,
    setLatencyAdd,
    latencySub,
    setLatencySub,
    latencyMultiply,
    setLatencyMultiply,
    latencyDivide,
    setLatencyDivide,
  } = useContext(InstructionLatencyContext);

  const {
    loadBuffer,
    setLoadBuffer,
    storeBuffer,
    setStoreBuffer,
    addSubRes,
    setAddSubRes,
    mulDivRes,
    setMulDivRes,
    integerRes,
    setIntegerRes,
  } = useContext(ResourcesContext);

  return (
    <div style={{ display: "grid" }}>
      <div>
        <h3>Cache Statistics</h3>
        <TextField
          id="outlined-basic"
          label="Hit Latency"
          variant="outlined"
          value={cacheLatency}
          onChange={(e) => setCacheLatency(e.target.value)}
          style={{ width: "110px", marginLeft: "20px" }}
        />
        <TextField
          id="outlined-basic"
          label="Cache Penalty"
          variant="outlined"
          value={cachePenalty}
          onChange={(e) => setCachePenalty(e.target.value)}
          style={{ width: "110px", marginLeft: "20px" }}
        />
        <TextField
          id="outlined-basic"
          label="Cache Size"
          variant="outlined"
          value={cacheSize}
          onChange={(e) => setCacheSize(e.target.value)}
          style={{ width: "110px", marginLeft: "20px" }}
        />
        <TextField
          id="outlined-basic"
          label="Block Size"
          variant="outlined"
          value={blockSize}
          onChange={(e) => setBlockSize(e.target.value)}
          style={{ width: "110px", marginLeft: "20px" }}
        />
      </div>
      <div>
        <h3>Instruction Latencies</h3>
        <TextField
          id="latency-store"
          label="Store Latency"
          variant="outlined"
          value={latencyStore}
          onChange={(e) => setLatencyStore(Number(e.target.value))}
          style={{ width: "150px", marginLeft: "20px" }}
        />

        <TextField
          id="latency-load"
          label="Load Latency"
          variant="outlined"
          value={latencyLoad}
          onChange={(e) => setLatencyLoad(Number(e.target.value))}
          style={{ width: "150px", marginLeft: "20px" }}
        />

        <TextField
          id="latency-add"
          label="Add Latency"
          variant="outlined"
          value={latencyAdd}
          onChange={(e) => setLatencyAdd(Number(e.target.value))}
          style={{ width: "150px", marginLeft: "20px" }}
        />

        <TextField
          id="latency-sub"
          label="Subtract Latency"
          variant="outlined"
          value={latencySub}
          onChange={(e) => setLatencySub(Number(e.target.value))}
          style={{ width: "150px", marginLeft: "20px" }}
        />

        <TextField
          id="latency-multiply"
          label="Multiply Latency"
          variant="outlined"
          value={latencyMultiply}
          onChange={(e) => setLatencyMultiply(Number(e.target.value))}
          style={{ width: "150px", marginLeft: "20px" }}
        />

        <TextField
          id="latency-divide"
          label="Divide Latency"
          variant="outlined"
          value={latencyDivide}
          onChange={(e) => setLatencyDivide(Number(e.target.value))}
          style={{ width: "150px", marginLeft: "20px" }}
        />
      </div>
      <div>
        <h3>Resources</h3>
        <TextField
          label="Load Buffer"
          variant="outlined"
          value={loadBuffer}
          onChange={(e) => setLoadBuffer(Number(e.target.value))}
          style={{ width: "200px", marginRight: "20px" }}
        />
        <TextField
          label="Store Buffer"
          variant="outlined"
          value={storeBuffer}
          onChange={(e) => setStoreBuffer(Number(e.target.value))}
          style={{ width: "200px", marginRight: "20px" }}
        />
        <TextField
          label="Add/Sub Resources"
          variant="outlined"
          value={addSubRes}
          onChange={(e) => setAddSubRes(Number(e.target.value))}
          style={{ width: "200px", marginRight: "20px" }}
        />
        <TextField
          label="Mul/Div Resources"
          variant="outlined"
          value={mulDivRes}
          onChange={(e) => setMulDivRes(Number(e.target.value))}
          style={{ width: "200px", marginRight: "20px" }}
        />
        <TextField
          label="Integer Resources"
          variant="outlined"
          value={integerRes}
          onChange={(e) => setIntegerRes(Number(e.target.value))}
          style={{ width: "200px", marginRight: "20px" }}
        />
      </div>
    </div>
  );
};

export default InitStatistics;
