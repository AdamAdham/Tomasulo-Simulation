
export function decimalToBinary(decimalNumber, bitLength) {
  // Ensure the input is a valid non-negative integer
  if (!Number.isInteger(decimalNumber) || decimalNumber < 0) {
    throw new Error("Input must be a non-negative integer.");
  }

  // Convert the decimal number to a binary string
  let binaryString = decimalNumber.toString(2);

  // Adjust the length of the binary string to the specified bit length
  if (binaryString.length > bitLength) {
    // Truncate extra bits from the left if the binary string is too long
    binaryString = binaryString.slice(-bitLength);
  } else if (binaryString.length < bitLength) {
    // Pad with leading zeros if the binary string is too short
    binaryString = binaryString.padStart(bitLength, "0");
  }

  return binaryString;
};




export function binaryToDecimal(binaryString) {
  // Ensure the input is a valid binary string
  if (!/^[01]+$/.test(binaryString)) {
    throw new Error("Input must be a string containing only '0' and '1'.");
  }
  //console.log("ali");
  // Convert the binary string to a decimal integer
  return parseInt(binaryString, 2);
};


export function replaceLastBitsWithZeros(binaryString, x) {
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
  
  let outbot = unchangedPart + replacedPart;


return outbot;


};

export function originalRead(cacheArray, memoryArray, validityArray, tagsArray, location, memorySize, cacheSize, blockSize, typeIs32){
  

       if(typeIs32){
        
        
            let firstTemp = read(cacheArray, memoryArray, validityArray, tagsArray, location, memorySize, cacheSize, blockSize);
            let secondTemp = read(cacheArray, memoryArray, validityArray, tagsArray, location + 1, memorySize, cacheSize, blockSize);
            let thirdTemp = read(cacheArray, memoryArray, validityArray, tagsArray, location + 2, memorySize, cacheSize, blockSize);
            let fourthTemp = read(cacheArray, memoryArray, validityArray, tagsArray, location + 3, memorySize, cacheSize, blockSize);
            
            let hit = true;
            if(firstTemp[0] == false || secondTemp[0] == false || thirdTemp[0] == false || fourthTemp[0] == false  ){
              hit = false;
            }
           let dataRead = [firstTemp[1], secondTemp[1], thirdTemp[1], fourthTemp[1]];
           let indexDecimal = [firstTemp[2], secondTemp[2], thirdTemp[2], fourthTemp[2]];
           let tagBin = [firstTemp[3], secondTemp[3], thirdTemp[3], fourthTemp[3]];
          let locationDecimal = [firstTemp[4], secondTemp[4], thirdTemp[4], fourthTemp[4]];
           let offsetDecimal = [firstTemp[5], secondTemp[5], thirdTemp[5], fourthTemp[5]];
          let blockInhand = [firstTemp[6], secondTemp[6], thirdTemp[6], fourthTemp[6]];
              return [hit, dataRead, indexDecimal, tagBin, locationDecimal, offsetDecimal, blockInhand];
          

       }
       else{

        let firstTemp = read(cacheArray, memoryArray, validityArray, tagsArray, location, memorySize, cacheSize, blockSize);
        let secondTemp = read(cacheArray, memoryArray, validityArray, tagsArray, location + 1, memorySize, cacheSize, blockSize);
        let thirdTemp = read(cacheArray, memoryArray, validityArray, tagsArray, location + 2, memorySize, cacheSize, blockSize);
        let fourthTemp = read(cacheArray, memoryArray, validityArray, tagsArray, location + 3, memorySize, cacheSize, blockSize);
        let fifthTemp = read(cacheArray, memoryArray, validityArray, tagsArray, location + 4, memorySize, cacheSize, blockSize);
        let sixthTemp = read(cacheArray, memoryArray, validityArray, tagsArray, location + 5, memorySize, cacheSize, blockSize);
        let seventhTemp = read(cacheArray, memoryArray, validityArray, tagsArray, location + 6, memorySize, cacheSize, blockSize);
        let eighthTemp = read(cacheArray, memoryArray, validityArray, tagsArray, location + 7, memorySize, cacheSize, blockSize);

            let hit = true;
            if(firstTemp[0] == false || secondTemp[0] == false || thirdTemp[0] == false || fourthTemp[0] == false 
              || fifthTemp[0] == false || sixthTemp[0] == false || seventhTemp[0] == false || eighthTemp[0] == false ){
              hit = false;
            }
          let dataRead = [firstTemp[1], secondTemp[1], thirdTemp[1], fourthTemp[1], fifthTemp[1], sixthTemp[1], seventhTemp[1], eighthTemp[1]];
         let indexDecimal = [firstTemp[2], secondTemp[2], thirdTemp[2], fourthTemp[2], fifthTemp[2], sixthTemp[2], seventhTemp[2], eighthTemp[2]];
          let tagBin = [firstTemp[3], secondTemp[3], thirdTemp[3], fourthTemp[3], fifthTemp[3], sixthTemp[3], seventhTemp[3], eighthTemp[3]];
           let locationDecimal = [firstTemp[4], secondTemp[4], thirdTemp[4], fourthTemp[4], fifthTemp[4], sixthTemp[4], seventhTemp[4], eighthTemp[4]];
          let offsetDecimal = [firstTemp[5], secondTemp[5], thirdTemp[5], fourthTemp[5], fifthTemp[5], sixthTemp[5], seventhTemp[5], eighthTemp[5]];
          let blockInhand = [firstTemp[6], secondTemp[6], thirdTemp[6], fourthTemp[6], fifthTemp[6], sixthTemp[6], seventhTemp[6], eighthTemp[6]];
              return [hit, dataRead, indexDecimal, tagBin, locationDecimal, offsetDecimal, blockInhand];

       }
}




