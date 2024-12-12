import { logDOM } from "@testing-library/react";
import {
  integerAluOpcodes,
  floatingAluOpcodes,
  loadStoreOpcodes,
  loadOpcodes,
  storeOpcodes,
  opcodeList,
  branchOpcodes,
  mulDivFloatingOpcodes,
  addSubFloatingOpcodes,
} from "../../Constants/Constants";

import {
  read,
  updateMemoryRead,
  write,
  updateMemoryWrite,
} from "./Context/MemoryAccess";

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

export const initializeCache = (cacheSize, blockSize) => {
  console.log("init block sise", blockSize);

  let sets = cacheSize / blockSize;
  let cacheTemp = [];
  let block = [];
  let tagsTemp = [];
  let validityTemp = [];
  for (let i = 0; i < blockSize ; i++) {
    // create block of size BlockSize/8
    block.push(0);
  }
  for (let i = 0; i < sets; i++) {
    // create block of size BlockSize/8
    cacheTemp.push(block);
    tagsTemp.push("empty");
    validityTemp.push(0);
  }

  return [cacheTemp, tagsTemp, validityTemp];
};

export const initializeResources = (
  loadBufferSize,
  storeBufferSize,
  addSubResSize,
  mulDivResSize,
  integerResSize
) => {
  const element = {
    busy: 0,
    opcode: null,
    Vj: null,
    Vk: null,
    Qj: 0,
    Qk: 0,
    A: null,
  };
  let resources = {};
  const loadBufferTemp = [];
  for (let i = 0; i < loadBufferSize; i++) {
    loadBufferTemp.push({ ...element, tag: `L${i}` });
  }
  resources["loadBuffer"] = loadBufferTemp;

  const storeBufferTemp = [];
  for (let i = 0; i < storeBufferSize; i++) {
    storeBufferTemp.push({ ...element, tag: `S${i}` });
  }
  resources["storeBuffer"] = storeBufferTemp;

  const addSubResTemp = [];
  for (let i = 0; i < addSubResSize; i++) {
    addSubResTemp.push({ ...element, tag: `A${i}` });
  }
  resources["addSubRes"] = addSubResTemp;

  const mulDivResTemp = [];
  for (let i = 0; i < mulDivResSize; i++) {
    mulDivResTemp.push({ ...element, tag: `M${i}` });
  }
  resources["mulDivRes"] = mulDivResTemp;

  const integerResTemp = [];
  for (let i = 0; i < integerResSize; i++) {
    integerResTemp.push({ ...element, tag: `I${i}` });
  }
  resources["integerRes"] = integerResTemp;

  return resources;
};

// SIMULATION

// ISSUE FUNCTIONS
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
  instructionIndex,
  integerRegisters,
  floatingRegisters,
  rowTag
) => {
  const reg1 = instruction.R1;
  let reg1Type = null;

  const reg2 = instruction.R2;
  let reg2Type = null;
  let register2Obj = null;

  const reg3 = instruction.R3;
  let reg3Type = null;
  let register3Obj = null;

  const immediate = instruction.immediate;

  let row = {
    tag: rowTag,
    busy: 1,
    opcode: instruction.opcode,
    instructionIndex, // Instruction index to change in the instructions table
    Qj: 0,
    Qk: 0,
  }; // Resource row (instr in buffer or reservation station)

  if (reg2) {
    reg2Type = reg2[0];
    // Get register Objects
    if (reg2Type && reg2Type == "F") {
      register2Obj = floatingRegisters[reg2];
    } else {
      register2Obj = integerRegisters[reg2];
    }

    // Update instuction according to registers
    if (register2Obj && register2Obj.Qi != 0) {
      row = { ...row, Qj: register2Obj.Qi };
    } else {
      row = { ...row, Vj: register2Obj.value };
    }
  }

  if (reg3) {
    reg3Type = reg3[0];
    // Get register Objects
    if (reg3Type && reg3Type == "F") {
      register3Obj = floatingRegisters[reg3];
    } else {
      register3Obj = integerRegisters[reg3];
    }

    // Update instuction according to registers
    if (register3Obj && register3Obj.Qi != 0) {
      row = { ...row, Qk: register3Obj.Qi };
    } else {
      row = { ...row, Vk: register3Obj.value };
    }
  } else if (immediate) {
    row = { ...row, immediate };
  }

  console.log(instruction);

  // Update register file to listen to certain tag (after the getting because not use their in Q)
  if (reg1) {
    // If branch operation no register updates will be done
    reg1Type = reg1[0]; // get first letter of the name (F|R)
    if (reg1Type && reg1Type == "F") {
      floatingRegisters[reg1] = { ...floatingRegisters[reg1], Qi: rowTag };
    } else {
      integerRegisters[reg1] = { ...integerRegisters[reg1], Qi: rowTag };
    }
  }

  return { row, integerRegisters, floatingRegisters };
};

