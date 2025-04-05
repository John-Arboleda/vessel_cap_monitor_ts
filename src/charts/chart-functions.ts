import * as d3 from "d3";

// import { defaultValues } from "../data";


// interface CO2Obj {
//   SAVED1: number[];  
//   SAVED2: number[];  
//   CO2SAVED: number[];
// }

const baseYear: number = 1996;
const T: number = 55;
const I: number = 5;
// const V: number = 2;
const V: number = 5;
const S: number = 5;


// function dataSavedCO2(dataObj: {  SAVED1: number[], SAVED2: number[], CO2SAVED: number[] }): number[][]{
  
//   const { SAVED1, SAVED2, CO2SAVED } = dataObj
  
//   const dataArr:  number[][] = [];

//   for(let t = 0; t < T; t++){
//     const year: number = baseYear + t + 1;
//     const dataPeriod:  number[] = [year, SAVED1[t], SAVED2[t], CO2SAVED[t]]
//     dataArr.push(dataPeriod);
//   }

//   return dataArr;
// }

function sumPeriod(
  dataProp: number[][][],
  t: number,
  vesselKeys: number[] = [0, 1, 2, 3, 4],
  sizeKeys: number[] = [0, 1, 2, 3, 4]
): number {
  let result: number = 0;

  // Iterate over the specified 'sizeKeys'
  for (let i = 0; i < sizeKeys.length; i++) {
    let sizeKey = sizeKeys[i];

    // Iterate over the specified 'vesselKeys'
    for (let v = 0; v < vesselKeys.length; v++) {
      let techKey = vesselKeys[v];
      // Add the value at the specified indices to the result
      result += dataProp[techKey][sizeKey][t];
    }
  }

  return result;
}

function sumDataObj(
  dataProp: number[][][],
  vesselKeys: number[] = [0, 1, 2, 3, 4],
  sizeKeys: number[] = [0, 1, 2, 3, 4]
): number[] {

  const dataArr: number[] = new Array(T).fill(0);

  return dataArr.map((_t, j) => sumPeriod(dataProp, j, vesselKeys, sizeKeys));
}

// function createDataAreaEmis(
//   dataObj: {  WTTX: number[][][], TTWX: number[][][] },
//   vesselKeys: number[] = [0, 1, 2, 3, 4],
//   sizeKeys: number[] = [0, 1]
// ): number[][] {
  
//   const { WTTX, TTWX } = dataObj

//   const sumWTTX: number[] = sumDataObj(WTTX, vesselKeys, sizeKeys);
//   const sumTTWX: number[] = sumDataObj(TTWX, vesselKeys, sizeKeys);
  
//   const dataArr:  number[][] = [];

//   for(let t = 0; t < T; t++){
//     const year: number = baseYear + t + 1;
//     const dataPeriod:  number[] = [year, sumWTTX[t], sumTTWX[t]];
//     dataArr.push(dataPeriod);
//   }

//   return dataArr;
// }


function createDataFleet1Lines(
  dataObj: {  FLEET: number[][][], Z: number[][][] },
  vesselKeys: number[] = [0, 1, 2, 3, 4],
  sizeKeys: number[] = [0, 1, 2, 3, 4]
): number[][] {
  
  const { FLEET, Z } = dataObj

  const sumFLEET: number[] = sumDataObj(FLEET, vesselKeys, sizeKeys);
  const sumZ: number[] = sumDataObj(Z, vesselKeys, sizeKeys);
  
  const dataArr:  number[][] = [];

  for(let t = 0; t < T; t++){
    const year: number = baseYear + t + 1;
    const dataPeriod:  number[] = [year, sumFLEET[t], sumZ[t]];
    dataArr.push(dataPeriod);
  }

  return dataArr;
}

function createDataFleet2Lines(
  dataObj: {  FLEET2: number[][][], Z2: number[][][] },
  vesselKeys: number[] = [0, 1, 2, 3, 4],
  sizeKeys: number[] = [0, 1, 2, 3, 4]
): number[][] {
  
  const { FLEET2, Z2 } = dataObj

  const sumFLEET: number[] = sumDataObj(FLEET2, vesselKeys, sizeKeys);
  const sumZ: number[] = sumDataObj(Z2, vesselKeys, sizeKeys);
  
  const dataArr:  number[][] = [];

  for(let t = 0; t < T; t++){
    const year: number = baseYear + t + 1;
    const dataPeriod:  number[] = [year, sumFLEET[t], sumZ[t]];
    dataArr.push(dataPeriod);
  }

  return dataArr;
}

