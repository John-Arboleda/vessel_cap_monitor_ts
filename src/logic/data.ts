import { arrayToNDMatrix } from "./linear-alg";


// #Developer parameters

// T<-55 # from 1996 to 2050
// T2<-29 # Historic data, from 1996 to 2025
// N<-19 # World regions
// R<-190 # Routes
// W<-2 # roundtrip
// F<-6 # Family products: 2701(coal), 2704(coke), 2709(crude oil), 2710(oil product), 2711(LNG), 2711(LPG)
const T: number = 55;
const T2: number = 29;
const N: number = 19;
const R: number = 190;
const W: number = 2;
const F: number = 6;

// V<-5 # vessel types: crude tankers, product tanker, LNG, LPG, Bulker
// S<-c(5,5,5,5,4) # Sizes of each type of vessel
// S2<-max(S)
// V2<-c(5,5,1,2,3,4) # vessel per product family
// ind<- 2 # 1, GT. 2, DWT
// SCN<-5 # 1=5%, 2=20%, 3=50%, 4=80%, 5=95%
const V: number = 5;
const S: number[] = [5, 5, 5, 5, 4];
const S2: number = Math.max(...S);
const V2: number[] = [5, 5, 1, 2, 3, 4];
const ind: number = 2;
const SCN: number = 5;

// DDA<-array(data.matrix(data5), dim=c(5,F,T)) # BAU, expected tonnes of fuel f transported by sea in year t.
const arrayDDA: number[] = new Array(5 * F * T).fill(0);
const DDA: number[][][] = arrayToNDMatrix(arrayDDA, [5, F, T]) as number[][][];

// lambda1<-array(data.matrix(data8), dim=c(R,W,F))/(10000) # % fuel f transported in that route direction. .### afinar
const arrayLambda1: number[] = new Array(R * W * F).fill(0);
const lambda1: number[][][] = arrayToNDMatrix(arrayLambda1, [R, W, F]) as number[][][];

// HF<-array(data.matrix(data1), dim=c(S2,V,T2))# Historia de la flota existente
const arrayHF: number[] = new Array(S2 * V * T2).fill(0);
const HF: number[][][] = arrayToNDMatrix(arrayHF, [S2, V, T2]) as number[][][];

// HN<-array(data.matrix(data2), dim=c(S2,V,T2))# Historia de la flota nueva
const arrayHN: number[] = new Array(S2 * V * T2).fill(0);
const HN: number[][][] = arrayToNDMatrix(arrayHN, [S2, V, T2]) as number[][][];

// HD<-array(data.matrix(data3), dim=c(S2,V,T2))# Historia de la flota desintegrada
const arrayHD: number[] = new Array(S2 * V * T2).fill(0);
const HD: number[][][] = arrayToNDMatrix(arrayHD, [S2, V, T2]) as number[][][];

// CAP<-array(data.matrix(data4), dim=c(S2,V,2)) # capacity of a vessel type v and size s
const arrayCAP: number[] = new Array(S2 * V * 2).fill(0);
const CAP: number[][][] = arrayToNDMatrix(arrayCAP, [S2, V, 2]) as number[][][];

// U<-array(data.matrix(data9), dim=c(V,R,2)) # vessel utilization
const arrayU: number[] = new Array(V * R * 2).fill(0);
const U: number[][][] = arrayToNDMatrix(arrayU, [V, R, 2]) as number[][][];

// DIST<-array(data.matrix(data13), dim=c(R,W)) # distance in km traveled in route r direction w
const arrayDIST: number[] = new Array(R * W).fill(0);
const DIST: number[][] = arrayToNDMatrix(arrayDIST, [R, W]) as number[][];

// MAXD<-array(data.matrix(data11), dim=c(S2,V)) # maxima distancia un vessel recorre en un año
const arrayMAXD: number[] = new Array(S2 * V).fill(0);
const MAXD: number[][] = arrayToNDMatrix(arrayMAXD, [S2, V]) as number[][];

// AVEG<-array(data.matrix(data12), dim=c(S2,V)) # distancia media un vessel recorre en un año
const arrayAVEG: number[] = new Array(S2 * V).fill(0);
const AVEG: number[][] = arrayToNDMatrix(arrayAVEG, [S2, V]) as number[][];

// lambda2<-array(rep(0,R*S2*V), dim=c(R,S2,V)) # % share in route of vessels type v with size s.### afinar
const arrayLambda2: number[] = new Array(R * S2 * V).fill(0);
const lambda2: number[][][] = arrayToNDMatrix(arrayLambda2, [R, S2, V]) as number[][][];

