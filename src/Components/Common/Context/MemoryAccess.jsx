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





export function read(cacheArray, memoryArray, validityArray, tagsArray, location ){
  let memorySize = 4096;

  let cacheSize = 96;
  let blockSize = 32;
  //location = "000001101100";
  let hitOrMiss = "still not knowing hit or miss";
  let executeMissCode = 0;
  let addressBits = Math.log2(memorySize);

  let sets = cacheSize / blockSize;
 
  let block = [];
 
   
  let bitsCountIndex = Math.log2(sets); // Calculate log base 2 of 'sets'
  let bitsCountOffsets = Math.log2(blockSize/8);



  bitsCountIndex = Math.ceil(bitsCountIndex);
  bitsCountOffsets = Math.ceil(bitsCountOffsets);
  addressBits = Math.ceil(addressBits);
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




export function updateMemoryRead (cacheArrayReal, validityArrayReal, tagsArrayReal, tagBin, indexDecimal, blockReal ){
  let block = deepCopy1d(blockReal);
  let cacheArray = deepCopy2d(cacheArrayReal);
 // let cacheArray = JSON.parse(JSON.stringify(cacheArrayReal));
  let validityArray = deepCopy1d(validityArrayReal);
  let tagsArray = deepCopy1d(tagsArrayReal);
   

  tagsArray[indexDecimal] = tagBin;
  validityArray[indexDecimal] = 1;
  cacheArray[indexDecimal] = block;

  return [cacheArray, validityArray, tagsArray];
   
 };





 export function write (cacheArray, memoryArray, validityArray, tagsArray, location, dataWrite ){
  let memorySize = 4096;
  let cacheSize = 96;
  let blockSize = 32;
  //location = "000001101100";
  let hitOrMiss = "still not knowing hit or miss";
  let executeMissCode = 0;
  let addressBits = Math.log2(memorySize);

  let sets = cacheSize / blockSize;
 
  let block = [];

  
 let bitsCountIndex = Math.log2(sets); // Calculate log base 2 of 'sets'
 let bitsCountOffsets = Math.log2(blockSize/8);



 bitsCountIndex = Math.ceil(bitsCountIndex);
 bitsCountOffsets = Math.ceil(bitsCountOffsets);
 addressBits = Math.ceil(addressBits);
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
  
    block = cacheArray[indexDecimal];
     hitOrMiss = "congrats, it is a hit";
  

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







export function updateMemoryWrite (cacheArrayReal, memoryArrayReal, validityArrayReal, tagsArrayReal, tagBin, locationDecimal, indexDecimal, offsetDecimal, blockReal, dataWrite ){


let cacheArray = deepCopy2d(cacheArrayReal);

//let validityArray = JSON.parse(JSON.stringify(validityArrayReal));
let validityArray = deepCopy1d(validityArrayReal);
let tagsArray = deepCopy1d(tagsArrayReal);
let memoryArray = deepCopy1d(memoryArrayReal);
let block = deepCopy1d(blockReal);

tagsArray[indexDecimal] = tagBin;
validityArray[indexDecimal] = 1;
cacheArray[indexDecimal] = block;

cacheArray[indexDecimal][offsetDecimal] = dataWrite;

memoryArray[locationDecimal] = dataWrite;


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