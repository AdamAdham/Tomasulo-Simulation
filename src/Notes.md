    # Instruction Notes

    ## **Load Instructions**

    ### `LW`

    - **Integer 32 bits**
    - `LW R1,60(R2)` = `R1` <-- `MEM[R1+60]`<sub>0</sub><sup>32</sup> ## `MEM[R1+60]`
    - Add the largest significant bit 32 times concatenated with the 32 bit least significant bits

    ### `LD`

    - **Integer 64 bits**
    - `LD R1,60(R2)` = `R1` <-- `MEM[R1+60]`
    - Put the 64 bits into R1

    ### `L.S`

    - **Float 32 bits (Single precision)**
    - `L.S F1,60(R2)` = `F1` <-- `MEM[R1+60]` ## `0`<sup>32</sup>
    - Put the 32 bits of MEM from [R1+60] and concatenated with 32 bits in the lower significant bits

    ### `L.D`

    - **Float 64 bits (Double precision)**
    - `L.S F1,60(R2)` = `F1` <-- `MEM[R1+60]` ## `0`<sup>32</sup>
    - Put the 64 bits of MEM from [R1+60]in register F1

    ## **Store Instructions**

    ### `SW`

    - **Integer 32 bits**
    - `SW R1,60(R2)` = `MEM[R1+60]` <-- `R1`<sup>32..63</sup>
    - Add the 32 bits in the least significant of register R1 bits to put in MEM

    ### `SD`

    - **Integer 64 bits**
    - `SW R1,60(R2)` = `MEM[R1+60]` <-- `R1`
    - Put the 64 bits of register R1 in MEM

    ### `S.S`

    - **Float 32 bits (Single precision)**
    - `L.S F1,60(R2)` = `MEM[R1+60]` <-- `F1` <sub>0..31</sub>
    - Put the 32 bits most significant bits into MEM
    - _**Floating point numbers are stored from the least significant bits to the most significant bits**_

    ### `S.D`

    - **Float 32 bits (Double precision)**
    - `L.S F1,60(R2)` = `MEM[R1+60]` <-- `F1`
    - Put register F1 in Mem

    # Notes
    - Integer Ops in flow

    # Questions

    - Do we need single precision alu operations? Double (if not will get informed)
    - Do we need other integer operations than "ADDI","SUBI"? YES (if not will informed)
    - Size of memory?
    - What if the addition exceeds memory? modulus w khalas
    - No branch prediction? Branch result when "issued"
    - Which model is needed? With reorder buffer? (tomasulo 3ady)
    - More Branch ops? (BNE , BEQ) (if not will be informed)

ASK:

Integer ALU ops are in the arch, does it issue, execute etc, wala zay el fel lecture done the clk cycle it is? Ta3amal akenaha floating 3ady
Branch ops (BEQ,BNE) are only integer register ones? Integer only
Branch ops since they integer ones they will enter the arch? Used in integer res station (and no issues until branch exec complete)
When will we know the outcome? user will input

LD and Stores ignore address clashes? So msh lazem el heta el akheera fel lectures?
integer load and stores LD,LW,SD,SW will be used in load and store buffers not integer res station? WILL ANSWER ME

CACHE:
Write allocate,no write allocate? (when storing, do we get the value into cache) (el enta 3ayzo) wrte allocate
assume Write through? (el enta 3ayzo) Write through
assume Cache block size range will be larger than 8 bytes? because if not double precision hayetgab ezay law keda? Said okay
cache hit and miss etc, hayetzawed 3al execute wala hangeeb if(hit)min(exec,hit) , if(miss) min(exec,miss)? Disregard hit time now (will answer) Penalty will just add to ld and store latency

# Flow

array of objects, each object = {cache:cacheContent, integerRegisters:integerRegistersContent, floatingRegisters:floatingRegisterContent, memory:memoryContent, buffers, resStations, etc..}
each index in the array represents the clk cycle you are in, you will always have the previous clks there, if index is null (not done yet we simulate the clk cycle using a function `Simulation`)

## Simulation

parameters:
instructions,
cache,
integerRegisters,
floatingRegisters,
memory,
buffers,
resStations,
latencies,

Next clk cycle
