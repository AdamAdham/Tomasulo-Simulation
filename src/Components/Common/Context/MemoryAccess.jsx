import React, { createContext, useEffect, useState } from "react";
import { useFetcher } from "react-router-dom";


function binaryToDecimal(binaryString) {
    // Ensure the input is a valid binary string
    if (!/^[01]+$/.test(binaryString)) {
      throw new Error("Input must be a string containing only '0' and '1'.");
    }
    
    // Convert the binary string to a decimal integer
    return parseInt(binaryString, 2);
  };


  function replaceLastBitsWithZeros(binaryString, x) {
    // Ensure the input is a valid binary string
    if (!/^[01]+$/.test(binaryString)) {
      throw new Error("Input must be a string containing only '0' and '1'.");
    }
  
    // Ensure x is not greater than the length of the string
    if (x > binaryString.length) {
      throw new Error("x cannot be greater than the length of the binary string.");
    }
  
    // Replace the last x bits with zeros
    let unchangedPart = binaryString.slice(0, binaryString.length - x);
    let replacedPart = "0".repeat(x);
    
    return unchangedPart + replacedPart;
  };


 export const read = (cacheArray, memoryArray, validityArray, tagsArray, location ) => {
    location = "000001110000";
    let hitOrMiss = "still not knowing hit or miss";
    let executeMissCode = 0;
    let addressBits = 12;

    let sets = cacheSize / blockSize;
   
    let block = [];
   
     
    let bitsCountIndex = Math.log2(sets); // Calculate log base 2 of 'sets'
    let bitsCountOffsets = Math.log2(blockSize/8);



    bitsCountIndex = Math.floor(bitsCountIndex);
    bitsCountOffsets = Math.floor(bitsCountOffsets);
    let bitsCountTag = addressBits - bitsCountIndex - bitsCountOffsets;

// Extract substrings
    let tagBin = location.substring(0, bitsCountTag);
    let indexBin = location.substring(bitsCountTag, bitsCountTag + bitsCountIndex);
    let offsetBin = location.substring(bitsCountTag + bitsCountIndex);

    let tagDecimal = binaryToDecimal(tagBin);
    let indexDecimal = binaryToDecimal(indexBin);
    let offsetDecimal = binaryToDecimal(offsetBin);
    let locationDecimal = binaryToDecimal(location);
    
    let missLocationStartBin = replaceLastBitsWithZeros(location, bitsCountOffsets); 
    let missLocationStartDecimal = binaryToDecimal(missLocationStartBin);


   if(validityArray[indexDecimal] == 1){
    if(tagsArray[indexDecimal] == tagBin){
        let blockInhand = cacheArray[indexDecimal];
        let dataRead = blockInhand[offsetDecimal];
        hitOrMiss = "congrats, it is a hit";
        //return [hitOrMiss, dataRead, locationDecimal];
        return [hitOrMiss, dataRead, indexDecimal, tagBin, locationDecimal, offsetDecimal, blockInhand];

    }
    else{
        executeMissCode = 1;


    }

   }

   else{
    executeMissCode = 1;
    

   }

   if(executeMissCode == 1){
    hitOrMiss = "bad, it was a miss";
    let count = missLocationStartDecimal;
    for (let i = 0; i < blockSize / 8; i++) {
        // create block of size BlockSize/8
        block.push(memoryArray[count]);
        count = count +1;
      }
      let dataRead = memoryArray[locationDecimal];
      return [hitOrMiss, dataRead, indexDecimal, tagBin, locationDecimal, offsetDecimal, block];

   }


    
   
  };






  export const write = (cacheArray, memoryArray, validityArray, tagsArray, location, dataWrite ) => {
     location = "000001110000";
    let hitOrMiss = "still not knowing hit or miss";
    let executeMissCode = 0;
    let addressBits = 12;

    let sets = cacheSize / blockSize;
   
    let block = [];
   
     
    let bitsCountIndex = Math.log2(sets); // Calculate log base 2 of 'sets'
    let bitsCountOffsets = Math.log2(blockSize/8);



    bitsCountIndex = Math.floor(bitsCountIndex);
    bitsCountOffsets = Math.floor(bitsCountOffsets);
    let bitsCountTag = addressBits - bitsCountIndex - bitsCountOffsets;

// Extract substrings
    let tagBin = location.substring(0, bitsCountTag);
    let indexBin = location.substring(bitsCountTag, bitsCountTag + bitsCountIndex);
    let offsetBin = location.substring(bitsCountTag + bitsCountIndex);

    let tagDecimal = binaryToDecimal(tagBin);
    let indexDecimal = binaryToDecimal(indexBin);
    let offsetDecimal = binaryToDecimal(offsetBin);
    let locationDecimal = binaryToDecimal(location);
    
    let missLocationStartBin = replaceLastBitsWithZeros(location, bitsCountOffsets); 
    let missLocationStartDecimal = binaryToDecimal(missLocationStartBin);


   if(validityArray[indexDecimal] == 1){
    if(tagsArray[indexDecimal] == tagBin){
       // let blockInhand = cacheArray[indexDecimal];
       // let dataRead = blockInhand[offsetDecimal];
       block = cacheArray[indexDecimal];
        hitOrMiss = "congrats, it is a hit";
       // return [hitOrMiss, locationDecimal, indexDecimal, tagBin, offsetDecimal, dataWrite, block];

        return [hitOrMiss, dataWrite, indexDecimal, tagBin, locationDecimal, offsetDecimal, block];

    }
    else{
        executeMissCode = 1;
      

    }

   }

   else{
    executeMissCode = 1;
    

   }

   if(executeMissCode == 1){
    hitOrMiss = "bad, it was a miss";
    let count = missLocationStartDecimal;
    for (let i = 0; i < blockSize / 8; i++) {
        // create block of size BlockSize/8
        block.push(memoryArray[count]);
        count = count +1;
      }
      //let dataRead = memoryArray[locationDecimal];
      return [hitOrMiss, dataWrite, indexDecimal, tagBin, locationDecimal, offsetDecimal, block];
      

   }


    
   
  };




  export const updateMemoryWrite = (cacheArray, memoryArray, validityArray, tagsArray, tagBin, locationDecimal, indexDecimal, offsetDecimal, block, dataWrite ) => {
    
   tagsArray[indexDecimal] = tagBin;
   validityArray[indexDecimal] = 1;
   cacheArray[indexDecimal] = block;
    cacheArray[indexDecimal][offsetDecimal] = dataWrite;
    
    memoryArray[locationDecimal] = dataWrite;

   
   return [cacheArray, memoryArray, validityArray, tagsArray];
    
   
  };

  export const updateMemoryRead = (cacheArray, validityArray, tagsArray, tagBin, indexDecimal, block ) => {
    
    tagsArray[indexDecimal] = tagBin;
    validityArray[indexDecimal] = 1;
    cacheArray[indexDecimal] = block;

    return [cacheArray, memoryArray, validityArray, tagsArray];
     
   };