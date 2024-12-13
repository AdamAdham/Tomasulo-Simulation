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
}

export function binaryToDecimal(binaryString) {
  // Ensure the input is a valid binary string
  if (!/^[01]+$/.test(binaryString)) {
    throw new Error("Input must be a string containing only '0' and '1'.");
  }
  //console.log("ali");
  // Convert the binary string to a decimal integer
  return parseInt(binaryString, 2);
}

export function replaceLastBitsWithZeros(binaryString, x) {
  // Ensure the input is a valid binary string
  if (!/^[01]+$/.test(binaryString)) {
    throw new Error("Input must be a string containing only '0' and '1'.");
  }

  // Ensure x is not greater than the length of the string
  if (x > binaryString.length) {
    throw new Error(
      "x cannot be greater than the length of the binary string."
    );
  }

  // Replace the last x bits with zeros
  let unchangedPart = binaryString.slice(0, binaryString.length - x);
  let replacedPart = "0".repeat(x);

  let outbot = unchangedPart + replacedPart;

  return outbot;
}

// originalRead heya el function el bene3melaha call men bara lama yeb2a feeh load instruction w betraga3 e7na hit wala miss w el ma3loomat el me7tagenha 3ashan n update el cache w el memory

export function originalRead(
  cacheArray,
  memoryArray,
  validityArray,
  tagsArray,
  location,
  memorySize,
  cacheSize,
  blockSize,
  typeIs32
) {
  // cacheArray dah 2d array feeh el outer size beta3o howa 3adad el blocks aw el sets beto3 el cache
  // w el inner size beta3o howa 3adad el offsets el fel block aw el set
  // memoryArray dah 1d array
  // validityArray dah 1d array kol element feeh ya2ema 0 ya2ema 1 beyshawer 3ala el cache block el mo3ayana ye2ool law etkatab feeha abl keda wala la2
  // tagsArray dah 1d array of strings kol string bet2ool el cache block fel wa2t el 7aly feeha anhy tag
  // yeb2a size el validity array w el tags array howa nafs el outer size beta3 el cache array
  // location deeh betkoon bel decimal bet2ool el starting index beta3 el data el matlooba
  // memorySize el da5la ka parameter deeh bel bytes, heya w el cacheSize w el blockSize
  // typeIs32 deeh law true yeb2a el data el 3ayez y loadha 32 bits gheir keda 64 bits
  if (typeIs32) {
    let firstTemp = read(
      cacheArray,
      memoryArray,
      validityArray,
      tagsArray,
      location,
      memorySize,
      cacheSize,
      blockSize
    );
    let secondTemp = read(
      cacheArray,
      memoryArray,
      validityArray,
      tagsArray,
      location + 1,
      memorySize,
      cacheSize,
      blockSize
    );
    let thirdTemp = read(
      cacheArray,
      memoryArray,
      validityArray,
      tagsArray,
      location + 2,
      memorySize,
      cacheSize,
      blockSize
    );
    let fourthTemp = read(
      cacheArray,
      memoryArray,
      validityArray,
      tagsArray,
      location + 3,
      memorySize,
      cacheSize,
      blockSize
    );

    let hit = true;
    if (
      firstTemp[0] == false ||
      secondTemp[0] == false ||
      thirdTemp[0] == false ||
      fourthTemp[0] == false
    ) {
      hit = false;
    }
    let dataRead = [firstTemp[1], secondTemp[1], thirdTemp[1], fourthTemp[1]];
    let indexDecimal = [
      firstTemp[2],
      secondTemp[2],
      thirdTemp[2],
      fourthTemp[2],
    ];
    let tagBin = [firstTemp[3], secondTemp[3], thirdTemp[3], fourthTemp[3]];
    let locationDecimal = [
      firstTemp[4],
      secondTemp[4],
      thirdTemp[4],
      fourthTemp[4],
    ];
    let offsetDecimal = [
      firstTemp[5],
      secondTemp[5],
      thirdTemp[5],
      fourthTemp[5],
    ];
    let blockInhand = [
      firstTemp[6],
      secondTemp[6],
      thirdTemp[6],
      fourthTemp[6],
    ];
    return [
      hit,
      dataRead,
      indexDecimal,
      tagBin,
      locationDecimal,
      offsetDecimal,
      blockInhand,
    ];
    // law hit b true yeb2a kol el data el howa kan 3ayezha men el memory mawgooda 3ady fel cache
    // law hit b false yeb2a at least one address men el data el matlooba mesh mawgood fel cache
    // dataRead betkoon array of strings w el length beta3 el array ya2ema 4 ya2ema 8 (4 law el data 32 bits) (8 law el data 64 bits)
    // dataRead beykoon feeh el data el matlooba men el memory
    // indexDecimal beykoon array of integers w el length beta3 el array ya2ema 4 ya2ema 8 (4 law el data 32 bits) (8 law el data 64 bits)
    // indexDecimal beykoon el index fel cache ya3ni anhy set aw block el mawgood feeha kol byte men el data el matlooba
    // tagBin beykoon array of strings w el length beta3 el array ya2ema 4 ya2ema 8 (4 law el data 32 bits) (8 law el data 64 bits)
    // tagBin beykoon array of binary strings w kol string bey2ool el tag bits beta3 kol byte men el data el matlooba
    // locationDecimal beykoon array of integers w el length beta3 el array ya2ema 4 ya2ema 8 (4 law el data 32 bits) (8 law el data 64 bits)
    // locationDecimal beykoon el index fel memory el mawgood feeha kol byte men el data el matlooba
    // offsetDecimal beykoon array of integers w el length beta3 el array ya2ema 4 ya2ema 8 (4 law el data 32 bits) (8 law el data 64 bits)
    // offsetDecimal beykoon el offset fel cache block el mo3ayana el mawgood feeha kol byte men el data el matlooba
    // blockInhand beykoon 2d array w kol element fel outer array beykoon block(el howa bardo array) bey2ool l kol data byte men el data el matlooba hane7tag anhy block men el memory w dah 3ashan law el data el matlooba met2asema 3ala aktar men cache block
  } else {
    let firstTemp = read(
      cacheArray,
      memoryArray,
      validityArray,
      tagsArray,
      location,
      memorySize,
      cacheSize,
      blockSize
    );
    let secondTemp = read(
      cacheArray,
      memoryArray,
      validityArray,
      tagsArray,
      location + 1,
      memorySize,
      cacheSize,
      blockSize
    );
    let thirdTemp = read(
      cacheArray,
      memoryArray,
      validityArray,
      tagsArray,
      location + 2,
      memorySize,
      cacheSize,
      blockSize
    );
    let fourthTemp = read(
      cacheArray,
      memoryArray,
      validityArray,
      tagsArray,
      location + 3,
      memorySize,
      cacheSize,
      blockSize
    );
    let fifthTemp = read(
      cacheArray,
      memoryArray,
      validityArray,
      tagsArray,
      location + 4,
      memorySize,
      cacheSize,
      blockSize
    );
    let sixthTemp = read(
      cacheArray,
      memoryArray,
      validityArray,
      tagsArray,
      location + 5,
      memorySize,
      cacheSize,
      blockSize
    );
    let seventhTemp = read(
      cacheArray,
      memoryArray,
      validityArray,
      tagsArray,
      location + 6,
      memorySize,
      cacheSize,
      blockSize
    );
    let eighthTemp = read(
      cacheArray,
      memoryArray,
      validityArray,
      tagsArray,
      location + 7,
      memorySize,
      cacheSize,
      blockSize
    );

    let hit = true;
    if (
      firstTemp[0] == false ||
      secondTemp[0] == false ||
      thirdTemp[0] == false ||
      fourthTemp[0] == false ||
      fifthTemp[0] == false ||
      sixthTemp[0] == false ||
      seventhTemp[0] == false ||
      eighthTemp[0] == false
    ) {
      hit = false;
    }
    let dataRead = [
      firstTemp[1],
      secondTemp[1],
      thirdTemp[1],
      fourthTemp[1],
      fifthTemp[1],
      sixthTemp[1],
      seventhTemp[1],
      eighthTemp[1],
    ];
    let indexDecimal = [
      firstTemp[2],
      secondTemp[2],
      thirdTemp[2],
      fourthTemp[2],
      fifthTemp[2],
      sixthTemp[2],
      seventhTemp[2],
      eighthTemp[2],
    ];
    let tagBin = [
      firstTemp[3],
      secondTemp[3],
      thirdTemp[3],
      fourthTemp[3],
      fifthTemp[3],
      sixthTemp[3],
      seventhTemp[3],
      eighthTemp[3],
    ];
    let locationDecimal = [
      firstTemp[4],
      secondTemp[4],
      thirdTemp[4],
      fourthTemp[4],
      fifthTemp[4],
      sixthTemp[4],
      seventhTemp[4],
      eighthTemp[4],
    ];
    let offsetDecimal = [
      firstTemp[5],
      secondTemp[5],
      thirdTemp[5],
      fourthTemp[5],
      fifthTemp[5],
      sixthTemp[5],
      seventhTemp[5],
      eighthTemp[5],
    ];
    let blockInhand = [
      firstTemp[6],
      secondTemp[6],
      thirdTemp[6],
      fourthTemp[6],
      fifthTemp[6],
      sixthTemp[6],
      seventhTemp[6],
      eighthTemp[6],
    ];
    return [
      hit,
      dataRead,
      indexDecimal,
      tagBin,
      locationDecimal,
      offsetDecimal,
      blockInhand,
    ];
    // law hit b true yeb2a kol el data el howa kan 3ayezha men el memory mawgooda 3ady fel cache
    // law hit b false yeb2a at least one address men el data el matlooba mesh mawgood fel cache
    // dataRead betkoon array of strings w el length beta3 el array ya2ema 4 ya2ema 8 (4 law el data 32 bits) (8 law el data 64 bits)
    // dataRead beykoon feeh el data el matlooba men el memory
    // indexDecimal beykoon array of integers w el length beta3 el array ya2ema 4 ya2ema 8 (4 law el data 32 bits) (8 law el data 64 bits)
    // indexDecimal beykoon el index fel cache ya3ni anhy set aw block el mawgood feeha kol byte men el data el matlooba
    // tagBin beykoon array of strings w el length beta3 el array ya2ema 4 ya2ema 8 (4 law el data 32 bits) (8 law el data 64 bits)
    // tagBin beykoon array of binary strings w kol string bey2ool el tag bits beta3 kol byte men el data el matlooba
    // locationDecimal beykoon array of integers w el length beta3 el array ya2ema 4 ya2ema 8 (4 law el data 32 bits) (8 law el data 64 bits)
    // locationDecimal beykoon el index fel memory el mawgood feeha kol byte men el data el matlooba
    // offsetDecimal beykoon array of integers w el length beta3 el array ya2ema 4 ya2ema 8 (4 law el data 32 bits) (8 law el data 64 bits)
    // offsetDecimal beykoon el offset fel cache block el mo3ayana el mawgood feeha kol byte men el data el matlooba
    // blockInhand beykoon 2d array w kol element fel outer array beykoon block(el howa bardo array) bey2ool l kol data byte men el data el matlooba hane7tag anhy block men el memory w dah 3ashan law el data el matlooba met2asema 3ala aktar men cache block
  }
}

