import { devParams, userParams } from "./data";
import { arrayToNDMatrix } from "./linear-alg";
import * as d3 from "d3";

async function parseTSV(url: string): Promise<number[][]> {
  const response = await fetch(url);
  const text = await response.text();
  const parsedRows = d3.tsvParseRows(text);
  
  // Convert each string in the parsed rows to a number
  return parsedRows.map((row: string[]) => row.map((cell: string) => parseFloat(cell)))
}



function transformData( dataObj = userParams ){
    
  const { goal, eta, rho, alpha, PARN, beta, PARR, RF, delta } = dataObj;
  
  const { T, T2, N, R, W, F, V, S, S2, V2, ind, SCN, DDA, 
    lambda1, HF, HN, HD, CAP, U, DIST, MAXD, AVEG, lambda2, 
    M, agep1, agep2, O, D, L, L2, FOREC, FOREC2, factor } = devParams;

  //  ############# Pre processing ####################

  //   RATE0<- array(rep(0,T), dim=c(T))
  const arrayRATE0: number[] = new Array(T).fill(0);
  const RATE0: number[] = arrayToNDMatrix(arrayRATE0, [T]) as number[];

  // for (t in 1:T){
  //   RATE0[t]<-min(1,(max(0,t-PARN[1])/max(1,PARN[2]-PARN[1])))
  // }
  for (let t = 0; t < T; t++){
    RATE0[t] = Math.min(1, Math.max(0, t - PARN[0]) / Math.max(1, PARN[1] - PARN[0]));
  }

  // RATE1<- array(rep(0,T*N), dim=c(T,N))
  const arrayRATE1: number[] = new Array(T * N).fill(0);
  const RATE1: number[][] = arrayToNDMatrix(arrayRATE1, [T, N]) as number[][];

  // RATE2<- array(rep(0,T*N), dim=c(T,N))
  const arrayRATE2: number[] = new Array(T * N).fill(0);
  const RATE2: number[][] = arrayToNDMatrix(arrayRATE2, [T, N]) as number[][];

  // for (t in 1:T){
  //   for (n in 1:N){
  //     RATE1[t,n]<-min(1,(max(0,t-PARR[1,n])/max(1,PARR[2,n]-PARR[1,n])))
  //     RATE2[t,n]<-min(1,(max(0,t-PARR[3,n])/max(1,PARR[4,n]-PARR[3,n])))
  //   }}
  for (let t = 0; t < T; t++){
    for (let n = 0; n < N; n++){
      RATE1[t][n] = Math.min(1, Math.max(0, t - PARR[0][n]) / Math.max(1, PARR[1][n] - PARR[0][n]));
      RATE2[t][n] = Math.min(1, Math.max(0, t - PARR[2][n]) / Math.max(1, PARR[3][n] - PARR[2][n]));
    }
  }


  // UB<-array(rep(0,R*W*V*S2), dim=c(R,W,V,S2))
  const arrayUB: number[] = new Array(R * W * V * S2).fill(0);
  const UB: number[][][][] = arrayToNDMatrix(arrayUB, [R, W, V, S2]) as number[][][][];

  // LB<-array(rep(0,R*W*V*S2), dim=c(R,W,V,S2))
  const arrayLB: number[] = new Array(R * W * V * S2).fill(0);
  const LB: number[][][][] = arrayToNDMatrix(arrayLB, [R, W, V, S2]) as number[][][][];

  // for (r in 1:R){
  //   for (v in 1:V){
  //     for (s in 1:S[v]){
  //       for (w in 1:W){
  //         UB[r,w,v,s]<-MAXD[s,v]/DIST[r,w]
  //         LB[r,w,v,s]<-AVEG[s,v]/DIST[r,w]
          
  //       }}}}
  for (let r = 0; r < R; r++){
    for (let v = 0; v < V; v++){
      for (let s = 0; s < S[v]; s++){
        for (let w = 0; w < W; w++){
          UB[r][w][v][s] = MAXD[s][v] / DIST[r][w];
          LB[r][w][v][s] = AVEG[s][v] / DIST[r][w];
        }
      }
    }
  }

  // lambda1B<-array(rep(1,R*W*F*T), dim=c(R,W,F,T))
  const arrayLambda1B: number[] = new Array(R * W * F * T).fill(1);
  const lambda1B: number[][][][] = arrayToNDMatrix(arrayLambda1B, [R, W, F, T]) as number[][][][];

  // TOTAL<-array(rep(1,T), dim=c(T))
  const arrayTOTAL: number[] = new Array(T).fill(1);
  const TOTAL: number[] = arrayToNDMatrix(arrayTOTAL, [T]) as number[];

  // for (t in 1:T){
  //   for (r in 1:R){
  //     for (w in 1:W){
  //       for (f in 1:F){
          
  //         lambda1B[r,w,f,t]<-lambda1[r,w,f]*min(factor[O[r,w],goal,f,t],max((1-beta[1,O[r,w]]*RATE1[t,O[r,w]]),(1-beta[2,D[r,w]]*RATE2[t,D[r,w]]))) 
  //         TOTAL[t]<-TOTAL[t]+lambda1B[r,w,f,t]
          
  //       }}}}
  for (let t = 0; t < T; t++){
    for (let r = 0; r < R; r++){
      for (let w = 0; w < W; w++){
        for (let f = 0; f < F; f++){
          lambda1B[r][w][f][t] = lambda1[r][w][f] * Math.min(factor[O[r][w]][goal][f][t], Math.max(1 - beta[0][O[r][w]] * RATE1[t][O[r][w]], 1 - beta[1][D[r][w]] * RATE2[t][D[r][w]]));
          TOTAL[t] += lambda1B[r][w][f][t];
        }
      }
    }
  }

  // ############# Variable ####################

  // Q<-array(rep(0,R*W*F*T), dim=c(R,W,F,T))
  const arrayQ: number[] = new Array(R * W * F * T).fill(0);
  const Q: number[][][][] = arrayToNDMatrix(arrayQ, [R, W, F, T]) as number[][][][];

  // Y<-array(rep(1,R*W*V*S2*T), dim=c(R,W,V,S2,T))
  const arrayY: number[] = new Array(R * W * V * S2 * T).fill(1);
  const Y: number[][][][][] = arrayToNDMatrix(arrayY, [R, W, V, S2, T]) as number[][][][][];

  // TRIP<-array(rep(0,R*W*F*V*S2), dim=c(R,W,V,S2))
  const arrayTRIP: number[] = new Array(R * W * F * V * S2).fill(0);
  const TRIP: number[][][][] = arrayToNDMatrix(arrayTRIP, [R, W, V, S2]) as number[][][][];

  // Q2<-array(rep(0,V*S2*T), dim=c(V,S2,T))
  const arrayQ2: number[] = new Array(V * S2 * T).fill(0);
  const Q2: number[][][] = arrayToNDMatrix(arrayQ2, [V, S2, T]) as number[][][];

  // for (r in 1:R){
  //   for (w in 1:W){
  //     for (t in 1:T){
  //       for (f in 1:F){
          
  //         Q[r,w,f,t]<-(10^6)*DDA[SCN,f,t]*(1+alpha*RATE0[t])*min(factor[O[r,w],goal,f,t],(1-beta[2,O[r,w]]*RATE1[t,O[r,w]])) *(lambda1B[r,w,f,t]/TOTAL[t])
          
  //       }}}}
  for (let r = 0; r < R; r++){
    for (let w = 0; w < W; w++){
      for (let t = 0; t < T; t++){
        for (let f = 0; f < F; f++){
          Q[r][w][f][t] = Math.pow(10, 6) * DDA[SCN][f][t] * (1 + alpha * RATE0[t]) * Math.min(factor[O[r][w]][goal][f][t], (1 - beta[1][O[r][w]] * RATE1[t][O[r][w]])) * (lambda1B[r][w][f][t] / TOTAL[t]);
        }
      }
    }
  }

  // for (r in 1:R){
  //   for (w in 1:W){
  //     for (v in 1:V){
  //       for (s in 1:S[v]){
          
  //         TRIP[r,w,v,s]<-(eta*UB[r,w,v,s]+(1-eta)*LB[r,w,v,s])*(1-rho)
          
  //         for (t in 1:T){
            
  //           if(t<=T2){Y[r,w,v,s,t]<-CAP[s,v,ind]*U[v,r,1]*TRIP[r,w,v,s]}
  //           else{
              
  //             Y[r,w,v,s,t]<-Y[r,w,v,s,t]+CAP[s,v,ind]*((1-delta[s,v])*U[v,r,1]+delta[s,v]*U[v,r,2])*TRIP[r,w,v,s]
  //           }
            
  //         }}}}}
  for (let r = 0; r < R; r++){
    for (let w = 0; w < W; w++){
      for (let v = 0; v < V; v++){
        for (let s = 0; s < S[v]; s++){
          TRIP[r][w][v][s] = (eta * UB[r][w][v][s] + (1 - eta) * LB[r][w][v][s]) * (1 - rho);
          for (let t = 0; t < T; t++){
            if(t < T2){ // T2 = 29, 28th index in js
              Y[r][w][v][s][t] = CAP[s][v][ind] * U[v][r][0] * TRIP[r][w][v][s];
            } else {
              Y[r][w][v][s][t] = Y[r][w][v][s][t] + CAP[s][v][ind] * ((1 - delta[s][v]) * U[v][r][0] + delta[s][v] * U[v][r][1]) * TRIP[r][w][v][s];
            }
          }
        }
      }
    }
  }


  // X<-array(rep(0,R*V*S2*T), dim=c(R,V,S2,T))
  const arrayX: number[] = new Array(R * V * S2 * T).fill(0);
  const X: number[][][][] = arrayToNDMatrix(arrayX, [R, V, S2, T]) as number[][][][];

  // X2<-array(rep(0,R*V*S2*T), dim=c(R,V,S2,T))
  const arrayX2: number[] = new Array(R * V * S2 * T).fill(0);
  const X2: number[][][][] = arrayToNDMatrix(arrayX2, [R, V, S2, T]) as number[][][][];

  // for (v in 1:V){
  //   for (s in 1:S[v]){
  //     for (t in 1:T){
  //       for (r in 1:R){
  //         for (f in 1:F){
            
  //           if(v==V2[f]){ 
  //             X[r,v,s,t]<-X[r,v,s,t]+ceiling(((1-delta[s,v])*lambda2[r,s,v]+delta[s,v])*max(Q[r,1,f,t]/Y[r,1,v,s,t],Q[r,2,f,t]/Y[r,2,v,s,t]))
              
  //           }
            
  //         }}}}}
  for (let v = 0; v < V; v++){
    for (let s = 0; s < S[v]; s++){
      for (let t = 0; t < T; t++){
        for (let r = 0; r < R; r++){
          for (let f = 0; f < F; f++){
            if(v === V2[f]){
              X[r][v][s][t] = X[r][v][s][t] + Math.ceil(((1 - delta[s][v]) * lambda2[r][s][v] + delta[s][v]) * Math.max(Q[r][0][f][t] / Y[r][0][v][s][t], Q[r][1][f][t] / Y[r][1][v][s][t]));
            }
          }
        }
      }
    }
  }

  // Z<-array(rep(0,V*S2*T), dim=c(V,S2,T))
  const arrayZ: number[] = new Array(V * S2 * T).fill(0);
  const Z: number[][][] = arrayToNDMatrix(arrayZ, [V, S2, T]) as number[][][];

  // Z2<-array(rep(0,V*S2*T), dim=c(V,S2,T))
  const arrayZ2: number[] = new Array(V * S2 * T).fill(0);
  const Z2: number[][][] = arrayToNDMatrix(arrayZ2, [V, S2, T]) as number[][][];

  // Z3<-array(rep(0,V*S2*T), dim=c(V,S2,T))
  const arrayZ3: number[] = new Array(V * S2 * T).fill(0);
  const Z3: number[][][] = arrayToNDMatrix(arrayZ3, [V, S2, T]) as number[][][];

  // for (v in 1:V){
  //   for (s in 1:S[v]){
  //     for (t in 1:T){
  //       for (r in 1:R){
  //         X2[r,v,s,t]<- ceiling(X[r,v,s,t]*(1+(M[O[r,1],v,s]/100)))
  //         Z[v,s,t]<-Z[v,s,t]+X2[r,v,s,t]
          
  //         for (f in 1:F){
  //           if(v==V2[f]){ 
              
  //             for (w in 1:W){
  //               Q2[v,s,t]<-Q2[v,s,t]+Q[r,w,f,t]*((1-delta[s,v])*lambda2[r,s,v]+delta[s,v])
  //             }}}}
        
  //     }}}

  // for (v in 1:V){
  //   for (s in 1:S[v]){
  //     for (t in 1:T){
        
  //       Z[v,s,t]<-ceiling(Z[v,s,t]*L[s,v,t])
        
        
  //     }}}
  for (let v = 0; v < V; v++){
    for (let s = 0; s < S[v]; s++){
      for (let t = 0; t < T; t++){
        for (let r = 0; r < R; r++){
          X2[r][v][s][t] = Math.ceil(X[r][v][s][t] * (1 + M[O[r][0]][v][s] / 100));
          Z[v][s][t] += X2[r][v][s][t];
          for (let f = 0; f < F; f++){
            if(v === V2[f]){
              for (let w = 0; w < W; w++){
                Q2[v][s][t] += Q[r][w][f][t] * ((1 - delta[s][v]) * lambda2[r][s][v] + delta[s][v]);
              }
            }
          }
        }
      }
    }
  }


  // PORC<-array(rep(0,R*V*T), dim=c(R,V,T))
  const arrayPORC: number[] = new Array(R * V * T).fill(0);
  const PORC: number[][][] = arrayToNDMatrix(arrayPORC, [R, V, T]) as number[][][];

  // for(t in 1:T){
  //   for(r in 1:R){
  //     for(v in 1:V){  
  //       for (f in 1:F){
  //         if(v==V2[f]){ 
  //           PORC[r,v,t] <-PORC[r,v,t]+ ((lambda1B[r,1,f,t]+lambda1B[r,2,f,t])/TOTAL[t])
  //         }}}}}
  for (let t = 0; t < T; t++){
    for (let r = 0; r < R; r++){
      for (let v = 0; v < V; v++){
        for (let f = 0; f < F; f++){
          if(v === V2[f]){
            PORC[r][v][t] += (lambda1B[r][0][f][t] + lambda1B[r][1][f][t]) / TOTAL[t];
          }
        }
      }
    }
  }

  // UTIL<-array(rep(0,V*S2*T), dim=c(V,S2,T))
  const arrayUTIL: number[] = new Array(V * S2 * T).fill(0);
  const UTIL: number[][][] = arrayToNDMatrix(arrayUTIL, [V, S2, T]) as number[][][];

  // for(t in 1:T){ 
  //   for(v in 1:V){   
  //     for (s in 1:S[v]){
  //       UTIL[v,s,t]<-UTIL[v,s,t] + ((1-delta[s,v])*U[v,r,1]+delta[s,v]*U[v,r,2])*PORC[r,v,t]
  //     }}}
  for (let t = 0; t < T; t++){
    for (let v = 0; v < V; v++){
      for (let s = 0; s < S[v]; s++){
        UTIL[v][s][t] += ((1 - delta[s][v]) * U[v][0][0] + delta[s][v] * U[v][0][1]) * PORC[0][v][t];
      }
    }
  }

  // FLEET<- array(rep(0,V*S2*T), dim=c(V,S2,T))
  const arrayFLEET: number[] = new Array(V * S2 * T).fill(0);
  const FLEET: number[][][] = arrayToNDMatrix(arrayFLEET, [V, S2, T]) as number[][][];

  // FLEET2<- array(rep(0,V*S2*T), dim=c(V,S2,T))
  const arrayFLEET2: number[] = new Array(V * S2 * T).fill(0);
  const FLEET2: number[][][] = arrayToNDMatrix(arrayFLEET2, [V, S2, T]) as number[][][];

  // NEW<- array(rep(0,V*S2*T), dim=c(V,S2,T))
  const arrayNEW: number[] = new Array(V * S2 * T).fill(0);
  const NEW: number[][][] = arrayToNDMatrix(arrayNEW, [V, S2, T]) as number[][][];

  // DEM<- array(rep(0,V*S2*T), dim=c(V,S2,T))
  const arrayDEM: number[] = new Array(V * S2 * T).fill(0);
  const DEM: number[][][] = arrayToNDMatrix(arrayDEM, [V, S2, T]) as number[][][];

  // FIT<- array(rep(0,V*S2*T), dim=c(V,S2,T))
  const arrayFIT: number[] = new Array(V * S2 * T).fill(0);
  const FIT: number[][][] = arrayToNDMatrix(arrayFIT, [V, S2, T]) as number[][][];

  // OLD<- array(rep(0,V*S2*T), dim=c(V,S2,T))
  const arrayOLD: number[] = new Array(V * S2 * T).fill(0);
  const OLD: number[][][] = arrayToNDMatrix(arrayOLD, [V, S2, T]) as number[][][];

  // GAP<-array(rep(0,V*S2*T), dim=c(V,S2,T))
  const arrayGAP: number[] = new Array(V * S2 * T).fill(0);
  const GAP: number[][][] = arrayToNDMatrix(arrayGAP, [V, S2, T]) as number[][][];

  // GAP2<-array(rep(0,V*S2*T), dim=c(V,S2,T))
  const arrayGAP2: number[] = new Array(V * S2 * T).fill(0);
  const GAP2: number[][][] = arrayToNDMatrix(arrayGAP2, [V, S2, T]) as number[][][];

  // Q3<-array(rep(0,R*V*S2*T), dim=c(R,V,S2,T))
  const arrayQ3: number[] = new Array(R * V * S2 * T).fill(0);
  const Q3: number[][][][] = arrayToNDMatrix(arrayQ3, [R, V, S2, T]) as number[][][][];

  // for(v in 1:V){
  //   for(s in 1:S[v]){
  //     for(t in 1:T){
        
  //       for(f in 1:F){
  //         if(v==V2[f]){ 
  //           Q3[r,v,s,t]<-Q3[r,v,s,t]+Q[r,1,f,t]+Q[r,2,f,t]
            
  //         }}
        
  //       if(t>=(T2+1)){ 
          
  //         if(t-agep1[s]>=1){
  //           OLD[v,s,t]<-NEW[v,s,t-agep1[s]]-FIT[v,s,t-agep2[s]]
  //         }
  //         else{
  //           OLD[v,s,t]<-0
  //         }
          
  //         FIT[v,s,t] <- RF[v]*OLD[v,s,t]
  //         DEM[v,s,t] <- OLD[v,s,t]- FIT[v,s,t]
  //         NEW[v,s,t] <- FOREC2[t,s,v,3]
  //         FLEET[v,s,t] <- FLEET[v,s,t-1]+ NEW[v,s,t]-DEM[v,s,t]
          
          
  //       }else{
  //         FLEET[v,s,t]<-HF[s,v,t]
  //         DEM[v,s,t]<-HD[s,v,t]
  //         NEW[v,s,t]<-HN[s,v,t]
  //       }
        
        
  //       FLEET2[v,s,t]<-FLEET[v,s,t]*CAP[s,v,1]*UTIL[v,s,t]
        
  //       Z2[v,s,t]<- Z2[v,s,t]+Q3[r,v,s,t]
        
        
  //       GAP[v,s,t]=FLEET[v,s,t]-Z[v,s,t]
  //       GAP2[v,s,t]=FLEET2[v,s,t]-Z2[v,s,t]
        
  //     }}}
  for (let v = 0; v < V; v++){
    for (let s = 0; s < S[v]; s++){
      for (let t = 0; t < T; t++){
        for (let f = 0; f < F; f++){
          if(v === V2[f]){
            Q3[0][v][s][t] = Q3[0][v][s][t] + Q[0][0][f][t] + Q[0][1][f][t];
          }
        }
        if(t > (T2 + 1)){ // T2 = 29, 28th index in js
          if(t - agep1[s] > 1){
            OLD[v][s][t] = NEW[v][s][t - agep1[s]] - FIT[v][s][t - agep2[s]];
          } else {
            OLD[v][s][t] = 0;
          }
          FIT[v][s][t] = RF[v] * OLD[v][s][t];
          DEM[v][s][t] = OLD[v][s][t] - FIT[v][s][t];
          NEW[v][s][t] = FOREC2[t][s][v][2];
          FLEET[v][s][t] = FLEET[v][s][t - 1] + NEW[v][s][t] - DEM[v][s][t];
        } else {
          FLEET[v][s][t] = HF[s][v][t];
          DEM[v][s][t] = HD[s][v][t];
          NEW[v][s][t] = HN[s][v][t];
        }
        FLEET2[v][s][t] = FLEET[v][s][t] * CAP[s][v][0] * UTIL[v][s][t];
        Z2[v][s][t] = Z2[v][s][t] + Q3[0][v][s][t];
        GAP[v][s][t] = FLEET[v][s][t] - Z[v][s][t];
        GAP2[v][s][t] = FLEET2[v][s][t] - Z2[v][s][t];
      }
    }
  }

// ############Graph 1######################################
// #FLEET[v,s,t] vs Z[v,s,t] # Eje X es t, v y s son filtros. Lineas

// ############Graph 2######################################
// #GAP1[v,s,t] # Eje X es t, v y s son filtros. Barras acumuladas, cada color es v

// ############Graph 3######################################
// #X2[r,v,s,t] # Eje X es t, r, v y s son filtros. Barras acumuladas, cada color es v

// ############Graph 4######################################
// #FLEET2[v,s,t] vs Z2[v,s,t] # Eje X es t, v y s son filtros. Lineas

// ############Graph 5######################################
// #GAP2[v,s,t] # Eje X es t, v y s son filtros. Barras acumuladas, cada color es v

// ############Graph 6######################################
// # Q3[r,v,s,t] # Eje X es t, v y s son filtros. Barras acumuladas, cada color es v

  const resultObj = {
    FLEET: FLEET,
    Z: Z,
    GAP: GAP,
    X2: X2,
    FLEET2: FLEET2,
    Z2: Z2,
    GAP2: GAP2,
    Q3: Q3,
  }

  return resultObj;
}

export { transformData };