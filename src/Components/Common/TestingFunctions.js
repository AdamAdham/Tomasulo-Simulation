const loadOpcodes = ["LW", "LD", "L.S", "L.D", "SW", "SD", "S.S", "S.D"];
const branchOpcodes = ["BEQ", "BNE", "J"];
const floatingAluOpcodes = ["ADD.D", "SUB.D", "MUL.D", "DIV.D"];
const addSubFloatingOpcodes = ["ADD.D", "SUB.D"];
const mulDivFloatingOpcodes = ["MUL.D", "DIV.D"];
const storeOpcodes = ["SW", "SD", "S.S", "S.D"];
const integerAluOpcodes = ["ADDI", "SUBI"];

const func1 = () => {
  console.log("hi");
  return 2;
};

const isNumberLessThan = (value, max) => {
  let temp = parseInt(value, 10); // Convert to integer
  if (isNaN(temp)) {
    temp = 0; // Default to 0 if the value is not a valid number
  } else if (max && temp > max) {
    // Because maximum is Max Register (1.8446744e19)(64bits) + Max Immediate (65535)(16bits)
    temp = max;
  }
  return temp;
};

const powerOfTwo = (value) => {
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
  mulDivRes,
  integerRes,
  clock
) => {
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

  loadBuffer = [
    {
      tag: "L0",
      busy: 1,
      opcode: "LD",
      Vj: 50,
      Vk: null,
      Qj: 0,
      Qk: "R2",
    },
    {
      tag: "L1",
      busy: 1,
      opcode: "LD",
      Vj: null,
      Vk: 75,
      Qj: "R1",
      Qk: 0,
    },
    {
      tag: "L2",
      busy: 0,
      opcode: null,
      Vj: null,
      Vk: null,
      Qj: null,
      Qk: null,
    },
  ];

  storeBuffer = [
    {
      tag: "S0",
      busy: 1,
      opcode: "SD",
      Vj: 100,
      Vk: null,
      Qj: 0,
      Qk: "R4",
    },
    {
      tag: "S1",
      busy: 0,
      opcode: null,
      Vj: null,
      Vk: null,
      Qj: null,
      Qk: null,
    },
    {
      tag: "S2",
      busy: 1,
      opcode: "SW",
      Vj: null,
      Vk: 60,
      Qj: "R3",
      Qk: 0,
    },
  ];

  addSubRes = [
    {
      tag: "A0",
      busy: 1,
      opcode: "ADD.D",
      Vj: 25,
      Vk: null,
      Qj: 0,
      Qk: "R5",
    },
    {
      tag: "A1",
      busy: 1,
      opcode: "SUB.D",
      Vj: null,
      Vk: 45,
      Qj: "R6",
      Qk: 0,
    },
    {
      tag: "A2",
      busy: 0,
      opcode: null,
      Vj: null,
      Vk: null,
      Qj: null,
      Qk: null,
    },
  ];

  mulDivRes = [
    {
      tag: "M0",
      busy: 1,
      opcode: "MUL.D",
      Vj: 80,
      Vk: null,
      Qj: 0,
      Qk: "R7",
    },
    {
      tag: "M1",
      busy: 0,
      opcode: null,
      Vj: null,
      Vk: null,
      Qj: null,
      Qk: null,
    },
    {
      tag: "M2",
      busy: 1,
      opcode: "DIV.D",
      Vj: null,
      Vk: 120,
      Qj: "R8",
      Qk: 0,
    },
  ];

  integerRes = [
    {
      tag: "I0",
      busy: 1,
      opcode: "ADD",
      Vj: 10,
      Vk: null,
      Qj: 0,
      Qk: "R9",
    },
    {
      tag: "I1",
      busy: 1,
      opcode: "SUB",
      Vj: null,
      Vk: 20,
      Qj: "R10",
      Qk: 0,
    },
    {
      tag: "I2",
      busy: 0,
      opcode: null,
      Vj: null,
      Vk: null,
      Qj: null,
      Qk: null,
    },
  ];
  const currentInstructionIndex = getCurrentInstruction(instructions);

  if (currentInstructionIndex != 0 && !currentInstructionIndex) return null; // Either Stall(branch) or no instructions left then we dont issue an instruction
  // There is a current instruction
  const instruction = instructions[currentInstructionIndex];

  // Check for structural hazards if not:
  // return resource and the index in the resource to put the instruction and its tag
  const resourceRes = selectResource(
    instruction,
    loadBuffer,
    storeBuffer,
    addSubRes,
    mulDivRes,
    integerRes
  );

  if (!resourceRes) return null; // Stall or no intructions since no resource avaliable
  const resourceName = resourceRes.resourceName;
  const rowIndex = rowRes.resourceIndex;
  const rowTag = rowRes.rowTag;

  // Update Register file with row tag and get row details
  const updateRegsValuesGetRowRes = updateRegsValuesGetRow(
    instruction,
    integerRegisters,
    floatingRegisters,
    rowTag
  );
  if (!updateRegsValuesGetRowRes) return null; // DK why
  const rowDetails = updateRegsValuesGetRowRes.row;
  integerRegisters = updateRegsValuesGetRowRes.integerRegisters;
  floatingRegisters = updateRegsValuesGetRowRes.floatingRegisters;

  // Update buffer/reservation station
  switch (resourceName) {
    case "loadBuffer":
      loadBuffer[rowIndex] = rowDetails;
      break;
    case "storeBuffer":
      storeBuffer[rowIndex] = rowDetails;
      break;
    case "addSubRes":
      addSubRes[rowIndex] = rowDetails;
      break;
    case "mulDivRes":
      mulDivRes[rowIndex] = rowDetails;
      break;
    case "integerRes":
      integerRes[rowIndex] = rowDetails;
      break;
    default:
      console.error(`Invalid resource name: ${resourceName}`);
  }

  // If has come to this point then the instruction has successfully issued so just update the instruction to issue at the current clock cycle
  instructions[currentInstructionIndex] = {
    ...instructions[currentInstructionIndex],
    issue: clock,
  };

  // Return updated values of register file, instructions and buffers/Reservation stations
  return {
    instructions,
    integerRegisters,
    floatingRegisters,
    loadBuffer,
    storeBuffer,
    addSubRes,
    mulDivRes,
    integerRes,
  };
};

