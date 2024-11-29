export const memorySize = 1024;
export const opcodeList = [
  // ALU Operations (Floating-Point)
  "ADD.D", // Floating-Point Add
  "SUB.D", // Floating-Point Subtract
  "MUL.D", // Floating-Point Multiply
  "DIV.D", // Floating-Point Divide,

  // Integer Operations
  "ADDI", // Integer Add Immediate
  "SUBI", // Integer Subtract Immediate

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
  "J", // Jump (unconditional branch)
];
export const integerAluOpcodes = ["ADDI", "SUBI"];
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
export const floatingAluOpcodes = ["ADD.D", "SUB.D", "MUL.D", "DIV.D"];
export const branchOpcodes = ["BEQ", "BNE", "J"];
export const addSubFloatingOpcodes = ["ADD.D", "SUB.D"];
export const mulDivFloatingOpcodes = ["MUL.D", "DIV.D"];
