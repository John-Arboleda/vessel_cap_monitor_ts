import { arrayToNDMatrix } from "./linear_alg";


// #Developer parameters

// T<-20 # Period
// R<-16 # Number of Routes
// F<-8 # Product Family
// V<-6 # Ship Types
// W<-4 # Route sections
// S<-3 # Scenarios
// N<-32 # Route nodes
const T: number = 20;
const R: number = 16;
const F: number = 8;
const V: number = 6;
const W: number = 4;
const S: number = 3;
const N: number = 32;



// LB<- array(rep(1,T*R*F*W*V), dim=c(T,R,F,W,V)) # Lower bound number of voyages
const arrayLB: number[] = new Array(T*R*F*W*V).fill(1);
const LB: number[][][][][] = arrayToNDMatrix(arrayLB, [T, R, F, W, V]) as number[][][][][];

// UB<- array(rep(1,T*R*F*W*V), dim=c(T,R,F,W,V)) # Upper bound number of voyages
const arrayUB: number[] = new Array(T*R*F*W*V).fill(1);
const UB: number[][][][][] = arrayToNDMatrix(arrayUB, [T, R, F, W, V]) as number[][][][][];

// C<- array(rep(1,V), dim=c(V)) # Ship capacity of type V
const arrayC: number[] = new Array(V).fill(1);

// DDA<-array(rep(1,F*T), dim=c(F,T)) # Fuel demand in period T
const arrayDDA: number[] = new Array(F*T).fill(1);
const DDA: number[][] = arrayToNDMatrix(arrayDDA, [F, T]) as number[][];

// FLEET<-array(rep(1,F*V*T), dim=c(F,V,T)) # Current fleet of ship type
const arrayFLEET: number[] = new Array(F*V*T).fill(1);
const FLEET: number[][][] = arrayToNDMatrix(arrayFLEET, [F, V, T]) as number[][][];

// U<- array(rep(1,T*R*F*W*V*S), dim=c(T,R,F,W,V,S)) # Mean utilization rate
const arrayU: number[] = new Array(T*R*F*W*V*S).fill(1);
const U: number[][][][][][] = arrayToNDMatrix(arrayU, [T, R, F, W, V, S]) as number[][][][][][];

// lambda<- array(rep(1,T*R*F*W*V), dim=c(T,R,F,W,V)) # Market share
const arrayLambda: number[] = new Array(T*R*F*W*V).fill(1);
const lambda: number[][][][][] = arrayToNDMatrix(arrayLambda, [T, R, F, W, V]) as number[][][][][];

// O<-array(rep(1,R*W), dim=c(R,W)) # Origin
const arrayO: number[] = new Array(R*W).fill(1);
const O: number[][] = arrayToNDMatrix(arrayO, [R, W]) as number[][];

// D<-array(rep(1,R*W), dim=c(R,W)) # Destination
const arrayD: number[] = new Array(R*W).fill(1);
const D: number[][] = arrayToNDMatrix(arrayD, [R, W]) as number[][];

// M<- array(rep(0,T*N*F*V), dim=c(T,N,F,V)) # Vessel storage
const arrayM: number[] = new Array(T*N*F*V).fill(0);
const M: number[][][][] = arrayToNDMatrix(arrayM, [T, N, F, V]) as number[][][][];

const devParams = {
    T: T,
    R: R,
    F: F,
    V: V,
    W: W,
    S: S,
    N: N,
    LB: LB,
    UB: UB,
    C: arrayC,
    DDA: DDA,
    FLEET: FLEET,
    U: U,
    lambda: lambda,
    O: O,
    D: D,
    M: M
};

// #User parameters

// # Percentage of change in the exportation/importation of family products
// rho<-0.2 # barra entre [0.0;0.3] # Slider

// # Enhancement of trip number performed.
// eta<-0.5 # barra entre [0.0;1.0] # Slider

// # Adoption rate of operational strategy
// delta<-c(0.2,0.3,0.5) # 3 barras entre [0.0;1.0], las tres suman 1.0. # Slider

// # Expected percentage demand degrowth of family of products
// alpha<-rep(0,F) # Slider entre 0 y 1 para cada familia
const alpha: number[] = new Array(F).fill(0);

// #inicio y final de la politica internacional para la familia entre [1;T], 2 mayor que 1
// PARN<-array(rep(1,2*F), dim=c(2,F)) # Tabla de 2 * F # Año inicio y año fin
const arrayPARN: number[] = new Array(2*F).fill(1);
const PARN: number[][] = arrayToNDMatrix(arrayPARN, [2, F]) as number[][];

// #inicio y final de la politica internacional para los nodos entre [1;T], 2 mayor que 1 y 4 mayor que 3
// PARR<-array(rep(1,4*N), dim=c(4,N)) # Tabla de 4 * F # Año inicio, año fin de exportaciones, año de inicio y fin de las exportaciones
const arrayPARR: number[] = new Array(4*N).fill(1);
const PARR: number[][] = arrayToNDMatrix(arrayPARR, [4, N]) as number[][]; 

// # 1, reduccion exportacion, 2, reduccion importacion
// beta<-array(c(1:2*N), dim=c(2,N)) # Reducción de cada nodo
const arrayBeta: number[] = new Array(2*N).fill(1);
const beta: number[][] = arrayToNDMatrix(arrayBeta, [2, N]) as number[][];

const userParams = {
    rho: 0.2,
    eta: 0.5,
    delta: [0.2, 0.3, 0.5],
    alpha: alpha,
    PARN: PARN,
    PARR: PARR,
    beta: beta
};

export { devParams, userParams };