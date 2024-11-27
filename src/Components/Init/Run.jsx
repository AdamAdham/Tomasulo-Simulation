import React from "react";
import { func1 } from "../Common/Functions";
import { CacheContext } from "../Common/Context/CacheContext";

const Run = () => {
  // let cacheTemp = CacheContext;
  // let memTemp = null;
  // //Cache                                 Mem
  // cache = {120:[20,23,43,34]}

  //  issue:clk 3 SW 100,0  wr:7
  // issue clk 1   SW  200,1 wr:10:

  // issue 1: mem = {0:0,1:0}
  // ret = {0:0,1:200} stall = 9

  return <div>Run</div>;
};

export default Run;