// M<-array(rep(0,N*V*S2), dim=c(N,V,S2))### afinar
const arrayM: number[] = new Array(N * V * S2).fill(0);
const M: number[][][] = arrayToNDMatrix(arrayM, [N, V, S2]) as number[][][];

// agep1<-c(28,24,23,22,22) # Edad para desintegrar flota by size
const agep1: number[] = [28, 24, 23, 22, 22];

// agep2<-ceiling(agep1/2) # Edad para desintegrar flota by sizeO<-array(data.matrix(data6), dim=c(R,W)) # Origin nodes of route with direction w
const agep2: number[] = agep1.map((a: number) => Math.ceil(a / 2));

// O<-array(data.matrix(data6), dim=c(R,W)) # Origin nodes of route with direction w
const arrayO: number[] = new Array(R * W).fill(0);
const O: number[][] = arrayToNDMatrix(arrayO, [R, W]) as number[][];

// D<-array(data.matrix(data7), dim=c(R,W)) # Destination nodes of route with direction w
const arrayD: number[] = new Array(R * W).fill(0);
const D: number[][] = arrayToNDMatrix(arrayD, [R, W]) as number[][];

// L<-array(data.matrix(data14), dim=c(S2,V,T)) # Correccion por programacion y otros
const arrayL: number[] = new Array(S2 * V * T).fill(0);
const L: number[][][] = arrayToNDMatrix(arrayL, [S2, V, T]) as number[][][];

// L2<-array(data.matrix(data16), dim=c(S2,V)) # Correccion por programacion y otros
const arrayL2: number[] = new Array(S2 * V).fill(0);
const L2: number[][] = arrayToNDMatrix(arrayL2, [S2, V]) as number[][];

// FOREC<-array(data.matrix(data15), dim=c(T,S2,V,5)) # barras entre [0.0;1.0]
const arrayFOREC: number[] = new Array(T * S2 * V * 5).fill(0);
const FOREC: number[][][][] = arrayToNDMatrix(arrayFOREC, [T, S2, V, 5]) as number[][][][];

// FOREC2<-array(rep(0,S2*V*5), dim=c(T,S2,V,5)) # barras entre [0.0;1.0] ### afinar
const arrayFOREC2: number[] = new Array(T * S2 * V * 5).fill(0);
const FOREC2: number[][][][] = arrayToNDMatrix(arrayFOREC2, [T, S2, V, 5]) as number[][][][];

// factor<-array(rep(1,N*5*F*T), dim=c(N,5,F,T)) ### afinar
const arrayFactor: number[] = new Array(N * 5 * F * T).fill(1);
const factor: number[][][][] = arrayToNDMatrix(arrayFactor, [N, 5, F, T]) as number[][][][];

const devParams = {
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
    agep1,
    agep2,
    O,
    D,
    L,
    L2,
    FOREC,
    FOREC2,
    factor,
};

// #User parameters

// goal<-1
const goal: number = 1;

// eta<-0 # barra entre [0.0;1.0]
const eta: number = 0;

// rho<-0 # barra entre [0.0;0.3]
const rho: number = 0;

// alpha<- 0.5 # effect of economic shock [-1;1]
const alpha: number = 0.5;

// PARN<-c(29,56) #inicio y final del shock [T2+1;T], 2 mayor que 1
const PARN: number[] = [29, 56];

// beta<-array(rep(0,2*N), dim=c(2,N)) # 1, reduccion exportacion, 2, reduccion importacion
const arrayBeta: number[] = new Array(2 * N).fill(0);
const beta: number[][] = arrayToNDMatrix(arrayBeta, [2, N]) as number[][];

// PARR<-array(rep(0,4*N), dim=c(4,N)) #inicio y final de la politica internal entre [T2+1;T], 2 mayor que 1 y 4 mayor que 3
const arrayPARR: number[] = new Array(4 * N).fill(0);
const PARR: number[][] = arrayToNDMatrix(arrayPARR, [4, N]) as number[][];

// RF<-c(0,0,0,0,0)# barras entre [0.0;1.0]
const RF: number[] = [0, 0, 0, 0, 0];

// delta<-array(rep(0,V*S2), dim=c(V,S2)) # % share in route of vessels type v with size s.
const arrayDelta: number[] = new Array(V * S2).fill(0);
const delta: number[][] = arrayToNDMatrix(arrayDelta, [V, S2]) as number[][];

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
};

export { devParams, userParams };