const getCurrentInstruction = (instructions) => {
  let instructionsIssuesFinished = false;

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
    // There is a previous instruction and the previous instruction is a branch

    if (!previousInstruction.writeResult) return null; // If did not write result stall since no branch prediction
    // If here then it has written the result
    const label = instructions[mostRecentIssueIndex].toLabel;
    instructions.forEach((instr, index) => {
      if (instr.label === label) {
        currentInstructionIndex = index;
        currentInstruction = instr;
        return; // Exit forEach
      }
    });
    if (!currentInstruction) return nulll; // There is a branch to an invalid label
  } else {
    // No previous insruction OR previous instruction is not a branch
    // So next instruction is a the next one in the queue
    if (mostRecentIssueIndex + 1 >= instructions.length) {
      // Previous instruction not a branch and the most recent issued is the last one in the instructions
      // So the issues have finished
      instructionsIssuesFinished = true;
      return null; // We do not do anything
    }
    currentInstructionIndex = mostRecentIssueIndex + 1;
    currentInstruction = instructions[mostRecentIssueIndex + 1];
  }
  return currentInstructionIndex;
};

/**
 * Selects an appropriate resource (reservation station or buffer) for a given instruction
 * based on its opcode and returns details about the selected resource.
 *
 * @param {Object} instruction - The instruction object containing the operation code and related fields.
 *   @property {string} opcode - The operation code of the instruction (e.g., LD, LW, SD, SW, ADD.D, SUB.D, MUL.D, DIV.D).
 *
 * @param {Array<Object>} loadBuffer - The load buffer, an array of objects representing load reservation stations.
 * @param {Array<Object>} storeBuffer - The store buffer, an array of objects representing store reservation stations.
 * @param {Array<Object>} addSubRes - The reservation stations for floating-point ADD/SUB operations.
 * @param {Array<Object>} mulDivRes - The reservation stations for floating-point MUL/DIV operations.
 * @param {Array<Object>} integerRes - The reservation stations for integer operations, including branch instructions.
 *
 * All buffers and reservation stations share the following structure:
 *   @property {string} tag - The tag of the reservation station or buffer (e.g., "M1").
 *   @property {number} busy - Indicates if the reservation station is busy (1 = busy, 0 = not busy).
 *   @property {string|null} opcode - The operation code of the instruction assigned to the station (or null if unoccupied).
 *   @property {number|null} Vj - The value of the first operand (or null if not yet available).
 *   @property {number|null} Vk - The value of the second operand (or null if not yet available).
 *
 * @returns {Object|null} - Details about the selected resource or `null` if no suitable resource is available.
 *   @property {String} resourceName - The name of reservation station.
 *   @property {Array<Object>} resource - The array representing the selected buffer or reservation station.
 *   @property {number} resourceIndex - The index of the selected resource within the array.
 *   @property {string} rowTag - A unique tag representing the selected resource (e.g., "L0", "S1", "A2", "M3", "I4").
 *   Returns `null` if no available slot is found, indicating a stall condition.
 *
 * @example
 * // Example Usage:
 * const instruction = { opcode: "ADD.D" };
 * const loadBuffer = [{ busy: 0, tag: "L0" }, { busy: 1, tag: "L1" }];
 * const storeBuffer = [{ busy: 1, tag: "S0" }, { busy: 1, tag: "S1" }];
 * const addSubRes = [{ busy: 0, tag: "A0" }, { busy: 1, tag: "A1" }];
 * const mulDivRes = [{ busy: 1, tag: "M0" }, { busy: 1, tag: "M1" }];
 * const integerRes = [{ busy: 0, tag: "I0" }, { busy: 0, tag: "I1" }];
 *
 * const result = selectResource(
 *   instruction,
 *   loadBuffer,
 *   storeBuffer,
 *   addSubRes,
 *   mulDivRes,
 *   integerRes
 * );
 *
 * console.log(result);
 * // Output:
 * // {
 * //   resource: addSubRes,
 * //   resourceIndex: 0,
 * //   rowTag: "A0"
 * // }
 *
 * // If no resource is available:
 * const stalledResult = selectResource(
 *   { opcode: "MUL.D" },
 *   loadBuffer,
 *   storeBuffer,
 *   [{ busy: 1, tag: "A0" }, { busy: 1, tag: "A1" }],
 *   [{ busy: 1, tag: "M0" }, { busy: 1, tag: "M1" }],
 *   integerRes
 * );
 *
 * console.log(stalledResult);
 * // Output: null
 */
