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
  let sets = cacheSize / blockSize;
  let cacheTemp = [];
  let block = [];
  for (let i = 0; i < blockSize / 8; i++) {
    // create block of size BlockSize/8
    block.push(0);
  }
  for (let i = 0; i < sets; i++) {
    // create block of size BlockSize/8
    cacheTemp.push(block);
  }
  return cacheTemp;
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
  let reg1Type = null;

  const reg2 = instruction.R2;
  let reg2Type = null;
  let register2Obj = null;

  const reg3 = instruction.R3;
  let reg3Type = null;
  let register3Obj = null;

  let row = { tag: rowTag, busy: 1, opcode: instruction.opcode }; // Resource row (instr in buffer or reservation station)

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
      row = { ...row, Qk: register3Obj.Qj };
    } else {
      row = { ...row, Vk: register3Obj.value };
    }
  }

  // Update register file to listen to certain tag (after the getting because not use their in Q)
  if (reg1) {
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
    if (!currentInstruction) return null; // There is a branch to an invalid label
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

export const issue = (
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

export const simulateNextClock = (
  instructionsInput,
  integerRegistersInput,
  floatingRegistersInput,
  cacheInput,
  memoryInput,
  loadBufferInput,
  storeBufferInput,
  addSubResInput,
  mulDivResInput,
  integerResInput,
  clockInput
) => {
  const afterIssue = issue(
    instructionsInput,
    integerRegistersInput,
    floatingRegistersInput,
    null, // cache
    loadBufferInput,
    storeBufferInput,
    addSubResInput,
    mulDivResInput,
    integerResInput,
    clockInput // current clock
  );
  if (!afterIssue) {
    console.log("Issue returned null");
    return;
  }
  let {
    instructions,
    integerRegisters,
    floatingRegisters,
    loadBuffer,
    storeBuffer,
    addSubRes,
    mulDivRes,
    integerRes,
  } = afterIssue;
  // console.dir(JSON.stringify(instructions, null, 2));
  // console.dir(JSON.stringify(integerRegisters, null, 2));
  // console.dir(JSON.stringify(floatingRegisters, null, 2));
  // console.dir(JSON.stringify(loadBuffer, null, 2));
  // console.dir(JSON.stringify(storeBuffer, null, 2));
  // console.dir(JSON.stringify(addSubRes, null, 2));
  // console.dir(JSON.stringify(mulDivRes, null, 2));
  // console.dir(JSON.stringify(integerRes, null, 2));

  return {
    instructions: instructionsInput,
    integerRegisters: integerRegistersInput,
    floatingRegisters: floatingRegistersInput,
    cache: cacheInput,
    memory: memoryInput,
    loadBuffer: loadBufferInput,
    storeBuffer: storeBufferInput,
    addSubRes: addSubResInput,
    mulDivRes: mulDivResInput,
    integerRes: integerResInput,
    ...afterIssue,
  }; // Just initial to return all vars
};