// lama benkoon 3ayzeen ne3mel load ben call el function dee awalan 3ashan ne3raf hit wala miss w law miss el ma3loomat el me7tagenha 3ashan n update el cache w el memory
export function read(
  cacheArray,
  memoryArray,
  validityArray,
  tagsArray,
  location,
  memorySize,
  cacheSize,
  blockSize
) {
  // cacheArray dah 2d array feeh el outer size beta3o howa 3adad el blocks aw el sets beto3 el cache
  // w el inner size beta3o howa 3adad el offsets el fel block aw el set
  // memoryArray dah 1d array
  // validityArray dah 1d array kol element feeh ya2ema 0 ya2ema 1 beyshawer 3ala el cache block el mo3ayana ye2ool law etkatab feeha abl keda wala la2
  // tagsArray dah 1d array of strings kol string bet2ool el cache block fel wa2t el 7aly feeha anhy tag
  // yeb2a size el validity array w el tags array howa nafs el outer size beta3 el cache array
  // location deeh betkoon bel decimal bet2ool el starting index beta3 el data el matlooba
  // memorySize el da5la ka parameter deeh bel bytes, heya w el cacheSize w el blockSize

  let hit = false;
  let executeMissCode = 0;
  // executeMissCode beteb2a b 1 lama n indicate en feeh miss(hane3mel execute le code mo3ayan) f hane7tag negeeb hagat men el memory
  // addressBits homa 3adad el bits beto3 el memory location
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
  let indexBin = location.substring(
    bitsCountTag,
    bitsCountTag + bitsCountIndex
  );
  let offsetBin = location.substring(bitsCountTag + bitsCountIndex);

  let tagDecimal = binaryToDecimal(tagBin);
  let indexDecimal = binaryToDecimal(indexBin);
  let offsetDecimal = binaryToDecimal(offsetBin);
  let locationDecimal = binaryToDecimal(location);

  let missLocationStartBin = replaceLastBitsWithZeros(
    location,
    bitsCountOffsets
  );
  // missLocationStartBin aw missLocationStartDecimal betkoon el starting location el hangeeb meno men el memory law feeh miss
  let missLocationStartDecimal = binaryToDecimal(missLocationStartBin);

  if (validityArray[indexDecimal] == 1) {
    if (tagsArray[indexDecimal] == tagBin) {
      let blockInhand = cacheArray[indexDecimal];
      let dataRead = blockInhand[offsetDecimal];
      hit = true;

      return [
        hit,
        dataRead,
        indexDecimal,
        tagBin,
        locationDecimal,
        offsetDecimal,
        blockInhand,
      ];
      // roo7 lel comments el ta7t el return beta3et originalRead bas el far2 en kol element fel return deeh mesh beykoon array 3ashan el info deeh te5os 1 data byte men el data el matlooba
      // blockInhand hena betkoon 1d array mesh 2d array zay fo2
    } else {
      executeMissCode = 1;
    }
  } else {
    executeMissCode = 1;
  }

  if (executeMissCode == 1) {
    hit = false;
    let count = missLocationStartDecimal;
    for (let i = 0; i < blockSize; i++) {
      // create block of size BlockSize/8
      block.push(memoryArray[count]);
      count = count + 1;
    }
    let dataRead = memoryArray[locationDecimal];
    return [
      hit,
      dataRead,
      indexDecimal,
      tagBin,
      locationDecimal,
      offsetDecimal,
      block,
    ];
  }
}