const selectResource = (
  instruction,
  loadBuffer,
  storeBuffer,
  addSubRes,
  mulDivRes,
  integerRes
) => {
  const opcode = instruction?.opcode;
  let resourceName = null;
  let resourceIndex = -1;
  let rowTag = null;

  if (loadOpcodes.includes(opcode)) {
    // TODO TOASK
    // Still see the integer reservation station for LD,LW,SD,SW?
    loadBuffer.forEach((bufferEl, index) => {
      if (bufferEl.busy == 0) {
        // Found a vacant slot
        resourceName = "loadBuffer";
        resourceIndex = index;
        rowTag = `L${index}`;
      }
    });
  } else if (storeOpcodes.includes(opcode)) {
    // Still see the integer reservation station for LD,LW,SD,SW?
    storeBuffer.forEach((bufferEl, index) => {
      if (bufferEl.busy == 0) {
        // Found a vacant slot
        resourceName = "storeBuffer";
        resourceIndex = index;
        rowTag = `S${index}`;
      }
    });
  } else if (addSubFloatingOpcodes.includes(opcode)) {
    addSubRes.forEach((reservation, index) => {
      if (reservation.busy == 0) {
        // Found a vacant slot
        resourceName = "addSubRes";
        resourceIndex = index;
        rowTag = `A${index}`;
      }
    });
  } else if (mulDivFloatingOpcodes.includes(opcode)) {
    mulDivRes.forEach((reservation, index) => {
      if (reservation.busy == 0) {
        // Found a vacant slot
        resourceName = "mulDivRes";
        resourceIndex = index;
        rowTag = `M${index}`;
      }
    });
  } else if (
    branchOpcodes.includes(opcode) ||
    integerAluOpcodes.includes(opcode)
  ) {
    // TODO TOASK
    // TODO ask what to do with branch
    integerRes.forEach((reservation, index) => {
      if (reservation.busy == 0) {
        // Found a vacant slot
        resourceName = "integerRes";
        resourceIndex = index;
        rowTag = `I${index}`;
      }
    });
  }

  if (!resource) return null; // No vacant space in corresponding reservation station/buffer so ==> STALL
  return { resourceName, resourceIndex, rowTag };
};