export function read(cacheArray, memoryArray, validityArray, tagsArray, location, memorySize, cacheSize, blockSize ){
  
  // memorySize = 4096;
 
   //cacheSize = 96;
  // blockSize = 32;
  //location = "000001101100";
  let hit = false;
  let executeMissCode = 0;
  let addressBits = Math.log2(memorySize);

  let sets = cacheSize / blockSize;
 
  let block = [];
 
   
  let bitsCountIndex = Math.log2(sets); // Calculate log base 2 of 'sets'
  //let bitsCountOffsets = Math.log2(blockSize/8);
  let bitsCountOffsets = Math.log2(blockSize);


  bitsCountIndex = Math.ceil(bitsCountIndex);
  bitsCountOffsets = Math.ceil(bitsCountOffsets);
  addressBits = Math.ceil(addressBits);
  let bitsCountTag = addressBits - bitsCountIndex - bitsCountOffsets;



  location = decimalToBinary(location, addressBits);

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
      hit = true;
      //return [hitOrMiss, dataRead, locationDecimal];
      return [hit, dataRead, indexDecimal, tagBin, locationDecimal, offsetDecimal, blockInhand];
             
  }
  else{
      executeMissCode = 1;


  }

 }

 else{
  executeMissCode = 1;
  

 }

 if(executeMissCode == 1){
  hit = false;
  let count = missLocationStartDecimal;
  for (let i = 0; i < blockSize; i++) {
      // create block of size BlockSize/8
      block.push(memoryArray[count]);
      count = count +1;
    }
    let dataRead = memoryArray[locationDecimal];
    return [hit, dataRead, indexDecimal, tagBin, locationDecimal, offsetDecimal, block];

 }


  
 
};




