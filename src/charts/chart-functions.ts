import * as d3 from "d3";

const baseYear: number = 1995;
const T: number = 55;
// const I: number = 5;
// const V: number = 2;
// const V: number = 5;
// const S: number = 5;


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
      result += dataProp[techKey][sizeKey][t];
    }
  }

  return Math.round(result * 100) / 100;
}

function sumDataObj1(
  dataProp: number[][][],
  vesselKeys: number[] = [0, 1, 2, 3, 4],
  sizeKeys: number[] = [0, 1, 2, 3, 4]
): number[] {

  const dataArr: number[] = new Array(T).fill(0);

  return dataArr.map((_t, j) => sumPeriod(dataProp, j, vesselKeys, sizeKeys));
}

function sumPeriod2(
  dataProp: number[][][][],
  t: number,
  regionKeys: number[],
  vesselKeys: number[] = [0, 1, 2, 3, 4],
  sizeKeys: number[] = [0, 1, 2, 3, 4]
): number {
  let result: number = 0;

  // Iterate over the specified 'regionKeys'
  for (let r = 0; r < regionKeys.length; r++) {
    let regionKey = regionKeys[r];
    // Iterate over the specified 'sizeKeys'
    for (let i = 0; i < sizeKeys.length; i++) {
      let sizeKey = sizeKeys[i];

      // Iterate over the specified 'vesselKeys'
      for (let v = 0; v < vesselKeys.length; v++) {
        let vesselkey = vesselKeys[v];

        // Add the value at the specified indices to the result
        result += dataProp[regionKey][vesselkey][sizeKey][t];
        
      }
    }
  }
  return Math.round(result * 100) / 100;
}

function sumDataObj2(
  dataProp: number[][][][],
  regionKeys: number[],
  vesselKeys: number[] = [0, 1, 2, 3, 4],
  sizeKeys: number[] = [0, 1, 2, 3, 4]
): number[] {

  const dataArr: number[] = new Array(T).fill(0);

  return dataArr.map((_t, j) => sumPeriod2(dataProp, j, regionKeys, vesselKeys, sizeKeys));
}

function createDataFleetLines(
  FLEET: number[][][][], 
  Z: number[][][][],
  regionKeys: number[],
  vesselKeys: number[] = [0, 1, 2, 3, 4],
  sizeKeys: number[] = [0, 1, 2, 3, 4]
): number[][] {

  const sumFLEET: number[] = sumDataObj2(FLEET, regionKeys, vesselKeys, sizeKeys);
  const sumZ: number[] = sumDataObj2(Z, regionKeys, vesselKeys, sizeKeys);
  
  const dataArr:  number[][] = [];

  for(let t = 0; t < T; t++){
    const year: number = baseYear + t + 1;
    const dataPeriod:  number[] = [year, sumFLEET[t], sumZ[t]];
    dataArr.push(dataPeriod);
  }

  return dataArr;
}

function createDataFleet1Lines(
  dataObj: {  FLEET1: number[][][][], Z1: number[][][][] },
  regionKeys: number[],
  vesselKeys: number[] = [0, 1, 2, 3, 4],
  sizeKeys: number[] = [0, 1, 2, 3, 4]
): number[][] {
  
  const { FLEET1, Z1 } = dataObj

  return createDataFleetLines(FLEET1, Z1, regionKeys, vesselKeys, sizeKeys);
}

function createDataFleet2Lines(
  dataObj: {  FLEET2: number[][][][], Z2: number[][][][] },
  regionKeys: number[],
  vesselKeys: number[] = [0, 1, 2, 3, 4],
  sizeKeys: number[] = [0, 1, 2, 3, 4]
): number[][] {
  
  const { FLEET2, Z2 } = dataObj

  return createDataFleetLines(FLEET2, Z2, regionKeys, vesselKeys, sizeKeys);
}

function createDataFleet3Lines(
  dataObj: {  FLEET3: number[][][][], Z3: number[][][][] },
  regionKeys: number[],
  vesselKeys: number[] = [0, 1, 2, 3, 4],
  sizeKeys: number[] = [0, 1, 2, 3, 4]
): number[][] {
  
  const { FLEET3, Z3 } = dataObj

  return createDataFleetLines(FLEET3, Z3, regionKeys, vesselKeys, sizeKeys);
}

function sumPeriodRegionsByVessel(
  matrix4D: number[][][][], 
  regionKeys: number[],
  vesselKeys: number[] = [0, 1, 2, 3, 4],
  sizeKeys: number[] = [0, 1, 2, 3, 4],
){

  const sumData:  number[][] = vesselKeys.map(v => {
      return sumDataObj2(matrix4D, regionKeys, [v], sizeKeys);
    })

  const transSumData: number[][] = d3.transpose(sumData);

  const dataArr:  number[][] = [];

  for(let t = 0; t < T; t++){
    const year: number = baseYear + t + 1;
    const dataPeriod:  number[] = [year, ...transSumData[t]];
    dataArr.push(dataPeriod);
  }

  return dataArr;
}

function sumPeriodRegionsBySize(
  matrix4D: number[][][][], 
  regionKeys: number[],
  vesselKeys: number[] = [0, 1, 2, 3, 4],
  sizeKeys: number[] = [0, 1, 2, 3, 4],
){

  const sumData:  number[][] = sizeKeys.map(s => {
      return sumDataObj2(matrix4D, regionKeys, vesselKeys, [s]);
    })

  const transSumData: number[][] = d3.transpose(sumData);

  const dataArr:  number[][] = [];

  for(let t = 0; t < T; t++){
    const year: number = baseYear + t + 1;
    const dataPeriod:  number[] = [year, ...transSumData[t]];
    dataArr.push(dataPeriod);
  }

  return dataArr;
}

function createGapBySize(
  dataProp: number[][][],
  vesselKeys: number[] = [0, 1, 2, 3, 4],
  sizeKeys: number[] = [0, 1, 2, 3, 4]
): number[][] {
  
  const sumN: number[][] = [];

  vesselKeys.forEach((tech: number) => {
    sumN.push(sumDataObj1(dataProp, [tech], sizeKeys));
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

export { createDataFleet1Lines, createDataFleet2Lines, createDataFleet3Lines, createGapBySize, sumPeriodRegionsByVessel, sumPeriodRegionsBySize }