const resourceCheck = (instruction, resource) => {
  let freeIndex = -1;
  resource.forEach((row, index) => {
    if (row.busy == 0) {
      // Found a vacant slot
      freeIndex = index;
    }
  });
  if (freeIndex == -1) return -1; // Stall
};

/**
 * Updates the values of the reservation station buffer or registers based on the provided instruction
 * and returns the updated state and buffer entry.
 *
 * @param {Object} instruction - The instruction object containing relevant fields for processing.
 *   @property {string} label - (Optional) The label associated with the instruction.
 *   @property {string} opcode - The operation code indicating the type of operation (e.g., ADD.D, MUL.D).
 *   @property {string} R1 - The destination register for the result of the instruction.
 *   @property {string} R2 - The first source register for the instruction.
 *   @property {string} R3 - The second source register for the instruction (if applicable).
 *   @property {number|string} immediate - (Optional) Immediate value for the instruction, if applicable.
 *   @property {string} effective - (Optional) Effective address or computed memory location.
 *
 * @param {Object} integerRegisters - The current state of the integer register file.
 *   Each key represents a register (e.g., "R0", "R1", ..., "R29"), and its value is the current value stored in that register.
 *
 * @param {Object} floatingRegisters - The current state of the floating-point register file.
 *   Each key represents a floating-point register (e.g., "F0", "F1", ..., "F29"), and its value is the current value stored in that register.
 *
 * @param {string} rowTag - A unique tag representing the reservation station or buffer that this instruction occupies.
 *   This tag is used to update the register file to indicate which resource is producing a result for the instruction.
 *
 * @returns {Object} - The updated state of the reservation station buffer and register files.
 *   @property {Object} row - The row to be added to the reservation station buffer.
 *     @property {string} tag - The tag of the reservation station or buffer (e.g., "M1").
 *     @property {number} busy - Indicates if the reservation station is busy (1 = busy, 0 = not busy).
 *     @property {string} opcode - The operation code of the instruction (e.g., "ADD.D").
 *     @property {number|null} Vj - The value of the first operand (or null/not used if not yet available).
 *     @property {number|null} Vk - The value of the second operand (or null/not used  if not yet available).
 *     @property {number|null} Qj - The tag of the resource that will produce first operand (not yet available).
 *     @property {number|null} Qk - The tag of the resource that will produce second operand (not yet available).
 *   @property {Object} integerRegisters - The updated integer register file after processing the instruction.
 *   @property {Object} floatingRegisters - The updated floating-point register file after processing the instruction.
 *
 * @example
 * // Example Usage:
 * const instruction = {
 *   label: "L1",
 *   opcode: "ADD.D",
 *   R1: "F5",
 *   R2: "F2",
 *   R3: "F3",
 *   immediate: null,
 *   effective: null
 * };
 *
 * const integerRegisters = {
 *   R0: 0, R1: 1, R2: 5, R3: 10, R4: 0, R5: 0, R6: 0, // ... up to R29
 * };
 *
 * const floatingRegisters = {
 *   F0: 0.0, F1: 1.0, F2: 5.0, F3: 10.0, F4: 0.0, F5: 0.0, // ... up to F29
 * };
 *
 * const rowTag = "M1";
 *
 * const result = updateRsBufferRegsValues(instruction, integerRegisters, floatingRegisters, rowTag);
 *
 * console.log(result.row);
 * // {
 * //   tag: "M1",
 * //   busy: 1,
 * //   opcode: "ADD.D",
 * //   Vj: 10,
 * //   Vk: 99
 * // }
 *
 * console.log(result.integerRegisters);
 * // Updated integerRegisters object
 *
 * console.log(result.floatingRegisters);
 * // Updated floatingRegisters object
 */
