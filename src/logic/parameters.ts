import { arrayToNDMatrix, arrayTo2DMatrix, arrayTo3DMatrix, arrayTo4DMatrix } from "./linear-alg";
import * as d3 from "d3";

async function parseTSV(url: string): Promise<number[][]> {
  const response = await fetch(url);
  const text = await response.text();
  const parsedRows = d3.tsvParseRows(text);
  
  // Convert each string in the parsed rows to a number
  return parsedRows.map((row: string[]) => row.map((cell: string) => parseFloat(cell)))
}


// #Developer parameters

// T<-55 # from 1996 to 2050
// T2<-29 # Historic data, from 1996 to 2025
// F<-6 # Family products: 2701(coal), 2704(coke), 2709(crude oil), 2710(oil product), 2711(LNG), 2711(LPG)
// V<-5 # vessel types: crude tankers, product tanker, LNG, LPG, Bulker
// S<-c(5,5,5,5,4) # Sizes of each type of vessel
// S2<-max(S)
// V2<-c(5,5,1,2,3,4) # vessel per product family
// ind<- 2 # 1, GT. 2, DWT
// N<-19 # World regions
// R<-190 # Routes
// W<-2 # roundtrip
const T: number = 55;
const T2: number = 29;
const F: number = 6;
const V: number = 5;
const S: number[] = [5, 5, 5, 5, 4];
const S2: number = Math.max(...S);
const V2: number[] = [5, 5, 1, 2, 3, 4];
const ind: number = 2;
const N: number = 19;
const R: number = 190;
const W: number = 2;

// SCN<-3 # 1=5%, 2=20%, 3=50%, 4=80%, 5=95%
// year<-3 
// year2<-1
const SCN: number = 3;
const year: number = 3;
const year2: number = 1;