// el function deeh bene3mel call lama benkoon 3ayzeen n update el cache ba3d ma ne3mel read l data mo3ayana
export function updateMemoryRead(
  cacheArrayReal,
  validityArrayReal,
  tagsArrayReal,
  tagBin,
  indexDecimal,
  blockReal,
  typeIs32
) {
  let cacheArray = deepCopy2d(cacheArrayReal);
  // let cacheArray = JSON.parse(JSON.stringify(cacheArrayReal));
  let validityArray = deepCopy1d(validityArrayReal);
  let tagsArray = deepCopy1d(tagsArrayReal);
  let tagBinNew = deepCopy1d(tagBin);
  let indexDecimalNew = deepCopy1d(indexDecimal);
  let block = deepCopy2d(blockReal);
  if (typeIs32) {
    for (let i = 0; i < 4; i++) {
      tagsArray[indexDecimalNew[i]] = tagBinNew[i];
      validityArray[indexDecimalNew[i]] = 1;
      cacheArray[indexDecimalNew[i]] = block[i];
    }
  } else {
    for (let i = 0; i < 8; i++) {
      tagsArray[indexDecimalNew[i]] = tagBinNew[i];
      validityArray[indexDecimalNew[i]] = 1;
      cacheArray[indexDecimalNew[i]] = block[i];
    }
  }

  return [cacheArray, validityArray, tagsArray];
}

