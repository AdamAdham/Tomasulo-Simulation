# **Report**

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

# Steps

## Instructions

1. Got familiar with the different 32 and 64 bit operations
2. Got familiar with the different load and store operations
   Resource: Lecture 1,2,3

## Tomasulo

1. Studied lectures 11-12-13
2. Traced all examples in the lectures to develop a better understanding of the algorithm and its complexities
3. Faced a problem with the memory/cache addressing so delved deeper into memory and cache addressing

## Memory

Firstly we were going to implement it as memory byte addressing and choose a set associativity but thought byte addressing would be too complex and would be a whole simulation and algorithm by itself. So we consulted a TA and they said it would be accepted to use a direct mapped cache (to not use replacement algorithms) and to set that each memory/cache address is 8 bytes to make our life a bit easier since the tomasulo algorithm is complex enough to simulate and we found some challenges with this (eg: if a memory address (100) is addressing a word so will span till (100-101-102-103) so it can span through different cache blocks, which is not a concept we were familiar with). However after implementing this and testing it, by chance we saw the second project notes 2 days before the deadline which explicitly stated byte addressing is needed. So we had to implement the whole memory/cache simulation completely different and test it all over again.

### Word Spanning Challenge

As stated above we faced a challenge that a word can span through different cache blocks. We researched and did not see any concrete information on what actually happens in our devices' memory. So we implemented load and store to see every single address if it is a hit or miss. And if **ANY** of the addresses are misses it is considered as a miss and the corresponding block(s) are fetched from the memory to the cache and cache penalty is indured.

## Assumptions

### Cache

- Cache Size and Block Size are entered in bytes
- Cache Size and Block Size are powers of 2
- Cache Size <= Memory Size
- Block Size <= Cache Size
- Hit latency <= min(loadLatency,storeLatency) since TA said that the load,store latencies are with the cache latency not added to it.

### Branch

If branch label destination is not present, the queue stops

### Write Bus Conflict

When the 2 or more instruction have finished execution, the first instruction in the queue will write the result onto the bus.

# Testing

1. We tested each stage seperately (issue, start execute, end execute and write result) with edge cases and then after reimplementing the memory we retested loads and stores
2. We tested the whole flow using the lecture examples with the same statistic and compared the result with the solutions.