async function getDevParams() {

    // data1<-read.csv("HA.txt",sep = "\t",header = FALSE)
    const data1 = await parseTSV("../../assets/files/HA.txt");
    // data2<-read.csv("HG.txt",sep = "\t",header = FALSE)
    const data2 = await parseTSV("../../assets/files/HG.txt");
    // data3<-read.csv("HD.txt",sep = "\t",header = FALSE)
    const data3 = await parseTSV("../../assets/files/HD.txt");
    // data4<-read.csv("CAP.txt",sep = "\t",header = FALSE)
    const data4 = await parseTSV("../../assets/files/CAP.txt");
    // data5<-read.csv("DDA.txt",sep = "\t",header = FALSE)
    const data5 = await parseTSV("../../assets/files/DDA.txt");
    // data6<-read.csv("O.txt",sep = "\t",header = FALSE)
    const data6 = await parseTSV("../../assets/files/O.txt");
    // data7<-read.csv("D.txt",sep = "\t",header = FALSE)
    const data7 = await parseTSV("../../assets/files/D.txt");
    // data8<-read.csv("LAMB1.txt",sep = "\t",header = FALSE)
    const data8 = await parseTSV("../../assets/files/LAMB1b.txt");
    // data9<-read.csv("U.txt",sep = "\t",header = FALSE)
    const data9 = await parseTSV("../../assets/files/U.txt");
    // data10<-read.csv("LAMB2.txt",sep = "\t",header = FALSE)
    const data10 = await parseTSV("../../assets/files/LAMB2b.txt");
    // data11<-read.csv("MAXD.txt",sep = "\t",header = FALSE)
    const data11 = await parseTSV("../../assets/files/MAXD.txt");
    // data12<-read.csv("AVEG.txt",sep = "\t",header = FALSE)
    const data12 = await parseTSV("../../assets/files/AVEG.txt");
    // data13<-read.csv("DIST.txt",sep = "\t",header = FALSE)
    const data13 = await parseTSV("../../assets/files/DIST.txt");
    // data14<-read.csv("L.txt",sep = "\t",header = FALSE)
    const data14 = await parseTSV("../../assets/files/L.txt");
    // data16<-read.csv("L2.txt",sep = "\t",header = FALSE)
    const data16 = await parseTSV("../../assets/files/L2.txt");
    // data17<-read.csv("FOREC.txt",sep = "\t",header = FALSE)
    const data17 = await parseTSV("../../assets/files/FOREC.txt");
    // data18<-read.csv("factor.txt",sep = "\t",header = FALSE)
    const data18 = await parseTSV("../../assets/files/factor.txt");

    // DDA<-array(data.matrix(data5), dim=c(5,F,T)) # BAU, expected tonnes of fuel f transported by sea in year t.
    const arrayDDA: number[] = d3.transpose(data5).flat(2);
    const DDA: number[][][] = arrayTo3DMatrix(arrayDDA, [5, F, T]) as number[][][];

    // lambda1<-array(data.matrix(data8), dim=c(W,R,6,F))/(100000) # % fuel f transported in that route direction. .### afinar
    const arrayLambda1: number[] = d3.transpose(data8).flat(2);
    const lambda1: number[][][][] = arrayTo4DMatrix(arrayLambda1.map(value => value / 100000), [W, R, 6, F]) as number[][][][];

    // lambda2<-array(data.matrix(data10), dim=c(R,2,S2,V)) # % share in route of vessels type v with size s.### afinar
    const arrayLambda2: number[] = d3.transpose(data10).flat(2);
    const lambda2: number[][][][] = arrayTo4DMatrix(arrayLambda2, [R, 2, S2, V]) as number[][][][];

    // factor<-array(data.matrix(data18), dim=c(8,T)) ### afinar
    const arrayFactor: number[] = d3.transpose(data18).flat(2);
    const factor: number[][] = arrayTo2DMatrix(arrayFactor, [8, T]) as number[][];

    // HF<-array(data.matrix(data1), dim=c(S2,V,T2))# Historia de la flota existente
    const arrayHF: number[] = d3.transpose(data1).flat(2);
    const HF: number[][][] = arrayTo3DMatrix(arrayHF, [S2, V, T2]) as number[][][];

    // HN<-array(data.matrix(data2), dim=c(S2,V,T2))# Historia de la flota nueva
    const arrayHN: number[] = d3.transpose(data2).flat(2);
    const HN: number[][][] = arrayTo3DMatrix(arrayHN, [S2, V, T2]) as number[][][];

    // HD<-array(data.matrix(data3), dim=c(S2,V,T2))# Historia de la flota desintegrada
    const arrayHD: number[] = d3.transpose(data3).flat(2);
    const HD: number[][][] = arrayTo3DMatrix(arrayHD, [S2, V, T2]) as number[][][];

    // FOREC<-array(data.matrix(data17), dim=c(T,S2,V,5)) # barras entre [0.0;1.0]
    const arrayFOREC: number[] = d3.transpose(data17).flat(2);
    const FOREC: number[][][][] = arrayTo4DMatrix(arrayFOREC, [T, S2, V, 5]) as number[][][][];

    // O<-array(data.matrix(data6), dim=c(R,W)) # Origin nodes of route with direction w
    const arrayO: number[] = d3.transpose(data6).flat(2);
    const O: number[][] = arrayTo2DMatrix(arrayO, [R, W]) as number[][];

    // D<-array(data.matrix(data7), dim=c(R,W)) # Destination nodes of route with direction w
    const arrayD: number[] = d3.transpose(data7).flat(2);
    const D: number[][] = arrayTo2DMatrix(arrayD, [R, W]) as number[][];

    // M<-c(2.916,1.206,1.809,0,0)
    const M: number[] = [2.916, 1.206, 1.809, 0, 0];

    // CAP<-array(data.matrix(data4), dim=c(S2,V,2)) # capacity of a vessel type v and size s
    const arrayCAP: number[] = d3.transpose(data4).flat(2);
    const CAP: number[][][] = arrayTo3DMatrix(arrayCAP, [S2, V, 2]) as number[][][];

    // U<-array(data.matrix(data9), dim=c(V,R,2)) # vessel utilization
    const arrayU: number[] = d3.transpose(data9).flat(2);
    const U: number[][][] = arrayTo3DMatrix(arrayU, [V, R, 2]) as number[][][];

    // DIST<-array(data.matrix(data13), dim=c(R,W)) # distance in km traveled in route r direction w
    const arrayDIST: number[] = d3.transpose(data13).flat(2);
    const DIST: number[][] = arrayTo2DMatrix(arrayDIST, [R, W]) as number[][];

    // MAXD<-array(data.matrix(data11), dim=c(S2,V)) # maxima distancia un vessel recorre en un año
    const arrayMAXD: number[] = d3.transpose(data11).flat(2);
    const MAXD: number[][] = arrayTo2DMatrix(arrayMAXD, [S2, V]) as number[][];

    // AVEG<-array(data.matrix(data12), dim=c(S2,V)) # distancia media un vessel recorre en un año
    const arrayAVEG: number[] = d3.transpose(data12).flat(2);
    const AVEG: number[][] = arrayTo2DMatrix(arrayAVEG, [S2, V]) as number[][];

    // L<-array(data.matrix(data14), dim=c(S2,V,T)) # Correccion por programacion y otros
    const arrayL: number[] = d3.transpose(data14).flat(2);
    const L: number[][][] = arrayTo3DMatrix(arrayL, [S2, V, T]) as number[][][];
    // L2<-array(data.matrix(data16), dim=c(S2,V)) # Correccion por programacion y otros
    const arrayL2: number[] = d3.transpose(data16).flat(2);
    const L2: number[][] = arrayTo2DMatrix(arrayL2, [S2, V]) as number[][];

    return {
        T,
        T2,
        N,
        R,
        W,
        F,
        V,
        S,
        S2,
        V2,
        ind,
        SCN,
        DDA,
        lambda1,
        HF,
        HN,
        HD,
        CAP,
        U,
        DIST,
        MAXD,
        AVEG,
        lambda2,
        M,
        O,
        D,
        L,
        L2,
        FOREC,
        factor,
        year,
        year2
    };
}