// originalWrite heya el function el bene3melaha call men bara lama yeb2a feeh store instruction w betraga3 e7na hit wala miss w el ma3loomat el me7tagenha 3ashan n update el cache w el memory
export function originalWrite(
  cacheArray,
  memoryArray,
  validityArray,
  tagsArray,
  location,
  dataWrite,
  memorySize,
  cacheSize,
  blockSize,
  typeIs32
) {
  // cacheArray dah 2d array feeh el outer size beta3o howa 3adad el blocks aw el sets beto3 el cache
  // w el inner size beta3o howa 3adad el offsets el fel block aw el set
  // memoryArray dah 1d array
  // validityArray dah 1d array kol element feeh ya2ema 0 ya2ema 1 beyshawer 3ala el cache block el mo3ayana ye2ool law etkatab feeha abl keda wala la2
  // tagsArray dah 1d array of strings kol string bet2ool el cache block fel wa2t el 7aly feeha anhy tag
  // yeb2a size el validity array w el tags array howa nafs el outer size beta3 el cache array
  // location deeh betkoon bel decimal bet2ool el starting index beta3 el data el matloob yetketeb feeha
  // memorySize el da5la ka parameter deeh bel bytes, heya w el cacheSize w el blockSize
  // typeIs32 deeh law true yeb2a el data el 3ayez y storeha 32 bits gheir keda 64 bits
  if (typeIs32) {
    let firstTemp = write(
      cacheArray,
      memoryArray,
      validityArray,
      tagsArray,
      location,
      dataWrite[0],
      memorySize,
      cacheSize,
      blockSize
    );
    let secondTemp = write(
      cacheArray,
      memoryArray,
      validityArray,
      tagsArray,
      location + 1,
      dataWrite[1],
      memorySize,
      cacheSize,
      blockSize
    );
    let thirdTemp = write(
      cacheArray,
      memoryArray,
      validityArray,
      tagsArray,
      location + 2,
      dataWrite[2],
      memorySize,
      cacheSize,
      blockSize
    );
    let fourthTemp = write(
      cacheArray,
      memoryArray,
      validityArray,
      tagsArray,
      location + 3,
      dataWrite[3],
      memorySize,
      cacheSize,
      blockSize
    );

    let hit = true;
    if (
      firstTemp[0] == false ||
      secondTemp[0] == false ||
      thirdTemp[0] == false ||
      fourthTemp[0] == false
    ) {
      hit = false;
    }

    let indexDecimal = [
      firstTemp[2],
      secondTemp[2],
      thirdTemp[2],
      fourthTemp[2],
    ];
    let tagBin = [firstTemp[3], secondTemp[3], thirdTemp[3], fourthTemp[3]];
    let locationDecimal = [
      firstTemp[4],
      secondTemp[4],
      thirdTemp[4],
      fourthTemp[4],
    ];
    let offsetDecimal = [
      firstTemp[5],
      secondTemp[5],
      thirdTemp[5],
      fourthTemp[5],
    ];
    let blockInhand = [
      firstTemp[6],
      secondTemp[6],
      thirdTemp[6],
      fourthTemp[6],
    ];
    return [
      hit,
      dataWrite,
      indexDecimal,
      tagBin,
      locationDecimal,
      offsetDecimal,
      blockInhand,
    ];
    // law hit b true yeb2a kol el data addresses el howa kan 3ayez yekteb feeha fel memory mawgooda 3ady fel cache
    // law hit b false yeb2a at least one address men el data el matloob tetketeb mesh mawgood fel cache

    // dataWrite betkoon array of strings w el length beta3 el array ya2ema 4 ya2ema 8 (4 law el data 32 bits) (8 law el data 64 bits)
    // dataWrite beykoon feeh el data el matloob tetketeb fel memory

    // indexDecimal beykoon array of integers w el length beta3 el array ya2ema 4 ya2ema 8 (4 law el data 32 bits) (8 law el data 64 bits)
    // indexDecimal beykoon el index fel cache ya3ni anhy set aw block el mawgood feeha kol byte men el data el matloob tetketeb

    // tagBin beykoon array of strings w el length beta3 el array ya2ema 4 ya2ema 8 (4 law el data 32 bits) (8 law el data 64 bits)
    // tagBin beykoon array of binary strings w kol string bey2ool el tag bits beta3 kol byte men el data el matloob tetketeb

    // locationDecimal beykoon array of integers w el length beta3 el array ya2ema 4 ya2ema 8 (4 law el data 32 bits) (8 law el data 64 bits)
    // locationDecimal beykoon el index fel memory el mawgood feeha kol byte men el data el matloob tetketeb

    // offsetDecimal beykoon array of integers w el length beta3 el array ya2ema 4 ya2ema 8 (4 law el data 32 bits) (8 law el data 64 bits)
    // offsetDecimal beykoon el offset fel cache block el mo3ayana el mawgood feeha kol byte men el data el matloob tetketeb

    // blockInhand beykoon 2d array w kol element fel outer array beykoon block(el howa bardo array) bey2ool l kol data byte men el data el matlooba hane7tag anhy block men el memory w dah 3ashan law el data el matloob tetketeb met2asema 3ala aktar men cache block
  } else {
    let firstTemp = write(
      cacheArray,
      memoryArray,
      validityArray,
      tagsArray,
      location,
      dataWrite[0],
      memorySize,
      cacheSize,
      blockSize
    );
    let secondTemp = write(
      cacheArray,
      memoryArray,
      validityArray,
      tagsArray,
      location + 1,
      dataWrite[1],
      memorySize,
      cacheSize,
      blockSize
    );
    let thirdTemp = write(
      cacheArray,
      memoryArray,
      validityArray,
      tagsArray,
      location + 2,
      dataWrite[2],
      memorySize,
      cacheSize,
      blockSize
    );
    let fourthTemp = write(
      cacheArray,
      memoryArray,
      validityArray,
      tagsArray,
      location + 3,
      dataWrite[3],
      memorySize,
      cacheSize,
      blockSize
    );
    let fifthTemp = write(
      cacheArray,
      memoryArray,
      validityArray,
      tagsArray,
      location + 4,
      dataWrite[4],
      memorySize,
      cacheSize,
      blockSize
    );
    let sixthTemp = write(
      cacheArray,
      memoryArray,
      validityArray,
      tagsArray,
      location + 5,
      dataWrite[5],
      memorySize,
      cacheSize,
      blockSize
    );
    let seventhTemp = write(
      cacheArray,
      memoryArray,
      validityArray,
      tagsArray,
      location + 6,
      dataWrite[6],
      memorySize,
      cacheSize,
      blockSize
    );
    let eighthTemp = write(
      cacheArray,
      memoryArray,
      validityArray,
      tagsArray,
      location + 7,
      dataWrite[7],
      memorySize,
      cacheSize,
      blockSize
    );
    let hit = true;
    if (
      firstTemp[0] == false ||
      secondTemp[0] == false ||
      thirdTemp[0] == false ||
      fourthTemp[0] == false ||
      fifthTemp[0] == false ||
      sixthTemp[0] == false ||
      seventhTemp[0] == false ||
      eighthTemp[0] == false
    ) {
      hit = false;
    }

    let indexDecimal = [
      firstTemp[2],
      secondTemp[2],
      thirdTemp[2],
      fourthTemp[2],
      fifthTemp[2],
      sixthTemp[2],
      seventhTemp[2],
      eighthTemp[2],
    ];
    let tagBin = [
      firstTemp[3],
      secondTemp[3],
      thirdTemp[3],
      fourthTemp[3],
      fifthTemp[3],
      sixthTemp[3],
      seventhTemp[3],
      eighthTemp[3],
    ];
    let locationDecimal = [
      firstTemp[4],
      secondTemp[4],
      thirdTemp[4],
      fourthTemp[4],
      fifthTemp[4],
      sixthTemp[4],
      seventhTemp[4],
      eighthTemp[4],
    ];
    let offsetDecimal = [
      firstTemp[5],
      secondTemp[5],
      thirdTemp[5],
      fourthTemp[5],
      fifthTemp[5],
      sixthTemp[5],
      seventhTemp[5],
      eighthTemp[5],
    ];
    let blockInhand = [
      firstTemp[6],
      secondTemp[6],
      thirdTemp[6],
      fourthTemp[6],
      fifthTemp[6],
      sixthTemp[6],
      seventhTemp[6],
      eighthTemp[6],
    ];
    return [
      hit,
      dataWrite,
      indexDecimal,
      tagBin,
      locationDecimal,
      offsetDecimal,
      blockInhand,
    ];
    // law hit b true yeb2a kol el data addresses el howa kan 3ayez yekteb feeha fel memory mawgooda 3ady fel cache
    // law hit b false yeb2a at least one address men el data el matloob tetketeb mesh mawgood fel cache
    // dataWrite betkoon array of strings w el length beta3 el array ya2ema 4 ya2ema 8 (4 law el data 32 bits) (8 law el data 64 bits)
    // dataWrite beykoon feeh el data el matloob tetketeb fel memory
    // indexDecimal beykoon array of integers w el length beta3 el array ya2ema 4 ya2ema 8 (4 law el data 32 bits) (8 law el data 64 bits)
    // indexDecimal beykoon el index fel cache ya3ni anhy set aw block el mawgood feeha kol byte men el data el matloob tetketeb
    // tagBin beykoon array of strings w el length beta3 el array ya2ema 4 ya2ema 8 (4 law el data 32 bits) (8 law el data 64 bits)
    // tagBin beykoon array of binary strings w kol string bey2ool el tag bits beta3 kol byte men el data el matloob tetketeb
    // locationDecimal beykoon array of integers w el length beta3 el array ya2ema 4 ya2ema 8 (4 law el data 32 bits) (8 law el data 64 bits)
    // locationDecimal beykoon el index fel memory el mawgood feeha kol byte men el data el matloob tetketeb
    // offsetDecimal beykoon array of integers w el length beta3 el array ya2ema 4 ya2ema 8 (4 law el data 32 bits) (8 law el data 64 bits)
    // offsetDecimal beykoon el offset fel cache block el mo3ayana el mawgood feeha kol byte men el data el matloob tetketeb
    // blockInhand beykoon 2d array w kol element fel outer array beykoon block(el howa bardo array) bey2ool l kol data byte men el data el matlooba hane7tag anhy block men el memory w dah 3ashan law el data el matloob tetketeb met2asema 3ala aktar men cache block
  }
}

