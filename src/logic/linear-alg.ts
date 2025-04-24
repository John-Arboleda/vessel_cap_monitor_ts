// import * as d3 from 'd3';

// function arrayTo2DMatrix(data: number[], dim: number[]): number[][] {
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

function arrayTo2DMatrix(data: number[], dims: number[]): number[][] {
  if (dims.length !== 2) {
    throw new Error("Invalid dimensions for 2D matrix");
  }
  const [dim1, dim2] = dims;
  const zerosData: number[] = new Array(data.length - 1).fill(0);
  const result: number[][] = arrayToNDMatrix(zerosData, [dim1, dim2]) as number[][];
  for (let j = 0; j < dim2; j++) {
    for (let i = 0; i < dim1; i++) {
      result[i][j] = data[j * dim1 + i];
    }
  }
  return result;
}

function arrayTo3DMatrix(data: number[], dims: number[]): number[][][] {
  if (dims.length !== 3) {
    throw new Error("Invalid dimensions for 3D matrix");
  }

  const [dim1, dim2, dim3] = dims;
  const zerosData: number[] = new Array(data.length - 1).fill(0);
  const result: number[][][] = arrayToNDMatrix(zerosData, [dim1, dim2, dim3]) as number[][][];

  for (let k = 0; k < dim3; k++) {
    for (let j = 0; j < dim2; j++) {
      for (let i = 0; i < dim1; i++) {
        result[i][j][k] = data[k * dim2 * dim1 + j * dim1 + i];
      }
    }
  }

  return result;
}

function arrayTo4DMatrix(data: number[], dims: number[]): number[][][][] {
  if (dims.length !== 4) {
    throw new Error("Invalid dimensions for 4D matrix");
  }

  new Array(data.length - 1).fill(0);
  const [dim1, dim2, dim3, dim4] = dims;
  const zerosData: number[] = new Array(data.length - 1).fill(0);
  const result: number[][][][] = arrayToNDMatrix(zerosData, [dim1, dim2, dim3, dim4]) as number[][][][];

  for (let l = 0; l < dim4; l++) {
    for (let k = 0; k < dim3; k++) {
      for (let j = 0; j < dim2; j++) {
        for (let i = 0; i < dim1; i++) {
          result[i][j][k][l]  = data[l * dim3 * dim2 * dim1 + k * dim2 * dim1 + j * dim1 + i];
        }
      }
    }
  }

  return result;
}

export { arrayToNDMatrix, arrayTo2DMatrix, arrayTo3DMatrix, arrayTo4DMatrix };