export function updateMemoryRead (cacheArrayReal, validityArrayReal, tagsArrayReal, tagBin, indexDecimal, blockReal, typeIs32){
  let cacheArray = deepCopy2d(cacheArrayReal);
  // let cacheArray = JSON.parse(JSON.stringify(cacheArrayReal));
   let validityArray = deepCopy1d(validityArrayReal);
   let tagsArray = deepCopy1d(tagsArrayReal);
   let tagBinNew = deepCopy1d(tagBin);
   let indexDecimalNew = deepCopy1d(indexDecimal);
   let block = deepCopy2d(blockReal);
if(typeIs32){
  for(let i =0 ; i<4 ; i++){

    tagsArray[indexDecimalNew[i]] = tagBinNew[i];
    validityArray[indexDecimalNew[i]] = 1;
    cacheArray[indexDecimalNew[i]] = block[i];


  }



}

else {
  for(let i =0 ; i<8 ; i++){

    tagsArray[indexDecimalNew[i]] = tagBinNew[i];
    validityArray[indexDecimalNew[i]] = 1;
    cacheArray[indexDecimalNew[i]] = block[i];


  }
}


  
  return [cacheArray, validityArray, tagsArray];
   
 };


 export function originalWrite(cacheArray, memoryArray, validityArray, tagsArray, location, dataWrite, memorySize, cacheSize, blockSize, typeIs32){
  if(typeIs32){
        
        
    let firstTemp = write(cacheArray, memoryArray, validityArray, tagsArray, location, dataWrite[0], memorySize, cacheSize, blockSize);
    let secondTemp = write(cacheArray, memoryArray, validityArray, tagsArray, location + 1, dataWrite[1], memorySize, cacheSize, blockSize);
    let thirdTemp = write(cacheArray, memoryArray, validityArray, tagsArray, location + 2, dataWrite[2], memorySize, cacheSize, blockSize);
    let fourthTemp = write(cacheArray, memoryArray, validityArray, tagsArray, location + 3, dataWrite[3], memorySize, cacheSize, blockSize);
    
    let hit = true;
    if(firstTemp[0] == false || secondTemp[0] == false || thirdTemp[0] == false || fourthTemp[0] == false){
      hit = false;
    }
   
   let indexDecimal = [firstTemp[2], secondTemp[2], thirdTemp[2], fourthTemp[2]];
   let tagBin = [firstTemp[3], secondTemp[3], thirdTemp[3], fourthTemp[3]];
   let locationDecimal = [firstTemp[4], secondTemp[4], thirdTemp[4], fourthTemp[4]];
   let offsetDecimal = [firstTemp[5], secondTemp[5], thirdTemp[5], fourthTemp[5]];
   let blockInhand = [firstTemp[6], secondTemp[6], thirdTemp[6], fourthTemp[6]];
      return [hit, dataWrite, indexDecimal, tagBin, locationDecimal, offsetDecimal, blockInhand];
  

}
  else{
    let firstTemp = write(cacheArray, memoryArray, validityArray, tagsArray, location, dataWrite[0], memorySize, cacheSize, blockSize);
    let secondTemp = write(cacheArray, memoryArray, validityArray, tagsArray, location + 1, dataWrite[1], memorySize, cacheSize, blockSize);
    let thirdTemp = write(cacheArray, memoryArray, validityArray, tagsArray, location + 2, dataWrite[2], memorySize, cacheSize, blockSize);
    let fourthTemp = write(cacheArray, memoryArray, validityArray, tagsArray, location + 3, dataWrite[3], memorySize, cacheSize, blockSize);
    let fifthTemp = write(cacheArray, memoryArray, validityArray, tagsArray, location + 4, dataWrite[4], memorySize, cacheSize, blockSize);
    let sixthTemp = write(cacheArray, memoryArray, validityArray, tagsArray, location + 5, dataWrite[5], memorySize, cacheSize, blockSize);
    let seventhTemp = write(cacheArray, memoryArray, validityArray, tagsArray, location + 6, dataWrite[6], memorySize, cacheSize, blockSize);
    let eighthTemp = write(cacheArray, memoryArray, validityArray, tagsArray, location + 7, dataWrite[7], memorySize, cacheSize, blockSize);
    let hit = true;
    if(firstTemp[0] == false || secondTemp[0] == false || thirdTemp[0] == false ||
       fourthTemp[0] == false || fifthTemp[0] == false || sixthTemp[0] == false || seventhTemp[0] == false || eighthTemp[0] == false){
      hit = false;
    }
   
   let indexDecimal = [firstTemp[2], secondTemp[2], thirdTemp[2], fourthTemp[2], fifthTemp[2], sixthTemp[2], seventhTemp[2], eighthTemp[2]];
   let tagBin = [firstTemp[3], secondTemp[3], thirdTemp[3], fourthTemp[3], fifthTemp[3], sixthTemp[3], seventhTemp[3], eighthTemp[3]];
   let locationDecimal = [firstTemp[4], secondTemp[4], thirdTemp[4], fourthTemp[4], fifthTemp[4], sixthTemp[4], seventhTemp[4], eighthTemp[4]];
   let offsetDecimal = [firstTemp[5], secondTemp[5], thirdTemp[5], fourthTemp[5], fifthTemp[5], sixthTemp[5], seventhTemp[5], eighthTemp[5]];
   let blockInhand = [firstTemp[6], secondTemp[6], thirdTemp[6], fourthTemp[6], fifthTemp[6], sixthTemp[6], seventhTemp[6], eighthTemp[6]];
      return [hit, dataWrite, indexDecimal, tagBin, locationDecimal, offsetDecimal, blockInhand];

  }
 }





 export function write (cacheArray, memoryArray, validityArray, tagsArray, location, dataWrite, memorySize, cacheSize, blockSize ){
  // memorySize = 4096;
  // cacheSize = 96;
   //blockSize = 32;
  //location = "000001101100";
  let hit = false;
  let executeMissCode = 0;
  let addressBits = Math.log2(memorySize);

  let sets = cacheSize / blockSize;
 
  let block = [];

  
 let bitsCountIndex = Math.log2(sets); // Calculate log base 2 of 'sets'
 //let bitsCountOffsets = Math.log2(blockSize/8);
 let bitsCountOffsets = Math.log2(blockSize);


 bitsCountIndex = Math.ceil(bitsCountIndex);
 bitsCountOffsets = Math.ceil(bitsCountOffsets);
 addressBits = Math.ceil(addressBits);
 let bitsCountTag = addressBits - bitsCountIndex - bitsCountOffsets;

 location = decimalToBinary(location, addressBits);

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
  
    block = cacheArray[indexDecimal];
     hit = true;
  

     return [hit, dataWrite, indexDecimal, tagBin, locationDecimal, offsetDecimal, block];

 }
 else{
     executeMissCode = 1;
   

 }

}