const updateRegsValuesGetRow = (
  instruction,
  integerRegisters,
  floatingRegisters,
  rowTag
) => {
  const reg1 = instruction.R1;
  const reg1Type = reg1[0];
  const reg2 = instruction.R2;
  const reg2Type = reg2[0];
  const reg3 = instruction.R3;
  const reg3Type = reg3[0];

  let register2Obj = null;
  let register3Obj = null;

  // Set register tags to wait for
  if (reg1Type == "F") {
    floatingRegisters[reg1] = { ...floatingRegisters[reg1], Qi: rowTag };
  } else {
    integerRegisters[reg1] = { ...integerRegisters[reg1], Qi: rowTag };
  }

  // Get register Objects
  if (reg2Type == "F") {
    register2Obj = floatingRegisters[reg2];
  } else {
    register2Obj = integerRegisters[reg2];
  }

  if (reg3Type == "F") {
    register3Obj = floatingRegisters[reg3];
  } else {
    register3Obj = integerRegisters[reg3];
  }

  let row = { tag: rowTag, busy: 1, opcode: instruction.opcode }; // Resource row (instr in buffer or reservation station)
  // Update instuction according to registers
  if (register2Obj.Qi != 0) {
    row = { ...row, Qj: register2Obj.Qi };
  } else {
    row = { ...row, Vj: register2Obj.value };
  }

  if (register3Obj.Qi != 0) {
    row = { ...row, Qk: register3Obj.Qj };
  } else {
    row = { ...row, Vk: register3Obj.value };
  }
  console.dir(JSON.stringify(row, null, 2));
  //   console.dir(JSON.stringify(integerRegisters, null, 2));
  //   console.dir(JSON.stringify(floatingRegisters, null, 2));

  return { row, integerRegisters, floatingRegisters };
};

const simulateNextClock = (
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

// console.log("here");

issue(null);

// updateRsBufferRegsValues(
//   {
//     R1: "F0",
//     R2: "F4",
//     R3: "F21",
//     label: "LOOP",
//     opcode: "ADD.D",
//   },
//   {
//     R0: { value: 0, Qi: 0 },
//     R1: { value: 0, Qi: 0 },
//     R2: { value: 0, Qi: 0 },
//     R3: { value: 0, Qi: 0 },
//     R4: { value: 0, Qi: 0 },
//     R5: { value: 0, Qi: 0 },
//     R6: { value: 0, Qi: 0 },
//     R7: { value: 0, Qi: 0 },
//     R8: { value: 0, Qi: 0 },
//     R9: { value: 0, Qi: 0 },
//     R10: { value: 0, Qi: 0 },
//     R11: { value: 0, Qi: 0 },
//     R12: { value: 0, Qi: 0 },
//     R13: { value: 0, Qi: 0 },
//     R14: { value: 0, Qi: 0 },
//     R15: { value: 0, Qi: 0 },
//     R16: { value: 0, Qi: 0 },
//     R17: { value: 0, Qi: 0 },
//     R18: { value: 0, Qi: 0 },
//     R19: { value: 0, Qi: 0 },
//     R20: { value: 0, Qi: 0 },
//     R21: { value: 0, Qi: 0 },
//     R22: { value: 0, Qi: 0 },
//     R23: { value: 0, Qi: 0 },
//     R24: { value: 0, Qi: 0 },
//     R25: { value: 0, Qi: 0 },
//     R26: { value: 0, Qi: 0 },
//     R27: { value: 0, Qi: 0 },
//     R28: { value: 0, Qi: 0 },
//     R29: { value: 0, Qi: 0 },
//   },
//   {
//     F0: { value: 0, Qi: 0 },
//     F1: { value: 0, Qi: 0 },
//     F2: { value: 0, Qi: 0 },
//     F3: { value: 0, Qi: 0 },
//     F4: { value: 10, Qi: 0 },
//     F5: { value: 0, Qi: 0 },
//     F6: { value: 0, Qi: 0 },
//     F7: { value: 0, Qi: 0 },
//     F8: { value: 0, Qi: 0 },
//     F9: { value: 0, Qi: 0 },
//     F10: { value: 0, Qi: 0 },
//     F11: { value: 0, Qi: 0 },
//     F12: { value: 0, Qi: 0 },
//     F13: { value: 0, Qi: 0 },
//     F14: { value: 0, Qi: 0 },
//     F15: { value: 0, Qi: 0 },
//     F16: { value: 0, Qi: 0 },
//     F17: { value: 0, Qi: 0 },
//     F18: { value: 0, Qi: 0 },
//     F19: { value: 0, Qi: 0 },
//     F20: { value: 0, Qi: 0 },
//     F21: { value: 99, Qi: 0 },
//     F22: { value: 0, Qi: 0 },
//     F23: { value: 0, Qi: 0 },
//     F24: { value: 0, Qi: 0 },
//     F25: { value: 0, Qi: 0 },
//     F26: { value: 0, Qi: 0 },
//     F27: { value: 0, Qi: 0 },
//     F28: { value: 0, Qi: 0 },
//     F29: { value: 0, Qi: 0 },
//   },
//   "M1"
// );
