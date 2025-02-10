// import * as d3 from 'd3';

// function arrayToMatrix(data: number[], dim: number[]): number[][] {
//   const result: number[][] = [];
//   const [ a ] = dim;
//   const dataArr = [...data];
//   while(dataArr.length > 0){
//     result.push(dataArr.splice(0, a));
//   }
//   return d3.transpose(result);
// }

function arrayToNDMatrix(data: number[], dims: number[]): number[] | number[][] | number[][][] | number[][][][] | number[][][][][] | number[][][][][][] {
  if (dims.length <= 1) return data;

  const [firstDim, ...restDims] = dims;
  const result = [];
  const chunkSize = data.length / firstDim;

  for (let i = 0; i < firstDim; i++) {
    const chunk = data.slice(i * chunkSize, (i + 1) * chunkSize);
    result.push(arrayToNDMatrix(chunk, restDims));
  }

  return result as number[] | number[][] | number[][][] | number[][][][] | number[][][][][] | number[][][][][][];
}

export { arrayToNDMatrix };