else{
 executeMissCode = 1;
 

}

if(executeMissCode == 1){
 hit = false;
 let count = missLocationStartDecimal;
 for (let i = 0; i < blockSize; i++) {
     // create block of size BlockSize/8
     block.push(memoryArray[count]);
     count = count +1;
   }
   //let dataRead = memoryArray[locationDecimal];
   return [hit, dataWrite, indexDecimal, tagBin, locationDecimal, offsetDecimal, block];
   

}



};







export function updateMemoryWrite (cacheArrayReal, memoryArrayReal, validityArrayReal, tagsArrayReal, tagBin, locationDecimal, indexDecimal, offsetDecimal, blockReal, dataWrite, typeIs32 ){
  let cacheArray = deepCopy2d(cacheArrayReal);

//let validityArray = JSON.parse(JSON.stringify(validityArrayReal));
let validityArray = deepCopy1d(validityArrayReal);
let tagsArray = deepCopy1d(tagsArrayReal);
let memoryArray = deepCopy1d(memoryArrayReal);
let block = deepCopy2d(blockReal);
let tagBinNew = deepCopy1d(tagBin);
let locationDecimalNew = deepCopy1d(locationDecimal);
let indexDecimalNew = deepCopy1d(indexDecimal);
let offsetDecimalNew = deepCopy1d(offsetDecimal);
let dataWriteNew = deepCopy1d(dataWrite);

if(typeIs32){
  for(let i =0 ; i<4 ; i++){
    tagsArray[indexDecimalNew[i]] = tagBinNew[i];
    validityArray[indexDecimalNew[i]] = 1;
    cacheArray[indexDecimalNew[i]] = block[i];
    
    

  }
  for(let i =0 ; i<4; i++){
    cacheArray[indexDecimalNew[i]][offsetDecimalNew[i]] = dataWriteNew[i];
    
    memoryArray[locationDecimalNew[i]] = dataWriteNew[i];
  }
 

}

else{
  for(let i =0 ; i<8 ; i++){
    tagsArray[indexDecimalNew[i]] = tagBinNew[i];
    validityArray[indexDecimalNew[i]] = 1;
    cacheArray[indexDecimalNew[i]] = block[i];
    
    

  }
  for(let i =0 ; i<8; i++){
    cacheArray[indexDecimalNew[i]][offsetDecimalNew[i]] = dataWriteNew[i];
    
    memoryArray[locationDecimalNew[i]] = dataWriteNew[i];
  }

}





return [cacheArray, memoryArray, validityArray, tagsArray];


};



export function deepCopy2d(array) {
 
let newArr = [];

for (let i = 0; i < array.length; i++) {
  let block = [];
  for(let j =0; j < array[0].length; j++){
    let word = array[i][j];
    block.push(word);
   
  }

  
  newArr.push(block);
  
}

return newArr;

};


export function deepCopy1d(array) {
 
let newArr = [];


for (let i = 0; i < array.length; i++) {
  
  
  newArr.push(array[i]);
  
}

return newArr;

};
