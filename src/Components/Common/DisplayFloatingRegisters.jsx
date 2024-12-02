import React, { useState, useEffect } from "react";
import { Table, Button } from "antd";
import { binaryToDecimal, replaceLastBitsWithZeros, read, updateMemoryRead, write, updateMemoryWrite, decimalToBinary } from "./Context/MemoryAccess";

const columns = [
  {
    title: "Register",
    dataIndex: "registerName",
  },
  {
    title: "Qi",
    dataIndex: "Qi",
  },
  {
    title: "Value",
    dataIndex: "value",
  },
];

const DisplayfloatingRegisters = ({ floatingRegisters }) => {
  const [floatingRegistersTable, setFloatingRegistersTable] = useState([]);

  useEffect(() => {
    // Formatting table values for display, needed in array format
    const temp = [];
    Object.keys(floatingRegisters).forEach((key) => {
      temp.push({
        key: key,
        registerName: key,
        value: floatingRegisters[key]?.value,
        Qi: floatingRegisters[key]?.Qi,
      });
    });
    setFloatingRegistersTable(temp);
  }, [floatingRegisters]);

  const handleButtonTestClick = () => {
    let memorySize = 4096;
    console.log("Button clicked!");
    let memoryArray = [];
    for (let i = 0; i < memorySize; i++) {
      // create block of size BlockSize/8
      memoryArray.push("1011");

    }



    let sets = 96 / 24;
    let cacheTemp = [];
    let block = [];
    let tagsTemp = [];
    let validityTemp = [];
    for (let i = 0; i < 32 / 8; i++) {
      // create block of size BlockSize/8
      block.push(0);
    }
    for (let i = 0; i < sets; i++) {
      // create block of size BlockSize/8
      cacheTemp.push(block);
      tagsTemp.push("empty");
      validityTemp.push(0);
    }


   let returnedInt =  binaryToDecimal("111111111111");
    // console.log(returnedInt);
     let returnedInt2 =  binaryToDecimal("0101");
     let returnedInt3 = decimalToBinary(5,12);

     console.log(returnedInt3);
     
      let returnedString = replaceLastBitsWithZeros("101111111111111",4);
    /*
      memoryArray[2345] = "1111";

      console.log(memoryArray[2345]);
       
      let location = "100100101001";
      let location2 = "100100101000";
      let location3 = "100000101011";
      let location2dec = binaryToDecimal(location2);
      console.log(location2dec);
      let returnedRead =  read(cacheTemp, memoryArray, validityTemp, tagsTemp, location );
      
      let updatedStaff = updateMemoryRead(cacheTemp, validityTemp, tagsTemp, returnedRead[3], returnedRead[2], returnedRead[6]);
      
      cacheTemp = updatedStaff[0];
    
      validityTemp = updatedStaff[1];
      
      tagsTemp = updatedStaff[2];
      let returnedRead2 = read(cacheTemp, memoryArray, validityTemp, tagsTemp, location2 );
      
      let returnedRead3 = read(cacheTemp, memoryArray, validityTemp, tagsTemp, location3 );
      
      let updatedStaff2 = updateMemoryRead(cacheTemp, validityTemp, tagsTemp, returnedRead3[3], returnedRead3[2], returnedRead3[6]);
         
      cacheTemp = updatedStaff2[0];
      
      validityTemp = updatedStaff2[1];
      
      tagsTemp = updatedStaff2[2];
      



      let returnedRead4 =  read(cacheTemp, memoryArray, validityTemp, tagsTemp, location2 );
      
      let updatedStaff5 = updateMemoryRead(cacheTemp, validityTemp, tagsTemp, returnedRead4[3], returnedRead4[2], returnedRead4[6]);
      



      
      cacheTemp = updatedStaff5[0];
    
      validityTemp = updatedStaff5[1];
      tagsTemp = updatedStaff5[2];
      let returnedRead5 =  read(cacheTemp, memoryArray, validityTemp, tagsTemp, location );
      
      let updatedStaff3 = updateMemoryRead(cacheTemp, validityTemp, tagsTemp, returnedRead5[3], returnedRead5[2], returnedRead5[6]);
      
      cacheTemp = updatedStaff3[0];
    
      validityTemp = updatedStaff3[1];
      tagsTemp = updatedStaff3[2];
      let returnedRead6 = read(cacheTemp, memoryArray, validityTemp, tagsTemp, location2 );
      
      
      let writtenFirst = write(cacheTemp, memoryArray, validityTemp, tagsTemp, location2, "0000" );
      console.log(writtenFirst);
      console.log(cacheTemp);
      let updatedStaff4 = updateMemoryWrite(cacheTemp, memoryArray, validityTemp, tagsTemp, writtenFirst[3], writtenFirst[4], writtenFirst[2], writtenFirst[5], writtenFirst[6], writtenFirst[1] );
      console.log(cacheTemp);
      cacheTemp = updatedStaff4[0];
      console.log(cacheTemp);
      console.log(memoryArray[2344]);
      memoryArray = updatedStaff4[1];
      console.log(memoryArray[2344]);
      validityTemp = updatedStaff4[2];
      tagsTemp = updatedStaff4[3];    */
     // console.log(memoryArray[2344]);
   
    
    
  };

  return (
    <>
      <Table
        bordered
        columns={columns}
        dataSource={floatingRegistersTable}
        title={() => <h1 style={{ margin: "0" }}>Floating Registers</h1>}
        pagination={{ position: ["bottomCenter"] }}
      />
      <div style={{ marginTop: "16px", textAlign: "center" }}>
        <Button type="primary" onClick={handleButtonTestClick}>
          Hi,Test Memory in console
        </Button>
      </div>
    </>
  );
};

export default DisplayfloatingRegisters;