// #USER CAPACITY PARAM

// agep1<-array(rep(c(28,24,23,22,22),S2), dim=c(S2,V)) # Edad para lifecycle regular flota by size
const arrayAgep1: number[] = new Array(S2).fill([28, 24, 23, 22, 22]).flat(2);
const agep1: number[][] = arrayToNDMatrix(arrayAgep1, [V, S2]) as number[][];

// agep2<-c(10,10,10,10,10) # Edad para lifecicle retrofit flota by size
const agep2: number[] = [10, 10, 10, 10, 10];

// delta<- array(rep(0,V*S2), dim=c(V,S2)) // delta<-array(rep(0,V*S2), dim=c(V,S2)) # % share in route of vessels type v with size s.
const arrayDelta: number[] = new Array(V * S2).fill(0);
const delta: number[][] = arrayToNDMatrix(arrayDelta, [V, S2]) as number[][];

// rang1<- array(rep(0,V*S2*2), dim=c(V,S2,2))
const arrayRang1: number[] = new Array(V * S2 * 2).fill(0);
const rang1: number[][][] = arrayToNDMatrix(arrayRang1, [V, S2, 2]) as number[][][];

// RF<- array(rep(0,V), dim=c(V))
const RF: number[] = new Array(V).fill(0);

// rang2<- array(rep(0,V*2), dim=c(V,2))
const arrayRang2: number[] = new Array(V * 2).fill(0);
const rang2: number[][] = arrayToNDMatrix(arrayRang2, [V, 2]) as number[][];


// #USER DEMAND PARAM

// goal<-8 # Escenario
const goal: number = 8;
// eta<-0 # barra entre [0.0;1.0] # better rotation
const eta: number = 0;
// rho<-0 # barra entre [0.0;1.0] # better vessel utilization
const rho: number = 0;
// beta<-array(rep(0,2*N), dim=c(2,N)) # 1, reduccion exportacion, 2, reduccion importacion
const arrayBeta: number[] = new Array(2 * N).fill(0);
const beta: number[][] = arrayToNDMatrix(arrayBeta, [2, N]) as number[][];
// PARR<-array(rep(0,4*N), dim=c(4,N)) #inicio y final de la politica internal entre [T2+1;T], 2 mayor que 1 y 4 mayor que 3
const arrayPARR: number[] = new Array(4 * N).fill(0);
const PARR: number[][] = arrayToNDMatrix(arrayPARR, [4, N]) as number[][];
// alpha<- 0.5 # effect of economic shock [-1;1]
const alpha: number = 0.5;
// PARN<-c(29,56) #inicio y final del shock [T2+1;T], 2 mayor que 1
const PARN: number[] = [29, 56];
// ONES<-array(rep(0,N), dim=c(N))
const ONES: number[] = new Array(N).fill(0) as number[];

const userParams = {
    goal,
    eta,
    rho,
    alpha,
    PARN,
    beta,
    PARR,
    RF,
    delta,
    agep1,
    agep2,
    rang1,
    rang2,
    ONES
};

export { userParams, getDevParams };