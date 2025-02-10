import { devParams, userParams } from "./data";
import { arrayToNDMatrix } from "./linear_alg";



function transformData( dataObj = userParams ){
    
  const { rho, eta, delta, alpha, PARN, PARR, beta } = dataObj;
  
  const { T, R, F, V, W, S, N, LB, UB, C, DDA, FLEET, U, lambda, O, D, M } = devParams;

  // Y<- array(rep(1,T*R*F*W*V), dim=c(T,R,F,W,V))
  const arrayY: number[] = new Array(T*R*F*W*V).fill(1);
  const Y: number[][][][][] = arrayToNDMatrix(arrayY, [T, R, F, W, V]) as number[][][][][];

  // Y2<- array(rep(1,T*R*F*W*V*S), dim=c(T,R,F,W,V,S))
  const arrayY2: number[] = new Array(T*R*F*W*V*S).fill(1);
  const Y2: number[][][][][][] = arrayToNDMatrix(arrayY2, [T, R, F, W, V, S]) as number[][][][][][];

  // TRIP<- array(rep(1,T*R*F*W*V), dim=c(T,R,F,W,V))
  const arrayTRIP: number[] = new Array(T*R*F*W*V).fill(1);
  const TRIP: number[][][][][] = arrayToNDMatrix(arrayTRIP, [T, R, F, W, V]) as number[][][][][];

  // for (t in 1:T){
  //   for (r in 1:R){
  //     for (f in 1:F){
  //       for (v in 1:V){
  //         for (w in 1:W){

  //           TRIP[t,r,f,w,v]<-((1-eta)*LB[t,r,f,w,v]+eta*UB[t,r,f,w,v])*(1-rho)
  
  //           for (s in 1:S){
  //             Y2[t,r,f,w,v,s]<-C[v]*TRIP[t,r,f,w,v]*U[t,r,f,w,v,s]
  //             Y[t,r,f,w,v]<-Y[t,r,f,w,v]+C[v]*TRIP[t,r,f,w,v]*delta[s]*U[t,r,f,w,v,s]}
  //         }}}}}

  for (let t = 0; t < T; t++){
    for (let r = 0; r < R; r++){
      for (let f = 0; f < F; f++){
        for (let v = 0; v < V; v++){
          for (let w = 0; w < W; w++){
            TRIP[t][r][f][w][v] = ((1-eta) * LB[t][r][f][w][v] + eta * UB[t][r][f][w][v]) * (1-rho);

            for (let s = 0; s < S; s++){
              Y2[t][r][f][w][v][s] = C[v] * TRIP[t][r][f][w][v] * U[t][r][f][w][v][s];
              Y[t][r][f][w][v] = Y[t][r][f][w][v] + C[v] * TRIP[t][r][f][w][v] * delta[s] * U[t][r][f][w][v][s];
            }
          }
        }
      }
    }
  }

  // XB<-array(rep(1,T*R*F*W*V), dim=c(T,R,F,W,V))
  const arrayXB: number[] = new Array(T*R*F*W*V).fill(1);
  const XB: number[][][][][] = arrayToNDMatrix(arrayXB, [T, R, F, W, V]) as number[][][][][];

  // for (t in 1:T){
  //   for (f in 1:F){
  //     for (v in 1:V){
  //       for (r in 1:R){
  //         for (w in 1:W){
  //            XB[t,r,f,w,v]<-(DDA[f,t]*lambda[t,r,f,w,v])/(C[v]*TRIP[t,r,f,w,v]*U[t,r,f,w,v,1])
  
  //           }}}}}

  for (let t = 0; t < T; t++){
    for (let f = 0; f < F; f++){
      for (let v = 0; v < V; v++){
        for (let r = 0; r < R; r++){
          for (let w = 0; w < W; w++){
            XB[t][r][f][w][v] = (DDA[f][t] * lambda[t][r][f][w][v]) / (C[v] * TRIP[t][r][f][w][v] * U[t][r][f][w][v][0]);
          }
        }
      }
    }
  }

  // XB2<-array(rep(1,F*V*T), dim=c(F,V,T))
  const arrayXB2: number[] = new Array(F*V*T).fill(1);
  const XB2: number[][][] = arrayToNDMatrix(arrayXB2, [F, V, T]) as number[][][];

  // for (t in 1:T){
  //   for (f in 1:F){
  //     for (v in 1:V){
  //        for (r in 1:R){
  //          for (w in 1:W){ 
  //            XB2[f,v,t]<-XB2[f,v,t]+XB[t,r,f,w,v]
  //   }}}}}

  for (let t = 0; t < T; t++){
    for (let f = 0; f < F; f++){
      for (let v = 0; v < V; v++){
        for (let r = 0; r < R; r++){
          for (let w = 0; w < W; w++){
            XB2[f][v][t] = XB2[f][v][t] + XB[t][r][f][w][v];
          }
        }
      }
    }
  }

  // L<-array(rep(0,F*V*T), dim=c(F,V,T))
  const arrayL: number[] = new Array(F*V*T).fill(0);
  const L: number[][][] = arrayToNDMatrix(arrayL, [F, V, T]) as number[][][];

  //   for (t in 1:T){
  //     for (f in 1:F){
  //        for (v in 1:V){
  //          L[f,v,t]<-FLEET[f,v,t]/XB2[f,v,t]
  //    }}}

  for (let t = 0; t < T; t++){
    for (let f = 0; f < F; f++){
      for (let v = 0; v < V; v++){
        L[f][v][t] = FLEET[f][v][t] / XB2[f][v][t];
      }
    }
  }

  // Q2<-array(rep(1,T*R*F*W*V), dim=c(T,R,F,W,V))
  const arrayQ2: number[] = new Array(T*R*F*W*V).fill(1);
  const Q2: number[][][][][] = arrayToNDMatrix(arrayQ2, [T, R, F, W, V]) as number[][][][][];

  // for (t in 1:T){
  //   for (f in 1:F){
  //     for (v in 1:V){
  //       for (r in 1:R){
  //         for (w in 1:W){
  //            Q2[t,r,f,w,v]<-DDA[f,t]*lambda[t,r,f,w,v]*L[f,v,t]
  //         }}}}}

  for (let t = 0; t < T; t++){
    for (let f = 0; f < F; f++){
      for (let v = 0; v < V; v++){
        for (let r = 0; r < R; r++){
          for (let w = 0; w < W; w++){
            Q2[t][r][f][w][v] = DDA[f][t] * lambda[t][r][f][w][v] * L[f][v][t];
          }
        }
      }
    }
  }

  // RATE0<- array(rep(0,T*F), dim=c(T,F))
  const arrayRATE0: number[] = new Array(T*F).fill(0);
  const RATE0: number[][] = arrayToNDMatrix(arrayRATE0, [T, F]) as number[][];

  // for (t in 1:T){
  //   for (f in 1:F){
  //       RATE0[t,f]<-min(1,(max(0,t-PARN[1,f])/max(1,PARN[2,f]-PARN[1,f])))
  //   }}

  for (let t = 0; t < T; t++){
    for (let f = 0; f < F; f++){
      RATE0[t][f] = Math.min(1, (Math.max(0, t - PARN[0][f]) / Math.max(1, PARN[1][f] - PARN[0][f])));
    }
  }

  // RATE1<- array(rep(0,T*N), dim=c(T,N))
  const arrayRATE1: number[] = new Array(T*N).fill(0);
  const RATE1: number[][] = arrayToNDMatrix(arrayRATE1, [T, N]) as number[][];

  // RATE2<- array(rep(0,T*N), dim=c(T,N))
  const arrayRATE2: number[] = new Array(T*N).fill(0);
  const RATE2: number[][] = arrayToNDMatrix(arrayRATE2, [T, N]) as number[][];

  // for (t in 1:T){
  //   for (n in 1:N){
  //     RATE1[t,n]<-min(1,(max(0,t-PARR[1,n])/max(1,PARR[2,n]-PARR[1,n])))
  //     RATE2[t,n]<-min(1,(max(0,t-PARR[3,n])/max(1,PARR[4,n]-PARR[3,n])))
  //   }}

  for (let t = 0; t < T; t++){
    for (let n = 0; n < N; n++){
      RATE1[t][n] = Math.min(1, (Math.max(0, t - PARR[0][n]) / Math.max(1, PARR[1][n] - PARR[0][n])));
      RATE2[t][n] = Math.min(1, (Math.max(0, t - PARR[2][n]) / Math.max(1, PARR[3][n] - PARR[2][n])));
    }
  }

  // Q<- array(rep(0,T*R*F*W*V), dim=c(T,R,F,W,V))
  const arrayQ: number[] = new Array(T*R*F*W*V).fill(0);
  const Q: number[][][][][] = arrayToNDMatrix(arrayQ, [T, R, F, W, V]) as number[][][][][];

  // for (t in 1:T){
  //   for (r in 1:R){
  //     for (f in 1:F){
  //       for (v in 1:V){
  //           for (w in 1:W){
  //             Q[t,r,f,w,v]<-DDA[f,t]*lambda[t,r,f,w,v]*L[f,v,t]*
  //                      min(
  //                          1-alpha[f]^RATE0[t,f],
  //                          1-max(
  //                                beta[1,O[r,w]]^RATE1[t,O[r,w]],
  //                                beta[2,D[r,w]]^RATE2[t,D[r,w]]
  //                                )
  //                          )
  //             }}}}}

  for (let t = 0; t < T; t++){
    for (let r = 0; r < R; r++){
      for (let f = 0; f < F; f++){
        for (let v = 0; v < V; v++){
          for (let w = 0; w < W; w++){
            Q[t][r][f][w][v] = DDA[f][t] * lambda[t][r][f][w][v] * L[f][v][t] * 
                Math.min(
                  1 - alpha[f]**RATE0[t][f], 
                  1 - Math.max(
                      beta[0][O[r][w]]**RATE1[t][O[r][w]],
                      beta[1][D[r][w]]**RATE2[t][D[r][w]]
                    )
                  );
          }
        }
      }
    }
  }

  // X<- array(rep(0,T*R*F*V), dim=c(T,R,F,V))
  const arrayX: number[] = new Array(T*R*F*V).fill(0);
  const X: number[][][][] = arrayToNDMatrix(arrayX, [T, R, F, V]) as number[][][][];

  // X2<- array(rep(0,T*R*F*V*S), dim=c(T,R,F,V,S))
  const arrayX2: number[] = new Array(T*R*F*V*S).fill(0);
  const X2: number[][][][][] = arrayToNDMatrix(arrayX2, [T, R, F, V, S]) as number[][][][][];

//   for (t in 1:T){
//     for (r in 1:R){
//        for (f in 1:F){
//           for (v in 1:V){

//             temp1<-Q[t,r,f,1,v]/Y[t,r,f,1,v]
//             temp2<-Q[t,r,f,2,v]/Y[t,r,f,2,v]

//             if(temp1>=temp2){X[t,r,f,v]= temp1}else{X[t,r,f,v]= temp2}

//             for (s in 1:S){
            
//                 temp3<-Q[t,r,f,1,v]/Y2[t,r,f,1,v,s]
//                 temp4<-Q[t,r,f,2,v]/Y2[t,r,f,2,v,s]
    
//                 if(temp3>=temp4){X2[t,r,f,v,s]= temp3}else{X2[t,r,f,v,s]= temp4}
    
//             }

// }}}}

  for (let t = 0; t < T; t++){
    for (let r = 0; r < R; r++){
      for (let f = 0; f < F; f++){
        for (let v = 0; v < V; v++){

          const temp1 = Q[t][r][f][0][v] / Y[t][r][f][0][v];
          const temp2 = Q[t][r][f][1][v] / Y[t][r][f][1][v];

          X[t][r][f][v] = temp1 >= temp2 ? temp1 : temp2;

          for (let s = 0; s < S; s++){

            const temp3 = Q[t][r][f][0][v] / Y2[t][r][f][0][v][s];
            const temp4 = Q[t][r][f][1][v] / Y2[t][r][f][1][v][s];

            X2[t][r][f][v][s] = temp3 >= temp4 ? temp3 : temp4;
          }
        }
      }
    }
  }

  
  // Z<- array(rep(0,T*F*V), dim=c(F,V,T))
  const arrayZ: number[] = new Array(T*F*V).fill(0);
  const Z: number[][][] = arrayToNDMatrix(arrayZ, [F, V, T]) as number[][][];

  // Z2<- array(rep(0,T*F*V*S), dim=c(F,V,T,S))
  const arrayZ2: number[] = new Array(T*F*V*S).fill(0);
  const Z2: number[][][][] = arrayToNDMatrix(arrayZ2, [F, V, T, S]) as number[][][][];

//   for (t in 1:T){
//     for (v in 1:V){
//         for (f in 1:F){
//             for (r in 1:R){
                
//                 Z[f,v,t]<-Z[f,v,t]+X[t,r,f,v]
                
//             }
        
//             for (n in 1:N){
    
//                 Z[f,v,t]<-Z[f,v,t]+M[t,n,f,v]*min(1-alpha[f]^RATE0[t,f],1-beta[1,n]^RATE1[t,n])
    
//             }

//             for (s in 1:S){
//               for (r in 1:R){
    
//                 Z2[f,v,t,s]<-Z2[f,v,t,s]+X2[t,r,f,v,s]
//               }

//               for (n in 1:N){
    
//                 Z2[f,v,t,s]<-Z2[f,v,t,s]+M[t,n,f,v]*min(1-alpha[f]^RATE0[t,f],1-beta[1,n]^RATE1[t,n])
    
//               }
//         }
//     }
// }
// }

  for (let t = 0; t < T; t++){
    for (let v = 0; v < V; v++){
      for (let f = 0; f < F; f++){
        for (let r = 0; r < R; r++){
          Z[f][v][t] = Z[f][v][t] + X[t][r][f][v];
        }

        for (let n = 0; n < N; n++){
          Z[f][v][t] = Z[f][v][t] + M[t][n][f][v] * Math.min(1 - alpha[f]**RATE0[t][f], 1 - beta[0][n]**RATE1[t][n]);
        }

        for (let s = 0; s < S; s++){
          for (let r = 0; r < R; r++){
            Z2[f][v][t][s] = Z2[f][v][t][s] + X2[t][r][f][v][s];
          }

          for (let n = 0; n < N; n++){
            Z2[f][v][t][s] = Z2[f][v][t][s] + M[t][n][f][v] * Math.min(1 - alpha[f]**RATE0[t][f], 1 - beta[0][n]**RATE1[t][n]);
          }
        }
      }
    }
  }

  // Q3<- array(rep(1,T*R*F*W*V*S), dim=c(T,R,F,W,V,S))
  const arrayQ3: number[] = new Array(T*R*F*W*V*S).fill(1);
  const Q3: number[][][][][][] = arrayToNDMatrix(arrayQ3, [T, R, F, W, V, S]) as number[][][][][][];

  // for (t in 1:T){
  //   for (r in 1:R){
  //     for (f in 1:F){
  //       for (v in 1:V){
  //         for (w in 1:W){
  //           for (s in 1:S){
  
  //             Q3[t,r,f,w,v,s]<-X2[t,r,f,v,s]*Y2[t,r,f,w,v,s]
  
  //             }
  //         }
  //       }
  //     }}}

  for (let t = 0; t < T; t++){
    for (let r = 0; r < R; r++){
      for (let f = 0; f < F; f++){
        for (let v = 0; v < V; v++){
          for (let w = 0; w < W; w++){
            for (let s = 0; s < S; s++){
              Q3[t][r][f][w][v][s] = X2[t][r][f][v][s] * Y2[t][r][f][w][v][s];
            }
          }
        }
      }
    }
  }

  const resultObj = {
    Z: Z,
    Z2: Z2,
    FLEET: FLEET,
    Q: Q,
    Q2: Q2,
    Q3: Q3,
  }

  return resultObj;
}

export { transformData };