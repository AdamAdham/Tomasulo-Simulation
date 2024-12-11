import React, { useContext } from "react";
import TextField from "@mui/material/TextField";

import { CacheContext } from "../Common/Context/CacheContext";
import { InstructionLatencyContext } from "../Common/Context/InstructionLatencyContext";
import { ResourcesContext } from "../Common/Context/ResourcesContext";

import { isNumberLessThan, powerOfTwo } from "../Common/Functions";
import { memorySize } from "../../Constants/Constants";

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
    latencyIntegerAdd,
    setLatencyIntegerAdd,
    latencyIntegerSub,
    setLatencyIntegerSub,
    latencyBranch,
    setLatencyBranch,
  } = useContext(InstructionLatencyContext);

  const {
    loadBufferSize,
    setLoadBufferSize,
    storeBufferSize,
    setStoreBufferSize,
    addSubResSize,
    setAddSubResSize,
    mulDivResSize,
    setMulDivResSize,
    integerResSize,
    setIntegerResSize,
  } = useContext(ResourcesContext);

  const handleCacheLatency = (e) => {
    // TA said that the hit time is actually included in the load/store latencies
    // TODO TEST THIS
    const value = isNumberLessThan(
      e.target.value,
      Math.min(latencyLoad, latencyStore)
    );
    setCacheLatency(value);
  };

  const handleCachePenalty = (e) => {
    const value = isNumberLessThan(e.target.value, null);
    setCachePenalty(value);
  };

  const handleCacheSize = (e) => {
    let value = powerOfTwo(e.target.value);
    if (value > memorySize) {
      value = memorySize;
    }
    if (value < 8) {
      value = 8;
    }
    setCacheSize(value);
  };

  const handleGreaterZeroChange = (value, setter) => {
    const num = Number(value);
    setter(num >= 0 ? num : 0); // Ensure value is >= 0, otherwise set to 0
  };

  const handleBlockSize = (e) => {
    let value = powerOfTwo(e.target.value);
    // if (value < 8) {
    //   // cannot have block size less than 64 for double precision load/stores
    //   value = 8;
    // }
    if (value > cacheSize) {
      // Cannot have block size greater than cache size
      value = cacheSize;
    }
    setBlockSize(value);
  };
  return (
    <div style={{ display: "grid" }}>
      <div>
        <h3>Cache Statistics</h3>
        <TextField
          id="outlined-basic"
          label="Hit Latency"
          variant="outlined"
          value={cacheLatency}
          onChange={handleCacheLatency}
          style={{ width: "110px", marginLeft: "20px" }}
        />
        <TextField
          id="outlined-basic"
          label="Cache Penalty"
          variant="outlined"
          value={cachePenalty}
          onChange={handleCachePenalty}
          style={{ width: "110px", marginLeft: "20px" }}
        />
        <TextField
          id="outlined-basic"
          label="Cache Size"
          variant="outlined"
          value={cacheSize}
          onChange={(e) => setCacheSize(e.target.value)}
          onBlur={handleCacheSize}
          style={{ width: "110px", marginLeft: "20px" }}
        />
        <TextField
          id="outlined-basic"
          label="Block Size"
          variant="outlined"
          value={blockSize}
          onBlur={handleBlockSize}
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
          onChange={(e) =>
            handleGreaterZeroChange(e.target.value, setLatencyStore)
          }
          style={{ width: "120px", marginLeft: "20px" }}
        />

        <TextField
          id="latency-load"
          label="Load Latency"
          variant="outlined"
          value={latencyLoad}
          onChange={(e) =>
            handleGreaterZeroChange(e.target.value, setLatencyLoad)
          }
          style={{ width: "120px", marginLeft: "20px" }}
        />

        <TextField
          id="latency-add"
          label="Add Latency"
          variant="outlined"
          value={latencyAdd}
          onChange={(e) =>
            handleGreaterZeroChange(e.target.value, setLatencyAdd)
          }
          style={{ width: "120px", marginLeft: "20px" }}
        />

        <TextField
          id="latency-sub"
          label="Subtract Latency"
          variant="outlined"
          value={latencySub}
          onChange={(e) =>
            handleGreaterZeroChange(e.target.value, setLatencySub)
          }
          style={{ width: "120px", marginLeft: "20px" }}
        />

        <TextField
          id="latency-multiply"
          label="Multiply Latency"
          variant="outlined"
          value={latencyMultiply}
          onChange={(e) =>
            handleGreaterZeroChange(e.target.value, setLatencyMultiply)
          }
          style={{ width: "120px", marginLeft: "20px" }}
        />

        <TextField
          id="latency-divide"
          label="Divide Latency"
          variant="outlined"
          value={latencyDivide}
          onChange={(e) =>
            handleGreaterZeroChange(e.target.value, setLatencyDivide)
          }
          style={{ width: "120px", marginLeft: "20px" }}
        />

        <TextField
          id="latency-integer-sub"
          label="Int Sub Latency"
          variant="outlined"
          value={latencyIntegerSub}
          onChange={(e) =>
            handleGreaterZeroChange(e.target.value, setLatencyIntegerSub)
          }
          style={{ width: "120px", marginLeft: "20px" }}
        />

        <TextField
          id="latency-integer-add"
          label="Int Add Latency"
          variant="outlined"
          value={latencyIntegerAdd}
          onChange={(e) =>
            handleGreaterZeroChange(e.target.value, setLatencyIntegerAdd)
          }
          style={{ width: "120px", marginLeft: "20px" }}
        />

        <TextField
          id="latency-integer-add"
          label="Branch Latency"
          variant="outlined"
          value={latencyBranch}
          onChange={(e) =>
            handleGreaterZeroChange(e.target.value, setLatencyBranch)
          }
          style={{ width: "120px", marginLeft: "20px" }}
        />
      </div>
      <div>
        <h3>Resources</h3>
        <TextField
          label="Load BufferSize"
          variant="outlined"
          value={loadBufferSize}
          onChange={(e) =>
            handleGreaterZeroChange(e.target.value, setLoadBufferSize)
          }
          style={{ width: "200px", marginRight: "20px" }}
        />

        <TextField
          label="Store BufferSize"
          variant="outlined"
          value={storeBufferSize}
          onChange={(e) =>
            handleGreaterZeroChange(e.target.value, setStoreBufferSize)
          }
          style={{ width: "200px", marginRight: "20px" }}
        />

        <TextField
          label="Add/Sub RS"
          variant="outlined"
          value={addSubResSize}
          onChange={(e) =>
            handleGreaterZeroChange(e.target.value, setAddSubResSize)
          }
          style={{ width: "200px", marginRight: "20px" }}
        />

        <TextField
          label="Mul/Div RS"
          variant="outlined"
          value={mulDivResSize}
          onChange={(e) =>
            handleGreaterZeroChange(e.target.value, setMulDivResSize)
          }
          style={{ width: "200px", marginRight: "20px" }}
        />

        <TextField
          label="Integer RS"
          variant="outlined"
          value={integerResSize}
          onChange={(e) =>
            handleGreaterZeroChange(e.target.value, setIntegerResSize)
          }
          style={{ width: "200px", marginRight: "20px" }}
        />
      </div>
    </div>
  );
};

export default InitStatistics;