// lama benkoon 3ayzeen ne3mel store ben call el function dee awalan 3ashan ne3raf hit wala miss w law miss el ma3loomat el me7tagenha 3ashan n update el cache w el memory
export function write(
  cacheArray,
  memoryArray,
  validityArray,
  tagsArray,
  location,
  dataWrite,
  memorySize,
  cacheSize,
  blockSize
) {
  // cacheArray dah 2d array feeh el outer size beta3o howa 3adad el blocks aw el sets beto3 el cache
  // w el inner size beta3o howa 3adad el offsets el fel block aw el set
  // memoryArray dah 1d array
  // validityArray dah 1d array kol element feeh ya2ema 0 ya2ema 1 beyshawer 3ala el cache block el mo3ayana ye2ool law etkatab feeha abl keda wala la2
  // tagsArray dah 1d array of strings kol string bet2ool el cache block fel wa2t el 7aly feeha anhy tag
  // yeb2a size el validity array w el tags array howa nafs el outer size beta3 el cache array
  // location deeh betkoon bel decimal bet2ool el starting index beta3 el data el matloob yetketeb feeha
  // memorySize el da5la ka parameter deeh bel bytes, heya w el cacheSize w el blockSize

  let hit = false;
  // executeMissCode beteb2a b 1 lama n indicate en feeh miss(hane3mel execute le code mo3ayan) f hane7tag negeeb hagat men el memory
  let executeMissCode = 0;

  // addressBits homa 3adad el bits beto3 el memory location
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
  let indexBin = location.substring(
    bitsCountTag,
    bitsCountTag + bitsCountIndex
  );
  let offsetBin = location.substring(bitsCountTag + bitsCountIndex);

  let tagDecimal = binaryToDecimal(tagBin);
  let indexDecimal = binaryToDecimal(indexBin);
  let offsetDecimal = binaryToDecimal(offsetBin);
  let locationDecimal = binaryToDecimal(location);

  let missLocationStartBin = replaceLastBitsWithZeros(
    location,
    bitsCountOffsets
  );
  // missLocationStartBin aw missLocationStartDecimal betkoon el starting location el hangeeb meno men el memory law feeh miss
  let missLocationStartDecimal = binaryToDecimal(missLocationStartBin);

  if (validityArray[indexDecimal] == 1) {
    if (tagsArray[indexDecimal] == tagBin) {
      block = cacheArray[indexDecimal];
      hit = true;

      return [
        hit,
        dataWrite,
        indexDecimal,
        tagBin,
        locationDecimal,
        offsetDecimal,
        block,
      ];
    } else {
      executeMissCode = 1;
    }
  } else {
    executeMissCode = 1;
  }

  if (executeMissCode == 1) {
    hit = false;
    let count = missLocationStartDecimal;
    for (let i = 0; i < blockSize; i++) {
      // create block of size BlockSize/8
      block.push(memoryArray[count]);
      count = count + 1;
    }
    //let dataRead = memoryArray[locationDecimal];
    return [
      hit,
      dataWrite,
      indexDecimal,
      tagBin,
      locationDecimal,
      offsetDecimal,
      block,
    ];
  }
}

