import {
  integerAluOpcodes,
  floatingAluOpcodes,
  loadStoreOpcodes,
  loadOpcodes,
  storeOpcodes,
  opcodeList,
  branchOpcodes,
} from "../../Constants/Constants";

export const func1 = () => {
  console.log("hi");
  return 2;
};

export const isNumberLessThan = (value, max) => {
  let temp = parseInt(value, 10); // Convert to integer
  if (isNaN(temp)) {
    temp = 0; // Default to 0 if the value is not a valid number
  } else if (max && temp > max) {
    // Because maximum is Max Register (1.8446744e19)(64bits) + Max Immediate (65535)(16bits)
    temp = max;
  }
  return temp;
};

export const powerOfTwo = (value) => {
  // Check if the value is an integer
  let temp = parseInt(value, 10); // Convert to integer
  if (isNaN(temp) || temp < 0) {
    return 0; // Default to 0 if the value is not a valid number
  }

  // If the value is already a power of 2, return it
  // If power of 2 then it is only one bit which is 1 so when subtracting it will be all 1s till the previously set 1
  if (temp > 0 && (temp & (temp - 1)) === 0) {
    return temp;
  }

  // Find the closest power of 2
  const lowerPower = Math.pow(2, Math.floor(Math.log2(temp)));
  const higherPower = Math.pow(2, Math.ceil(Math.log2(temp)));

  // Return the closest power of 2
  return temp - lowerPower < higherPower - temp ? lowerPower : higherPower;
};

const issue = (
  instructions,
  integerRegisters,
  floatingRegisters,
  cache,
  loadBuffer,
  storeBuffer,
  addSubRes,
  setMulDivRes,
  setIntegerRes,
  clock
) => {
  let instructionsIssuesFinished = false;
  instructions = [
    { R1: "F0", R2: "F4", R3: "F21", label: "LOOP", opcode: "ADD.D" },
    { R1: "F4", R2: "F8", R3: "F12", label: "", opcode: "DIV.D" },
    { R1: "R4", R2: "R3", immediate: 34, label: "", opcode: "ADDI" },
    { R1: "R4", R2: "R1", immediate: 34, label: "", opcode: "LW" },
    { R1: "R4", effective: 343, label: "", opcode: "LW" },
    { R1: "F0", R2: "F0", toLabel: "LOOP", label: "" },
    { R1: "F0", R2: "F0", toLabel: "LOOP", label: "" },
    { R1: "F0", R2: "F0", toLabel: "LOOP", label: "" },
  ];

  // Loop through instructions to check the last issued one
  let mostRecentIssue = -1;
  let mostRecentIssueIndex = -1;
  instructions.forEach((instr, index) => {
    if (instr.issue > mostRecentIssue) {
      mostRecentIssue = instr.issue;
      mostRecentIssueIndex = index;
    }
  });
  // If we have not issued an instruction --> issue index mostRecentIssueIndex + 1 = 0
  // If we have issued an instruction issue the one after mostRecentIssueIndex so mostRecentIssueIndex + 1
  let previousInstruction = null;
  if (mostRecentIssueIndex >= 0) {
    previousInstruction = instructions[mostRecentIssueIndex];
  }

  let currentInstruction = null;
  let currentInstructionIndex = null;
  if (
    previousInstruction &&
    branchOpcodes.includes(previousInstruction?.opcode)
  ) {
    // There is a previous instruction and the previous instruction is
    // Branch logic
    const label = instructions[mostRecentIssueIndex].toLabel;
    instructions.forEach((instr, index) => {
      if (instr.label === label) {
        currentInstructionIndex = index;
        currentInstruction = instr;
        return;
      } else {
        // No label is = to the label in the Jump/Branch
        return null;
      }
    });
  } else {
    // No previous insruction OR previous instruction is not a branch
    // So next instruction is a the next one in the queue
    if (mostRecentIssueIndex >= instructions.length) {
      // Previous instruction not a branch and the most recent issued is the last one in the instructions
      // So the issues have finished
      instructionsIssuesFinished = true;
      return null; // We do not do anything
    }
    currentInstruction = instructions[mostRecentIssueIndex + 1];
  }

  // Check for structural hazards
  if (loadOpcodes.includes(currentInstruction?.opcode)) {
    // Still see the integer reservation station for LD,LW,SD,SW?
    loadBuffer.forEach((bufferEl, index) => {
      if (bufferEl.busy == 0) {
        // Found a vacant slot
      }
    });
  }
};

