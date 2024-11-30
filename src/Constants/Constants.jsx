export const memorySize = 1024;
export const opcodeList = [
  // Integer Operations
  "DADDI", // Integer Add Immediate
  "DSUBI", // Integer Subtract Immediate

  // ALU Operations (Floating-Point)
  "ADD.D", // Floating-Point Add
  "ADD.S", // Floating-Point Add
  "SUB.D", // Floating-Point Subtract
  "SUB.S", // Floating-Point Subtract
  "MUL.D", // Floating-Point Multiply
  "MUL.S", // Floating-Point Multiply
  "DIV.D", // Floating-Point Divide,
  "DIV.S", // Floating-Point Divide,

  // Load Operations
  "LW", // Load Word
  "LD", // Load Double Word
  "L.S", // Load Single-Precision Floating Point
  "L.D", // Load Double-Precision Floating Point

  // Store Operations
  "SW", // Store Word
  "SD", // Store Double Word
  "S.S", // Store Single-Precision Floating Point
  "S.D", // Store Double-Precision Floating Point

  // Branch Instructions
  "BEQ", // Branch if Equal
  "BNE", // Branch if Not Equal
];
export const integerAluOpcodes = ["DADDI", "DSUBI"];
export const loadStoreOpcodes = [
  "LW",
  "LD",
  "L.S",
  "L.D",
  "SW",
  "SD",
  "S.S",
  "S.D",
];
export const loadOpcodes = ["LW", "LD", "L.S", "L.D"];

export const storeOpcodes = ["SW", "SD", "S.S", "S.D"];
export const floatingAluOpcodes = [
  "ADD.D", // Floating-Point Add
  "ADD.S", // Floating-Point Add
  "SUB.D", // Floating-Point Subtract
  "SUB.S", // Floating-Point Subtract
  "MUL.D", // Floating-Point Multiply
  "MUL.S", // Floating-Point Multiply
  "DIV.D", // Floating-Point Divide,
  "DIV.S", // Floating-Point Divide,
];
export const branchOpcodes = ["BEQ", "BNE"];
export const addSubFloatingOpcodes = [
  "ADD.D", // Floating-Point Add
  "ADD.S", // Floating-Point Add
  "SUB.D", // Floating-Point Subtract
  "SUB.S", // Floating-Point Subtract
];
export const mulDivFloatingOpcodes = [
  "MUL.D", // Floating-Point Multiply
  "MUL.S", // Floating-Point Multiply
  "DIV.D", // Floating-Point Divide,
  "DIV.S", // Floating-Point Divide,
];