// el function deeh bene3mel call lama benkoon 3ayzeen n update el cache w el memory 3ashan nsama3 el write lel data el mo3ayana
export function updateMemoryWrite(
  cacheArrayReal,
  memoryArrayReal,
  validityArrayReal,
  tagsArrayReal,
  tagBin,
  locationDecimal,
  indexDecimal,
  offsetDecimal,
  blockReal,
  dataWrite,
  typeIs32
) {
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
  console.log(dataWrite);

  let dataWriteNew = deepCopy1d(dataWrite);

  if (typeIs32) {
    for (let i = 0; i < 4; i++) {
      tagsArray[indexDecimalNew[i]] = tagBinNew[i];
      validityArray[indexDecimalNew[i]] = 1;
      cacheArray[indexDecimalNew[i]] = block[i];
    }
    for (let i = 0; i < 4; i++) {
      cacheArray[indexDecimalNew[i]][offsetDecimalNew[i]] = dataWriteNew[i];

      memoryArray[locationDecimalNew[i]] = dataWriteNew[i];
    }
  } else {
    for (let i = 0; i < 8; i++) {
      tagsArray[indexDecimalNew[i]] = tagBinNew[i];
      validityArray[indexDecimalNew[i]] = 1;
      cacheArray[indexDecimalNew[i]] = block[i];
    }
    for (let i = 0; i < 8; i++) {
      cacheArray[indexDecimalNew[i]][offsetDecimalNew[i]] = dataWriteNew[i];

      memoryArray[locationDecimalNew[i]] = dataWriteNew[i];
    }
  }

  return [cacheArray, memoryArray, validityArray, tagsArray];
}

export function deepCopy2d(array) {
  let newArr = [];

  for (let i = 0; i < array.length; i++) {
    let block = [];
    for (let j = 0; j < array[0].length; j++) {
      let word = array[i][j];
      block.push(word);
    }

    newArr.push(block);
  }

  return newArr;
}

export function deepCopy1d(array) {
  let newArr = [];

  for (let i = 0; i < array.length; i++) {
    newArr.push(array[i]);
  }

  return newArr;
}
