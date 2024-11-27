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
    - Do we need other integer operations than "ADDI","SUBI"? (if not will informed)
    - Size of memory?
    - What if the addition exceeds memory? modulus w khalas
    - No branch prediction? Branch result when "issued"
    - Which model is needed? With reorder buffer? (tomasulo 3ady)
    - More Branch ops? (BNE , BEQ) (if not will be informed)

ASK:

Integer ALU ops are in the arch, does it issue, execute etc, wala zay el fel lecture done the clk cycle it is? Do we need to also input the
LD and Stores ignore address clashes?
Write allocate,no write allocate?
Cache block size range will be larger than 8 bytes?

cache bel sizes, init
memory any size not specified (each element 8 bits)
cache array of (8 bits) (wait for response)