function createDataTotalCost(
  dataObj: {  TCX: number[][][], VFCX: number[][][], VACX: number[][][] },
  vesselKeys: number[] = [0, 1, 2, 3, 4],
  sizeKeys: number[] = [0, 1]
): number[][] {
  
  const { TCX, VFCX, VACX } = dataObj

  const sumTCX: number[] = sumDataObj(TCX, vesselKeys, sizeKeys);
  const sumVFCX: number[] = sumDataObj(VFCX, vesselKeys, sizeKeys);
  const sumVACX: number[] = sumDataObj(VACX, vesselKeys, sizeKeys);
  
  const dataArr:  number[][] = [];

  for(let t = 0; t < T; t++){
    const year: number = baseYear + t + 1;
    const dataPeriod:  number[] = [year, sumTCX[t] + sumVFCX[t] + sumVACX[t]];
    dataArr.push(dataPeriod);
  }

  return dataArr;
}

function createDataAreaCost(
  dataObj: {  TCX: number[][][], VFCX: number[][][], VACX: number[][][] },
  vesselKeys: number[] = [0, 1, 2, 3, 4],
  sizeKeys: number[] = [0, 1]
): number[][] {
  
  const { TCX, VFCX, VACX } = dataObj

  const sumTCX: number[] = sumDataObj(TCX, vesselKeys, sizeKeys);
  const sumVFCX: number[] = sumDataObj(VFCX, vesselKeys, sizeKeys);
  const sumVACX: number[] = sumDataObj(VACX, vesselKeys, sizeKeys);
  
  const dataArr:  number[][] = [];

  for(let t = 0; t < T; t++){
    const year: number = baseYear + t + 1;
    const dataPeriod:  number[] = [year, sumTCX[t], sumVFCX[t], sumVACX[t]];
    dataArr.push(dataPeriod);
  }

  return dataArr;
}

function costNegObj(
  dataObj: {  TCX: number[][][], VFCX: number[][][], VACX: number[][][] },
  keepNeg: Boolean
){
  const negObj = {
    TCX: filterNeg(dataObj.TCX, keepNeg),
    VFCX: filterNeg(dataObj.VFCX, keepNeg),
    VACX: filterNeg(dataObj.VACX, keepNeg)
  }

  return negObj;
}


function filterNeg(
  dataProp:  number[][][],
  keepNeg: Boolean
){
  return dataProp.map(tech => filterNegTech(tech, keepNeg));
}

function filterNegTech(
  techArr: number[][],
  keepNeg: Boolean
){
  return techArr.map(veh => filterNegVeh(veh, keepNeg));
}

function filterNegVeh(
  vehArr: number[],
  keepNeg: Boolean
){
  return vehArr.map(perValue => (perValue > 0) != keepNeg ? perValue : 0);
}


function createGapBySize(
  dataProp: number[][][],
  vesselKeys: number[] = [0, 1, 2, 3, 4],
  sizeKeys: number[] = [0, 1, 2, 3, 4]
): number[][] {
  
  const sumN: number[][] = [];

  vesselKeys.forEach((tech: number) => {
    sumN.push(sumDataObj(dataProp, [tech], sizeKeys));
  })

  const transSumN = d3.transpose(sumN);
  
  const dataArr:  number[][] = [];

  for(let t = 0; t < T; t++){
    const year: number = baseYear + t + 1;
    const dataPeriod:  number[] = [year, ...transSumN[t]];
    dataArr.push(dataPeriod);
  }

  return dataArr;
}

function dataPropNegative(
  dataProp: number[][][]
): number[][][] {

  //const negProp: number[][][] = [...dataProp];
  const negProp: number[][][] = new Array(I).fill(0).map(() => new Array(V).fill(0).map(() => new Array(T).fill(0)));;

  for(let i = 0; i < I; i++){
    for(let v = 0; v < V; v++){
      for(let t = 0; t < T; t++){
        negProp[i][v][t] = -dataProp[i][v][t];
      }
    }
  }

  return negProp;
}

function maxValueVAxis(table1 : (string|number)[][], table2: (string|number)[][]): number {

  const buyTable = table1.map(removeFirst);
  const sellTable = table2.map(removeFirst);

  const buySellTable = [...buyTable, ...sellTable];

  const arrSumRowValue = buySellTable.map(row => row.reduce((value, acc) => Math.abs(value) + acc), 0);
  const maxValue = Math.ceil((Math.max(...arrSumRowValue) + 5) / 10) * 10;

  return maxValue;
}

function removeFirst(row: (string|number)[]): number[] {

  const [_first, ...rest]: (string | number)[] = row;

  return rest.map(n => Number(n));
}

function createDataQfuel(
  dataProp: number[][],
  _vesselKeys: number[] = [0, 1, 2, 3, 4],
  sizeKeys: number[] = [0, 1]
): number[][]{
  
  const dataArr:  number[][] = [];

  for(let t = 0; t < T; t++){
    const year: number = baseYear + t + 1;
    const row = sizeKeys.map(k => dataProp[k][t]);
    const dataPeriod:  number[] = [year, ...row];
    dataArr.push(dataPeriod);
  }
  
  return dataArr;
}

export { createDataFleet1Lines, createDataFleet2Lines, createGapBySize, 
  dataPropNegative, maxValueVAxis, createDataAreaCost, createDataQfuel, 
  createDataTotalCost, costNegObj }