const getCurrentInstruction = (instructions) => {
  let instructionsIssuesFinished = false;

  // Loop through instructions to check the last issued one
  let mostRecentIssue = -1;
  let mostRecentIssueIndex = -1;

  instructions?.forEach((instr, index) => {
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
  console.log(previousInstruction);

  if (
    previousInstruction &&
    branchOpcodes.includes(previousInstruction?.opcode) &&
    previousInstruction?.value !== false // branch
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
    if (!currentInstruction) {
      // There is a branch to an invalid label
      return null;
    } else if (currentInstruction && previousInstruction?.writeValue) {
      // Label is valid and the branch condition is satisfied
      return currentInstructionIndex;
    }
  }
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
    // For loadBuffer, find the first vacant slot
    const vacancy = loadBuffer?.find((bufferEl) => bufferEl.busy == 0);
    if (vacancy) {
      resourceName = "loadBuffer";
      resourceIndex = loadBuffer.indexOf(vacancy);
      rowTag = `L${resourceIndex}`;
    }
  } else if (storeOpcodes.includes(opcode)) {
    // For storeBuffer, find the first vacant slot
    const vacancy = storeBuffer?.find((bufferEl) => bufferEl.busy == 0);
    if (vacancy) {
      resourceName = "storeBuffer";
      resourceIndex = storeBuffer.indexOf(vacancy);
      rowTag = `S${resourceIndex}`;
    }
  } else if (addSubFloatingOpcodes.includes(opcode)) {
    // For addSubRes, find the first vacant slot
    const vacancy = addSubRes?.find((reservation) => reservation.busy == 0);
    if (vacancy) {
      resourceName = "addSubRes";
      resourceIndex = addSubRes.indexOf(vacancy);
      rowTag = `A${resourceIndex}`;
    }
  } else if (mulDivFloatingOpcodes.includes(opcode)) {
    // For mulDivRes, find the first vacant slot
    const vacancy = mulDivRes?.find((reservation) => reservation.busy === 0);
    if (vacancy) {
      resourceName = "mulDivRes";
      resourceIndex = mulDivRes.indexOf(vacancy);
      rowTag = `M${resourceIndex}`;
    }
  } else if (
    branchOpcodes.includes(opcode) ||
    integerAluOpcodes.includes(opcode)
  ) {
    // For integerRes, find the first vacant slot
    const vacancy = integerRes?.find((reservation) => reservation.busy == 0);
    if (vacancy) {
      resourceName = "integerRes";
      resourceIndex = integerRes.indexOf(vacancy);
      rowTag = `I${resourceIndex}`;
    }
  }

  if (!resourceName) {
    console.log(
      "No vacant space in corresponding reservation station/buffer so ==> STALL"
    );

    return null; //No vacant space in corresponding reservation station/buffer so ==> STALL
  }
  return { resourceName, resourceIndex, rowTag };
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
};

const cleanInstruction = (instruction) => {
  return {
    label: instruction.label,
    opcode: instruction.opcode,
    R1: instruction.R1,
    R2: instruction.R2,
    R3: instruction.R3,
    immediate: instruction.immediate,
    effective: instruction.effective,
    toLabel: instruction.toLabel,
  };
};

export const issue = (
  instructions,
  integerRegisters,
  floatingRegisters,
  loadBuffer,
  storeBuffer,
  addSubRes,
  mulDivRes,
  integerRes,
  clock
) => {
  const currentInstructionIndex = getCurrentInstruction(instructions);

  if (currentInstructionIndex != 0 && !currentInstructionIndex) {
    console.log(
      "Either Stall(branch) or no instructions left then we dont issue an instruction"
    );
    return null;
  } // Either Stall(branch) or no instructions left then we dont issue an instruction
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

  if (!resourceRes) {
    console.log("Searching for resources returned null");
    return null; // Stall or no intructions since no resource avaliable
  }
  const resourceName = resourceRes.resourceName;
  const rowIndex = resourceRes.resourceIndex;
  const rowTag = resourceRes.rowTag;

  // Update Register file with row tag and get row details

  const updateRegsValuesGetRowRes = updateRegsValuesGetRow(
    instruction,
    currentInstructionIndex,
    integerRegisters,
    floatingRegisters,
    rowTag
  );
  if (!updateRegsValuesGetRowRes) {
    console.log("updateRegsValuesGetRowRes is null");
    return null;
  } // DK why
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
  // Why reasign SOME values, because if this instruction has already gone through its
  instructions[currentInstructionIndex] = {
    ...cleanInstruction(instructions[currentInstructionIndex]),
    issue: clock,
    rowTag,
  };
};
export const issueQueue = (
  instructions,
  instructionsInitial,
  integerRegisters,
  floatingRegisters,
  loadBuffer,
  storeBuffer,
  addSubRes,
  mulDivRes,
  integerRes,
  clock
) => {
  const currentInstructionIndex = getCurrentInstruction(instructionsInitial);

  if (currentInstructionIndex != 0 && !currentInstructionIndex) {
    console.log(
      "Either Stall(branch) or no instructions left then we dont issue an instruction"
    );
    return null;
  } // Either Stall(branch) or no instructions left then we dont issue an instruction
  // There is a current instruction

  const instruction = instructionsInitial[currentInstructionIndex];
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

  if (!resourceRes) {
    console.log("Searching for resources returned null");
    return null; // Stall or no intructions since no resource avaliable
  }
  const resourceName = resourceRes.resourceName;
  const rowIndex = resourceRes.resourceIndex;
  const rowTag = resourceRes.rowTag;

  // Update Register file with row tag and get row details

  const updateRegsValuesGetRowRes = updateRegsValuesGetRow(
    instruction,
    instructions.length, // Instruction index is the length (not minus because we havent appended yet), since it is the last instruction in the queue
    integerRegisters,
    floatingRegisters,
    rowTag
  );
  if (!updateRegsValuesGetRowRes) {
    console.log("updateRegsValuesGetRowRes is null");
    return null;
  } // DK why
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
  // Why reasign SOME values, because if this instruction has already gone through its

  instructions.push({
    ...cleanInstruction(instructionsInitial[currentInstructionIndex]),
    issue: clock,
    rowTag,
  });

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

// TODO A in buffer/res
const startExecStation = (
  instructions,
  clock,
  cache,
  memory,
  validityArray,
  tagsArray,
  memorySize,
  cacheSize,
  blockSize,
  station
) => {
  station?.forEach((row) => {
    if (row.busy == 1 && !instructions[row.instructionIndex].execStart) {
      // The row is actually occupied and has not yet started executing
      if (row.Qj == 0 && row.Qk == 0) {
        // The row has its values so ready to start executing
        instructions[row.instructionIndex] = {
          ...instructions[row.instructionIndex],
          execStart: clock,
        };
        if (loadStoreOpcodes.includes(row.opcode)) {
          if (instructions[row.instructionIndex].effective) {
            row.A = instructions[row.instructionIndex].effective;
          } else {
            row.A = instructions[row.instructionIndex].immediate + row.Vj;
          }

          if (loadOpcodes.includes(row.opcode)) {
            const [
              hit,
              dataRead,
              indexDecimal,
              tagBin,
              locationDecimal,
              offsetDecimal,
              block,
            ] = read(
              cache,
              memory,
              validityArray,
              tagsArray,
              row.A,
              memorySize,
              cacheSize,
              blockSize
            );
            row.memoryCacheDetails = {
              hit,
              dataRead,
              indexDecimal,
              tagBin,
              locationDecimal,
              offsetDecimal,
              block,
            };

            let loadData = dataRead;
            let loadData32Lower = getLowest32Bits(loadData);
            let loadData32Upper = getUpper32Bits(loadData);

            switch (row.opcode) {
              case "LW":
                instructions[row.instructionIndex].writeValue = loadData32Lower;
                break;
              case "LD":
                instructions[row.instructionIndex].writeValue = loadData;
                break;
              case "L.D":
                instructions[row.instructionIndex].writeValue = loadData;
                break;
              case "L.S":
                instructions[row.instructionIndex].writeValue = loadData32Upper;
                break;
            }
          } else {
            // Store opcodes

            const storeData = row.Vj;
            const storeData32Lower = getLowest32Bits(row.Vj);
            const storeData32Upper = getUpper32Bits(row.Vj);
            let writeData = null;
            switch (row.opcode) {
              case "SW":
                writeData = storeData32Lower;
                break;
              case "SD":
                writeData = storeData;
                break;
              case "S.D":
                writeData = storeData;
                break;
              case "S.S":
                writeData = storeData32Upper;
                break;
            }

            const [
              hit,
              dataWrite,
              indexDecimal,
              tagBin,
              locationDecimal,
              offsetDecimal,
              block,
            ] = write(
              cache,
              memory,
              validityArray,
              tagsArray,
              row.A,
              writeData,
              memorySize,
              cacheSize,
              blockSize
            );
            row.memoryCacheDetails = {
              hit,
              dataWrite,
              indexDecimal,
              tagBin,
              locationDecimal,
              offsetDecimal,
              block,
            };
          }
        }
      }
    }
  });

  return { instructions, station };
};

const getLowest32Bits = (value) => {
  return value & 0xffffffff; // Extract the lowest 32 bits
};

const getUpper32Bits = (value) => {
  return value & 0xffffffff00000000; // Extract the lowest 32 bits
};

const computeValues = (row, opcode) => {
  const VjDouble = row.Vj;
  const VkDouble = row.Vk;
  const VjSingle = getLowest32Bits(VjDouble);
  const VkSingle = getLowest32Bits(VkDouble);
  const immediate = row.immediate;

  let result = null;
  switch (opcode) {
    case "DADDI":
      result = VjDouble + immediate;
      break;
    case "DSUBI":
      result = VjDouble - immediate;
      break;

    case "ADD.D":
      result = VjDouble + VkDouble;
      break;
    case "ADD.S":
      result = VjSingle + VkSingle;
      break;

    case "SUB.D":
      result = VjDouble - VkDouble;
      break;
    case "SUB.S":
      result = VjSingle - VkSingle;
      break;

    case "MUL.D":
      result = VjDouble * VkDouble;
      break;
    case "MUL.S":
      result = VjSingle * VkSingle;
      break;

    case "DIV.D":
      if (VkDouble !== 0) {
        result = VjDouble / VkDouble;
      } else {
        result = 0;
      }
      break;
    case "DIV.S":
      if (VkSingle !== 0) {
        result = VjSingle / VkSingle;
      } else {
        result = 0;
      }
      break;
    case "BNE":
      result = VjDouble != VkDouble;
      break;
    case "BEQ":
      result = VjDouble == VkDouble;
      break;
    case "LW":
      break;
    case "LD":
      break;
    case "L.S":
      break;
    case "LW":
      break;
    case "S":
    // TODO
    default:
      result = null;
      break;
  }
  return result;
};

const endExecStation = (
  cache,
  memory,
  validityArray,
  tagsArray,
  memorySize,
  cacheSize,
  blockSize,
  cachePenalty,
  instructions,
  clock,
  station,
  latency,
  opcodePart
) => {
  station?.forEach((row) => {
    if (
      row.busy == 1 &&
      instructions[row.instructionIndex].execStart &&
      row.opcode.includes(opcodePart) &&
      !instructions[row.instructionIndex].execEnd
    ) {
      // The row is actually occupied &
      // started executing &&
      // opcode contains the snippet given
      // And did not already set execEnd

      let clockDifference =
        clock - instructions[row.instructionIndex].execStart;
      let delay = latency;
      if (loadStoreOpcodes.includes(row.opcode)) {
        if (!row.memoryCacheDetails.hit) {
          // Miss
          delay = cachePenalty;
        }
      }
      if (clockDifference == delay) {
        // Execute
        const value = computeValues(
          row,
          instructions[row.instructionIndex].opcode
        );
        console.log(value);

        instructions[row.instructionIndex].execEnd = clock;
        if (
          (value || opcodePart == "BEQ" || opcodePart == "BNE") &&
          !loadStoreOpcodes.includes(instructions[row.instructionIndex].opcode)
        ) {
          // The write value has already been decided in the startExec for loadStore ops
          instructions[row.instructionIndex].writeValue = value;
        }
        if (loadOpcodes.includes(instructions[row.instructionIndex].opcode)) {
          const tagBin = row.memoryCacheDetails.tagBin;
          const indexDecimal = row.memoryCacheDetails.indexDecimal;
          const block = row.memoryCacheDetails.block;

          [cache, validityArray, tagsArray] = updateMemoryRead(
            cache,
            validityArray,
            tagsArray,
            tagBin,
            indexDecimal,
            block
          ); // Ask Hany block keda sah?
          console.log(cache);
        } else if (
          storeOpcodes.includes(instructions[row.instructionIndex].opcode)
        ) {
          const tagBin = row.memoryCacheDetails.tagBin;
          const locationDecimal = row.memoryCacheDetails.locationDecimal;
          const block = row.memoryCacheDetails.block;
          const offsetDecimal = row.memoryCacheDetails.offsetDecimal;
          const dataWrite = row.memoryCacheDetails.dataWrite;
          updateMemoryWrite(
            cache,
            memory,
            validityArray,
            tagsArray,
            tagBin,
            locationDecimal,
            offsetDecimal,
            block,
            dataWrite
          );
        }
      }
    }
  });
  return {
    cache,
    memory,
    validityArray,
    tagsArray,
    memorySize,
    cacheSize,
    blockSize,
    cachePenalty,
    instructions,
  };
};

// EXECUTE FUNCTIONS
const handleExecute = (
  instructions,
  clock,
  cache,
  memory,
  validityArray,
  tagsArray,
  memorySize,
  cacheSize,
  blockSize,
  // Resources
  loadBuffer,
  storeBuffer,
  addSubRes,
  mulDivRes,
  integerRes,

  // Instruction Latencies
  latencyStore,
  latencyLoad,
  latencyAdd,
  latencySub,
  latencyMultiply,
  latencyDivide,
  latencyIntegerAdd,
  latencyIntegerSub,
  latencyBranch,

  // Resource Latencies
  cachePenalty
) => {
  // EXEC Start
  // Loop through all resources check if any of them can start

  ({ instructions, station: loadBuffer } = startExecStation(
    instructions,
    clock,
    cache,
    memory,
    validityArray,
    tagsArray,
    memorySize,
    cacheSize,
    blockSize,
    loadBuffer,
    cachePenalty
  ));

  ({ instructions, station: storeBuffer } = startExecStation(
    instructions,
    clock,
    cache,
    memory,
    validityArray,
    tagsArray,
    memorySize,
    cacheSize,
    blockSize,
    storeBuffer,
    cachePenalty
  ));
  ({ instructions, station: addSubRes } = startExecStation(
    instructions,
    clock,
    cache,
    memory,
    validityArray,
    tagsArray,
    memorySize,
    cacheSize,
    blockSize,
    addSubRes,
    cachePenalty
  ));

  ({ instructions, station: mulDivRes } = startExecStation(
    instructions,
    clock,
    cache,
    memory,
    validityArray,
    tagsArray,
    memorySize,
    cacheSize,
    blockSize,
    mulDivRes,
    cachePenalty
  ));

  ({ instructions, station: integerRes } = startExecStation(
    instructions,
    clock,
    cache,
    memory,
    validityArray,
    tagsArray,
    memorySize,
    cacheSize,
    blockSize,
    integerRes,
    cachePenalty
  ));

  // EXEC End

  ({
    cache,
    memory,
    validityArray,
    tagsArray,
    memorySize,
    cacheSize,
    blockSize,
    cachePenalty,
    instructions,
  } = endExecStation(
    cache,
    memory,
    validityArray,
    tagsArray,
    memorySize,
    cacheSize,
    blockSize,
    cachePenalty,
    instructions,
    clock,
    loadBuffer,
    latencyLoad,
    "L"
  ));
  ({
    cache,
    memory,
    validityArray,
    tagsArray,
    memorySize,
    cacheSize,
    blockSize,
    cachePenalty,
    instructions,
  } = endExecStation(
    cache,
    memory,
    validityArray,
    tagsArray,
    memorySize,
    cacheSize,
    blockSize,
    cachePenalty,
    instructions,
    clock,
    storeBuffer,
    latencyStore,
    "S"
  ));
  ({
    cache,
    memory,
    validityArray,
    tagsArray,
    memorySize,
    cacheSize,
    blockSize,
    cachePenalty,
    instructions,
  } = endExecStation(
    cache,
    memory,
    validityArray,
    tagsArray,
    memorySize,
    cacheSize,
    blockSize,
    cachePenalty,
    instructions,
    clock,
    addSubRes,
    latencyAdd,
    "ADD"
  ));
  ({
    cache,
    memory,
    validityArray,
    tagsArray,
    memorySize,
    cacheSize,
    blockSize,
    cachePenalty,
    instructions,
  } = endExecStation(
    cache,
    memory,
    validityArray,
    tagsArray,
    memorySize,
    cacheSize,
    blockSize,
    cachePenalty,
    instructions,
    clock,
    addSubRes,
    latencySub,
    "SUB"
  ));
  ({
    cache,
    memory,
    validityArray,
    tagsArray,
    memorySize,
    cacheSize,
    blockSize,
    cachePenalty,
    instructions,
  } = endExecStation(
    cache,
    memory,
    validityArray,
    tagsArray,
    memorySize,
    cacheSize,
    blockSize,
    cachePenalty,
    instructions,
    clock,
    mulDivRes,
    latencyMultiply,
    "MUL"
  ));
  ({
    cache,
    memory,
    validityArray,
    tagsArray,
    memorySize,
    cacheSize,
    blockSize,
    cachePenalty,
    instructions,
  } = endExecStation(
    cache,
    memory,
    validityArray,
    tagsArray,
    memorySize,
    cacheSize,
    blockSize,
    cachePenalty,
    instructions,
    clock,
    mulDivRes,
    latencyDivide,
    "DIV"
  ));
  ({
    cache,
    memory,
    validityArray,
    tagsArray,
    memorySize,
    cacheSize,
    blockSize,
    cachePenalty,
    instructions,
  } = endExecStation(
    cache,
    memory,
    validityArray,
    tagsArray,
    memorySize,
    cacheSize,
    blockSize,
    cachePenalty,
    instructions,
    clock,
    integerRes,
    latencyIntegerAdd,
    "ADD"
  ));
  ({
    cache,
    memory,
    validityArray,
    tagsArray,
    memorySize,
    cacheSize,
    blockSize,
    cachePenalty,
    instructions,
  } = endExecStation(
    cache,
    memory,
    validityArray,
    tagsArray,
    memorySize,
    cacheSize,
    blockSize,
    cachePenalty,
    instructions,
    clock,
    integerRes,
    latencyIntegerSub,
    "SUB"
  ));

  ({
    cache,
    memory,
    validityArray,
    tagsArray,
    memorySize,
    cacheSize,
    blockSize,
    cachePenalty,
    instructions,
  } = endExecStation(
    cache,
    memory,
    validityArray,
    tagsArray,
    memorySize,
    cacheSize,
    blockSize,
    cachePenalty,
    instructions,
    clock,
    integerRes,
    latencyBranch,
    "BEQ"
  ));

  ({
    cache,
    memory,
    validityArray,
    tagsArray,
    memorySize,
    cacheSize,
    blockSize,
    cachePenalty,
    instructions,
  } = endExecStation(
    cache,
    memory,
    validityArray,
    tagsArray,
    memorySize,
    cacheSize,
    blockSize,
    cachePenalty,
    instructions,
    clock,
    integerRes,
    latencyBranch,
    "BNE"
  ));
  return {
    cache,
    memory,
    validity: validityArray,
    tags: tagsArray,
    instructions,
    loadBuffer,
    storeBuffer,
    addSubRes,
    mulDivRes,
    integerRes,
  };
};

const writeResult = (
  instructions,
  integerRegisters,
  floatingRegisters,
  cache,
  memory,
  loadBuffer,
  storeBuffer,
  addSubRes,
  mulDivRes,
  integerRes,
  clock
) => {
  let writtenToBus = false;
  instructions = instructions?.map((instruction) => {
    if (
      instruction.execEnd &&
      !writtenToBus &&
      !instruction.writeResult &&
      instruction.execEnd != clock
    ) {
      // Instruction finished execution and ready to write
      // No other instruction has written to bus in this cycle
      // And has not written before
      // And has not finished execution this clock cycle
      writtenToBus = true;
      // Update Res/Buffer
      const tag = instruction.rowTag;
      const value = instruction.writeValue;
      loadBuffer = refreshResBufferWrite(loadBuffer, tag, value);
      storeBuffer = refreshResBufferWrite(storeBuffer, tag, value);
      addSubRes = refreshResBufferWrite(addSubRes, tag, value);
      mulDivRes = refreshResBufferWrite(mulDivRes, tag, value);
      integerRes = refreshResBufferWrite(integerRes, tag, value);

      // Update Register File
      integerRegisters = refreshRegisterFileWrite(integerRegisters, tag, value);
      floatingRegisters = refreshRegisterFileWrite(
        floatingRegisters,
        tag,
        value
      );
      instruction.writeResult = clock;
      // TODO
      // WRITE TO MEMORY/CACHE
    }
    return instruction;
  });
  return {
    instructions,
    integerRegisters,
    floatingRegisters,
    cache,
    memory,
    loadBuffer,
    storeBuffer,
    addSubRes,
    mulDivRes,
    integerRes,
  };
};

const refreshResBufferWrite = (station, tag, value) => {
  station = station.map((row) => {
    if (row.tag == tag) {
      // Reset row
      row = {
        tag,
        busy: 0,
        opcode: null,
        Vj: null,
        Vk: null,
        Qj: 0,
        Qk: 0,
        A: null,
      };
    }
    if (row.Qj == tag) {
      row.Vj = value;
      row.Qj = 0;
    }
    if (row.Qk == tag) {
      row.Vk = value;
      row.Qk = 0;
    }
    return row;
  });
  return station;
};

const refreshRegisterFileWrite = (registerFile, tag, value) => {
  Object.keys(registerFile).forEach((registerName, index) => {
    const register = registerFile[registerName];
    if (register.Qi == tag) {
      register.value = value;
      register.Qi = 0;
    }
    registerFile[registerName] = register;
  });
  return registerFile;
};
export const simulateNextClock = (
  instructions,
  integerRegisters,
  floatingRegisters,
  cache,
  memory,
  validityArray,
  tagsArray,
  memorySize,
  cacheSize,
  blockSize,
  loadBuffer,
  storeBuffer,
  addSubRes,
  mulDivRes,
  integerRes,

  // Instruction Latencies
  latencyStore,
  latencyLoad,
  latencyAdd,
  latencySub,
  latencyMultiply,
  latencyDivide,
  latencyIntegerAdd,
  latencyIntegerSub,
  latencyBranch,

  clock,

  // Resource Latencies
  cachePenalty
) => {
  let instructionsTemp = instructions;
  let integerRegistersTemp = integerRegisters;
  let floatingRegistersTemp = floatingRegisters;
  let cacheTemp = cache;
  let memoryTemp = memory;
  let loadBufferTemp = loadBuffer;
  let storeBufferTemp = storeBuffer;
  let addSubResTemp = addSubRes;
  let mulDivResTemp = mulDivRes;
  let integerResTemp = integerRes;
  let validityTemp = validityArray;
  let tagsTemp = tagsArray;

  // console.log("simnextclock", {
  //   instructions,
  //   integerRegisters,
  //   floatingRegisters,
  //   cache,
  //   memory,
  //   validityArray,
  //   tagsArray,
  //   memorySize,
  //   cacheSize,
  //   blockSize,
  //   loadBuffer,
  //   storeBuffer,
  //   addSubRes,
  //   mulDivRes,
  //   integerRes,

  //   // Instruction Latencies
  //   latencyStore,
  //   latencyLoad,
  //   latencyAdd,
  //   latencySub,
  //   latencyMultiply,
  //   latencyDivide,
  //   latencyIntegerAdd,
  //   latencyIntegerSub,
  //   latencyBranch,

  //   clock,

  //   // Resource Latencies
  //   cachePenalty,
  // });

  // console.dir(JSON.stringify(instructions, null, 2));
  // console.dir(JSON.stringify(integerRegisters, null, 2));
  // console.dir(JSON.stringify(floatingRegisters, null, 2));
  // console.dir(JSON.stringify(loadBuffer, null, 2));
  // console.dir(JSON.stringify(storeBuffer, null, 2));
  // console.dir(JSON.stringify(addSubRes, null, 2));
  // console.dir(JSON.stringify(mulDivRes, null, 2));
  // console.dir(JSON.stringify(integerRes, null, 2));
  let executeResult = null;
  if (instructionsTemp.length > 0) {
    executeResult = handleExecute(
      instructionsTemp,
      clock,
      // Resources
      cache,
      memory,
      validityArray,
      tagsArray,
      memorySize,
      cacheSize,
      blockSize,
      loadBufferTemp,
      storeBufferTemp,
      addSubResTemp,
      mulDivResTemp,
      integerResTemp,
      // Instruction Latencies
      latencyStore,
      latencyLoad,
      latencyAdd,
      latencySub,
      latencyMultiply,
      latencyDivide,
      latencyIntegerAdd,
      latencyIntegerSub,
      latencyBranch,
      // Resource Latencies
      cachePenalty
    );
  }
  // console.log("executeResult", executeResult);

  if (executeResult) {
    ({
      instructions: instructionsTemp,
      cache: cacheTemp,
      memory: memoryTemp,
      validity: validityTemp,
      tags: tagsTemp,
      loadBuffer: loadBufferTemp,
      storeBuffer: storeBufferTemp,
      addSubRes: addSubResTemp,
      mulDivRes: mulDivResTemp,
      integerRes: integerResTemp,
    } = executeResult);
  }

  // ISSUE
  const afterIssue = issue(
    instructionsTemp,
    integerRegistersTemp,
    floatingRegistersTemp,
    loadBufferTemp,
    storeBufferTemp,
    addSubResTemp,
    mulDivResTemp,
    integerResTemp,
    clock // current clock
  );
  if (!afterIssue) {
    console.log("Issue returned null");
  } else {
    ({
      instructions: instructionsTemp,
      integerRegisters: integerRegistersTemp,
      floatingRegisters: floatingRegistersTemp,
      loadBuffer: loadBufferTemp,
      storeBuffer: storeBufferTemp,
      addSubRes: addSubResTemp,
      mulDivRes: mulDivResTemp,
      integerRes: integerResTemp,
    } = afterIssue);
  }

  // console.log("afterIssue", afterIssue);

  // Done it after execute because if not, instruction can start executing the same time
  // Done it after issue because not to issue a waiting instruction in same cycle as previous instruction making resource full writes the result
  // the provider instruction has written result on bus
  ({
    instructions: instructionsTemp,
    integerRegisters: integerRegistersTemp,
    floatingRegisters: floatingRegistersTemp,
    loadBuffer: loadBufferTemp,
    storeBuffer: storeBufferTemp,
    addSubRes: addSubResTemp,
    mulDivRes: mulDivResTemp,
    integerRes: integerResTemp,
  } = writeResult(
    instructionsTemp,
    integerRegistersTemp,
    floatingRegistersTemp,
    cacheTemp,
    memoryTemp,
    loadBufferTemp,
    storeBufferTemp,
    addSubResTemp,
    mulDivResTemp,
    integerResTemp,
    clock
  ));

  // exec
  // wr
  return {
    instructions: instructionsTemp,
    integerRegisters: integerRegistersTemp,
    floatingRegisters: floatingRegistersTemp,
    cache: cacheTemp,
    memory: memoryTemp,
    validity: validityTemp,
    tags: tagsTemp,
    loadBuffer: loadBufferTemp,
    storeBuffer: storeBufferTemp,
    addSubRes: addSubResTemp,
    mulDivRes: mulDivResTemp,
    integerRes: integerResTemp,
  }; // Just initial to return all vars
};

export const simulateNextClockQueue = (
  instructions,
  instructionsInitial,
  integerRegisters,
  floatingRegisters,
  cache,
  memory,
  validityArray,
  tagsArray,
  memorySize,
  cacheSize,
  blockSize,
  loadBuffer,
  storeBuffer,
  addSubRes,
  mulDivRes,
  integerRes,

  // Instruction Latencies
  latencyStore,
  latencyLoad,
  latencyAdd,
  latencySub,
  latencyMultiply,
  latencyDivide,
  latencyIntegerAdd,
  latencyIntegerSub,
  latencyBranch,

  clock,

  // Resource Latencies
  cachePenalty
) => {
  let instructionsTemp = instructions;
  let instructionsInitialTemp = instructionsInitial;
  let integerRegistersTemp = integerRegisters;
  let floatingRegistersTemp = floatingRegisters;
  let cacheTemp = cache;
  let memoryTemp = memory;
  let loadBufferTemp = loadBuffer;
  let storeBufferTemp = storeBuffer;
  let addSubResTemp = addSubRes;
  let mulDivResTemp = mulDivRes;
  let integerResTemp = integerRes;
  let validityTemp = validityArray;
  let tagsTemp = tagsArray;

  let executeResult = null;
  if (instructionsTemp.length > 0) {
    executeResult = handleExecute(
      instructionsTemp,
      clock,
      // Resources
      cache,
      memory,
      validityArray,
      tagsArray,
      memorySize,
      cacheSize,
      blockSize,
      loadBufferTemp,
      storeBufferTemp,
      addSubResTemp,
      mulDivResTemp,
      integerResTemp,
      // Instruction Latencies
      latencyStore,
      latencyLoad,
      latencyAdd,
      latencySub,
      latencyMultiply,
      latencyDivide,
      latencyIntegerAdd,
      latencyIntegerSub,
      latencyBranch,
      // Resource Latencies
      cachePenalty
    );
  }
  if (executeResult) {
    ({
      instructions: instructionsTemp,
      cache: cacheTemp,
      memory: memoryTemp,
      validity: validityTemp,
      tags: tagsTemp,
      loadBuffer: loadBufferTemp,
      storeBuffer: storeBufferTemp,
      addSubRes: addSubResTemp,
      mulDivRes: mulDivResTemp,
      integerRes: integerResTemp,
    } = executeResult);
  }

  console.log(loadBufferTemp);

  // ISSUE
  const afterIssue = issueQueue(
    instructionsTemp,
    instructionsInitialTemp,
    integerRegistersTemp,
    floatingRegistersTemp,
    loadBufferTemp,
    storeBufferTemp,
    addSubResTemp,
    mulDivResTemp,
    integerResTemp,
    clock // current clock
  );
  if (!afterIssue) {
    console.log("Issue returned null");
  } else {
    ({
      instructions: instructionsTemp,
      integerRegisters: integerRegistersTemp,
      floatingRegisters: floatingRegistersTemp,
      loadBuffer: loadBufferTemp,
      storeBuffer: storeBufferTemp,
      addSubRes: addSubResTemp,
      mulDivRes: mulDivResTemp,
      integerRes: integerResTemp,
    } = afterIssue);
  }

  // Done it after execute because if not, instruction can start executing the same time
  // Done it after issue because not to issue a waiting instruction in same cycle as previous instruction making resource full writes the result
  // the provider instruction has written result on bus
  ({
    instructions: instructionsTemp,
    integerRegisters: integerRegistersTemp,
    floatingRegisters: floatingRegistersTemp,
    loadBuffer: loadBufferTemp,
    storeBuffer: storeBufferTemp,
    addSubRes: addSubResTemp,
    mulDivRes: mulDivResTemp,
    integerRes: integerResTemp,
  } = writeResult(
    instructionsTemp,
    integerRegistersTemp,
    floatingRegistersTemp,
    cacheTemp,
    memoryTemp,
    loadBufferTemp,
    storeBufferTemp,
    addSubResTemp,
    mulDivResTemp,
    integerResTemp,
    clock
  ));
  // exec
  // wr
  return {
    instructionQueue: instructionsTemp,
    integerRegisters: integerRegistersTemp,
    floatingRegisters: floatingRegistersTemp,
    cache: cacheTemp,
    memory: memoryTemp,
    validity: validityTemp,
    tags: tagsTemp,
    loadBuffer: loadBufferTemp,
    storeBuffer: storeBufferTemp,
    addSubRes: addSubResTemp,
    mulDivRes: mulDivResTemp,
    integerRes: integerResTemp,
  }; // Just initial to return all vars
};