export const addInstructionToResource = (
  instruction,
  integerRegisters,
  floationRegisters,
  resource
) => {
  let freeIndex = -1;
  resource.forEach((row, index) => {
    if (row.busy == 0) {
      // Found a vacant slot
      freeIndex = index;
    }
  });
  if (freeIndex == -1) return null; // Stall

  // There was a free row in the resource so we proceed
  const reg2 = instruction.R2;
  const reg2Type = reg2[0];
  const reg3 = instruction.R3;
  const reg3Type = reg3[0];

  console.log("reg2", reg2);
  console.log("reg2Type", reg2Type);

  console.log("reg3", reg3);
  console.log("reg3type", reg3Type);
};

export const simulateNextClock = (
  instructions,
  integerRegisters,
  floatingRegisters,
  cache,
  loadBuffer,
  storeBuffer,
  addSubRes,
  setMulDivRes,
  setIntegerRes,
  clock
) => {};

addInstructionToResource(
  {
    R1: "F0",
    R2: "F4",
    R3: "F21",
    label: "LOOP",
    opcode: "ADD.D",
  },
  {
    R0: { value: 0, Qi: 0 },
    R1: { value: 0, Qi: 0 },
    R2: { value: 0, Qi: 0 },
    R3: { value: 0, Qi: 0 },
    R4: { value: 0, Qi: 0 },
    R5: { value: 0, Qi: 0 },
    R6: { value: 0, Qi: 0 },
    R7: { value: 0, Qi: 0 },
    R8: { value: 0, Qi: 0 },
    R9: { value: 0, Qi: 0 },
    R10: { value: 0, Qi: 0 },
    R11: { value: 0, Qi: 0 },
    R12: { value: 0, Qi: 0 },
    R13: { value: 0, Qi: 0 },
    R14: { value: 0, Qi: 0 },
    R15: { value: 0, Qi: 0 },
    R16: { value: 0, Qi: 0 },
    R17: { value: 0, Qi: 0 },
    R18: { value: 0, Qi: 0 },
    R19: { value: 0, Qi: 0 },
    R20: { value: 0, Qi: 0 },
    R21: { value: 0, Qi: 0 },
    R22: { value: 0, Qi: 0 },
    R23: { value: 0, Qi: 0 },
    R24: { value: 0, Qi: 0 },
    R25: { value: 0, Qi: 0 },
    R26: { value: 0, Qi: 0 },
    R27: { value: 0, Qi: 0 },
    R28: { value: 0, Qi: 0 },
    R29: { value: 0, Qi: 0 },
  },
  {
    F0: { value: 0, Qi: 0 },
    F1: { value: 0, Qi: 0 },
    F2: { value: 0, Qi: 0 },
    F3: { value: 0, Qi: 0 },
    F4: { value: 0, Qi: 0 },
    F5: { value: 0, Qi: 0 },
    F6: { value: 0, Qi: 0 },
    F7: { value: 0, Qi: 0 },
    F8: { value: 0, Qi: 0 },
    F9: { value: 0, Qi: 0 },
    F10: { value: 0, Qi: 0 },
    F11: { value: 0, Qi: 0 },
    F12: { value: 0, Qi: 0 },
    F13: { value: 0, Qi: 0 },
    F14: { value: 0, Qi: 0 },
    F15: { value: 0, Qi: 0 },
    F16: { value: 0, Qi: 0 },
    F17: { value: 0, Qi: 0 },
    F18: { value: 0, Qi: 0 },
    F19: { value: 0, Qi: 0 },
    F20: { value: 0, Qi: 0 },
    F21: { value: 0, Qi: 0 },
    F22: { value: 0, Qi: 0 },
    F23: { value: 0, Qi: 0 },
    F24: { value: 0, Qi: 0 },
    F25: { value: 0, Qi: 0 },
    F26: { value: 0, Qi: 0 },
    F27: { value: 0, Qi: 0 },
    F28: { value: 0, Qi: 0 },
    F29: { value: 0, Qi: 0 },
  },
  [
    { busy: 0, opcode: null, Vj: null, Vk: null, Qj: 0, Qk: 0, A: null },
    { busy: 0, opcode: null, Vj: null, Vk: null, Qj: 0, Qk: 0, A: null },
    { busy: 0, opcode: null, Vj: null, Vk: null, Qj: 0, Qk: 0, A: null },
    { busy: 0, opcode: null, Vj: null, Vk: null, Qj: 0, Qk: 0, A: null },
    { busy: 0, opcode: null, Vj: null, Vk: null, Qj: 0, Qk: 0, A: null },
    { busy: 0, opcode: null, Vj: null, Vk: null, Qj: 0, Qk: 0, A: null },
    { busy: 0, opcode: null, Vj: null, Vk: null, Qj: 0, Qk: 0, A: null },
    { busy: 0, opcode: null, Vj: null, Vk: null, Qj: 0, Qk: 0, A: null },
  ]
);
