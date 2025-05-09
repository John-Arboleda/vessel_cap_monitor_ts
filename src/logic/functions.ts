import { userParams, getDevParams } from "./parameters";
import { arrayToNDMatrix } from "./linear-alg";




async function transformData( dataObj = userParams ){
    
  const { goal, eta, rho, beta, PARR,  delta, rang1, rang2, ONES, RF, agep1, agep2 } = dataObj;

  // console.log("agep1", agep1);
  const devParams = await getDevParams();
  
  const { T, T2, N, R, W, F, V, S, S2, V2, ind, SCN, DDA, lambda1, HF, HN, HD, CAP, U,  
    DIST, MAXD, AVEG, lambda2, M, O, D, L, L2, FOREC, factor, year, year2, init1, CORR1, CORR2 } = devParams;

  //  ############# Pre processing ####################

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
  //   }
  // }
  for (let t = 0; t < T; t++){
    for (let n = 0; n < N; n++){
      RATE1[t][n] = Math.min(1, Math.max(0, t - PARR[0][n] + 1) / Math.max(1, PARR[1][n] - PARR[0][n]));
      RATE2[t][n] = Math.min(1, Math.max(0, t - PARR[2][n] + 1) / Math.max(1, PARR[3][n] - PARR[2][n]));
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
  // TOTAL<-array(rep(1,F*T), dim=c(F,T))
  const arrayTOTAL: number[] = new Array(F * T).fill(1);
  const TOTAL: number[][] = arrayToNDMatrix(arrayTOTAL, [F, T]) as number[][];

  // for (t in 1:T){
  //   for (r in 1:R){
  //     for (w in 1:W){
  //       for (f in 1:F){
          
  //         lambda1B[r,w,f,t]<-lambda1[w,r,year,f]*min(max((1-beta[1,O[r,w]])^RATE1[t,O[r,w]],(1-beta[2,D[r,w]])^RATE2[t,D[r,w]]))
  //         TOTAL[f,t]<-TOTAL[f,t]+lambda1B[r,w,f,t]
          
  //       }}}}
  for (let t = 0; t < T; t++){
    for (let r = 0; r < R; r++){
      for (let w = 0; w < W; w++){
        // console.log("beta[1]",beta[1],"D",D[r][w],"t",t,"r",r,"w",w)
        for (let f = 0; f < F; f++){
          lambda1B[r][w][f][t] = lambda1[w][r][year - 1][f] * Math.min(Math.max(Math.pow((1 - beta[0][O[r][w] - 1]), RATE1[t][O[r][w] - 1]), Math.pow((1 - beta[1][D[r][w] - 1]), RATE2[t][D[r][w] - 1]))); 
          TOTAL[f][t] += lambda1B[r][w][f][t];
        }
      }
    }
  }


  // ######Demand equations###################

  // Q<-array(rep(0,R*W*F*T), dim=c(R,W,F,T))
  const arrayQ: number[] = new Array(R * W * F * T).fill(0);
  const Q: number[][][][] = arrayToNDMatrix(arrayQ, [R, W, F, T]) as number[][][][];
  // for (r in 1:R){
  //   for (w in 1:W){
  //     for (t in 1:T){
  //       for (f in 1:F){
          
  //         Q[r,w,f,t]<-(10^6)*DDA[SCN,f,t]*min((1-beta[2,O[r,w]])^RATE1[t,O[r,w]]) *(lambda1B[r,w,f,t]/TOTAL[f,t])
          
  //       }}}}
  for (let r = 0; r < R; r++){
    for (let w = 0; w < W; w++){
      for (let t = 0; t < T; t++){
        for (let f = 0; f < F; f++){
          Q[r][w][f][t] = Math.pow(10, 6) * DDA[SCN - 1][f][t] * Math.min(Math.pow((1 - beta[1][O[r][w] - 1]), RATE1[t][O[r][w] - 1])) * (lambda1B[r][w][f][t] / TOTAL[f][t]);
        }
      }
    }
  }

  // eta1<-array(rep(0,T), dim=c(T))
  // for (t in 1:T){
  // eta1[t]<-(1+eta)^((t-T2)/(T-T2))-1
  //   }  


  const eta1: number[] = new Array(T).fill(0);
  for (let t = 0; t < T; t++) {
    eta1[t] = (1 + eta) ** ((t + 1 - T2) / (T - T2)) - 1; // Adjusted for zero-based indexing
  }

  // Y<-array(rep(1,R*W*V*S2*T), dim=c(R,W,V,S2,T))
  const arrayY: number[] = new Array(R * W * V * S2 * T).fill(1);
  const Y: number[][][][][] = arrayToNDMatrix(arrayY, [R, W, V, S2, T]) as number[][][][][];

  // TRIP<-array(rep(0,R*W*V*S2), dim=c(R,W,V,S2))
  const arrayTRIP: number[] = new Array(R * W * V * S2 * T).fill(0);
  const TRIP: number[][][][][] = arrayToNDMatrix(arrayTRIP, [R, W, V, S2, T]) as number[][][][][];

  // for (r in 1:R){
  //   for (w in 1:W){
  //     for (v in 1:V){
  //       for (s in 1:S[v]){
          
  //         for (t in 1:T){
  //           if(t<=T2){
  //             TRIP[r,w,v,s,t]<-LB[r,w,v,s]
  //             }else{
  //             TRIP[r,w,v,s,t]<-(eta1[t]*max(LB[r,w,v,s],UB[r,w,v,s]/2)+(1-eta1[t])*LB[r,w,v,s])
  //             }}
          
  //         for (t in 1:T){
  //           if(t<=T2){
  //             Y[r,w,v,s,t]<-CAP[s,v,ind]*U[v,r,1]*TRIP[r,w,v,s,t]}
  //           else{
  //             Y[r,w,v,s,t]<-CAP[s,v,ind]*((1-rho)*U[v,r,1]+rho*U[v,r,2])*TRIP[r,w,v,s,t]
  //           }}
          
  //         }}}}
  for (let r = 0; r < R; r++) {
    for (let w = 0; w < W; w++) {
      for (let v = 0; v < V; v++) {
        for (let s = 0; s < S[v]; s++) {
          for (let t = 0; t < T; t++) {
            if (t + 1 <= T2) {
              TRIP[r][w][v][s][t] = LB[r][w][v][s];
            } else {
              TRIP[r][w][v][s][t] = (eta1[t] * Math.max(LB[r][w][v][s], UB[r][w][v][s] / 2) +
                (1 - eta1[t]) * LB[r][w][v][s]);
            }
          }

          for (let t = 0; t < T; t++) {
            if (t + 1 <= T2) {
              Y[r][w][v][s][t] = CAP[s][v][ind - 1] * U[v][r][0] * TRIP[r][w][v][s][t];
            } else {
              Y[r][w][v][s][t] = CAP[s][v][ind - 1] * ((1 - rho) * U[v][r][0] + rho * U[v][r][1]) * TRIP[r][w][v][s][t];
            }
          }
        }
      }
    }
  }

  // Z1<-array(rep(0,R*V*S2*T), dim=c(R,V,S2,T))
  const arrayZ1: number[] = new Array(R * V * S2 * T).fill(0);
  const Z1: number[][][][] = arrayToNDMatrix(arrayZ1, [R, V, S2, T]) as number[][][][];

  // Z2<-array(rep(0,R*V*S2*T), dim=c(R,V,S2,T))
  const arrayZ2: number[] = new Array(R * V * S2 * T).fill(0);
  const Z2: number[][][][] = arrayToNDMatrix(arrayZ2, [R, V, S2, T]) as number[][][][];

  // Z3<-array(rep(0,R*V*S2*T), dim=c(R,V,S2,T))
  const arrayZ3: number[] = new Array(R * V * S2 * T).fill(0);
  const Z3: number[][][][] = arrayToNDMatrix(arrayZ3, [R, V, S2, T]) as number[][][][];

  // for (v in 1:V){
  //   for (s in 1:S[v]){
  //     for (t in 1:T){
  //       for (r in 1:R){
  //         for (f in 1:F){
  //           if(v==V2[f]){
  //             Z1[r,v,s,t]<-Z1[r,v,s,t]+factor[goal,t]*]*(1-ONES[O[r,2]]*(IMPACT[O[r,2],f,t]))*ceiling(lambda2[r,year2,s,v]*max(Q[r,1,f,t]/Y[r,1,v,s,t],Q[r,2,f,t]/Y[r,2,v,s,t])*(1+(M[v]/100)))        
  //             #Z1[r,v,s,t]<-Z1[r,v,s,t]+factor[goal,t]*ceiling(lambda2[r,year2,s,v]*max(Q[r,1,f,t]/Y[r,1,v,s,t],Q[r,2,f,t]/Y[r,2,v,s,t])*(1+(M[v]/100)))        
  //             #Z2[r,v,s,t]<-Z2[r,v,s,t]+(Q[r,1,f,t]+Q[r,2,f,t])*lambda2[r,year2,s,v]
  //           }}
          
  //         Z1[r,v,s,t]<-Z1[r,v,s,t]*L[s,v,t]]*CORR1[v]*CORR2[s,v]
  //         Z2[r,v,s,t]<-Z1[r,v,s,t]*CAP[s,v,1]/10^6
  //         Z3[r,v,s,t]<-Z2[r,v,s,t]*((1-rho)*U[v,r,1]+rho*U[v,r,2])*(TRIP[r,1,v,s]*DIST[r,1]+TRIP[r,2,v,s]*DIST[r,2])/(L[s,v,t]*1.852*10^6)
  //       }}}}
  for (let v = 0; v < V; v++) {
    for (let s = 0; s < S[v]; s++) {
      for (let t = 0; t < T; t++) {
        for (let r = 0; r < R; r++) {
          for (let f = 0; f < F; f++) {
            if (v === V2[f] - 1) {
              Z1[r][v][s][t] += (ONES[O[r][1] - 1] + factor[goal - 1][t] * (1 - ONES[O[r][1] - 1])) *
                Math.ceil(lambda2[r][year2 - 1][s][v] * Math.max(Q[r][0][f][t] / Y[r][0][v][s][t], Q[r][1][f][t] / Y[r][1][v][s][t]) * (1 + (M[v] / 100)));
              // Z2[r,v,s,t] += (Q[r,1,f,t] + Q[r,2,f,t]) * lambda2[r,year2,s,v]; // Uncomment if needed
            }
          }

          Z1[r][v][s][t] = Z1[r][v][s][t] * L[s][v][t] * CORR1[v] * CORR2[s][v];
          Z2[r][v][s][t] = Z1[r][v][s][t] * CAP[s][v][0] / Math.pow(10, 6);
          Z3[r][v][s][t] = Z2[r][v][s][t] * ((1 - rho) * U[v][r][0] + rho * U[v][r][1]) *
            (TRIP[r][0][v][s][t] * DIST[r][0] + TRIP[r][1][v][s][t] * DIST[r][1]) /
            (L[s][v][t] * 1.852 * Math.pow(10, 6));
        }
      }
    }
  }
  
  // ZC<-array(rep(0,V*S2*T), dim=c(V,S2,T))
  const arrayZC: number[] = new Array(V * S2 * T).fill(0);
  const ZC: number[][][] = arrayToNDMatrix(arrayZC, [V, S2, T]) as number[][][];

  // ZD<-array(rep(0,V*S2*T), dim=c(V,S2,T))
  const arrayZD: number[] = new Array(V * S2 * T).fill(0);
  const ZD: number[][][] = arrayToNDMatrix(arrayZD, [V, S2, T]) as number[][][];

  // FLEETC<-array(rep(0,V*S2*T), dim=c(V,S2,T))
  // const arrayFLEETC: number[] = new Array(V * S2 * T).fill(0);
  // const FLEETC: number[][][] = arrayToNDMatrix(arrayFLEETC, [V, S2, T]) as number[][][];

  // for(v in 1:V){
  //   for(s in 1:S[v]){
  //     for(t in 1:T){
  //       for(r in 1:R){
  //         ZC[v,s,t]<-ZC[v,s,t]+Z1[r,v,s,t]
  //       }
  //       ZD[v,s,t]<-ZC[v,s,t]
  //       ZC[v,s,t]<-ceiling(max(0,ZC[v,s,t]-L2[s,v]*CORR1[v]*CORR2[s,v]))    
  //     }}}
  for (let v = 0; v < V; v++){
    for (let s = 0; s < S[v]; s++){
      for (let t = 0; t < T; t++){
        for (let r = 0; r < R; r++){
          ZC[v][s][t] += Z1[r][v][s][t];
        }
        ZD[v][s][t] = ZC[v][s][t];
        ZC[v][s][t] = Math.ceil(Math.max(0, ZC[v][s][t] - L2[s][v] * CORR1[v] * CORR2[s][v]));
      }
    }
  }

  // ####### Capacity equations ##########################

  // delta2<- array(rep(0,V*S2*T), dim=c(V,S2,T))
  const arrayDelta2: number[] = new Array(V * S2 * T).fill(0);
  const delta2: number[][][] = arrayToNDMatrix(arrayDelta2, [V, S2, T]) as number[][][];

  // RF2<- array(rep(0,V*S2*T), dim=c(V,S2,T))
  const arrayRF2: number[] = new Array(V * S2 * T).fill(0);
  const RF2: number[][][] = arrayToNDMatrix(arrayRF2, [V, S2, T]) as number[][][];

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

  // FLEET<- array(rep(0,V*S2*T), dim=c(V,S2,T))
  const arrayFLEET: number[] = new Array(V * S2 * T).fill(0);
  const FLEET: number[][][] = arrayToNDMatrix(arrayFLEET, [V, S2, T]) as number[][][];

  // FLEET1<- array(rep(0,R*V*S2*T), dim=c(R,V,S2,T))
  const arrayFLEET1: number[] = new Array(R * V * S2 * T).fill(0);
  const FLEET1: number[][][][] = arrayToNDMatrix(arrayFLEET1, [R, V, S2, T]) as number[][][][];

  // FLEET2<- array(rep(0,R*V*S2*T), dim=c(R,V,S2,T))
  const arrayFLEET2: number[] = new Array(R * V * S2 * T).fill(0);
  const FLEET2: number[][][][] = arrayToNDMatrix(arrayFLEET2, [R, V, S2, T]) as number[][][][];

  // FLEET3<- array(rep(0,R*V*S2*T), dim=c(R,V,S2,T))
  const arrayFLEET3: number[] = new Array(R * V * S2 * T).fill(0);
  const FLEET3: number[][][][] = arrayToNDMatrix(arrayFLEET3, [R, V, S2, T]) as number[][][][];

  // GAP<-array(rep(0,R*V*S2*T), dim=c(R,V,S2,T))
  const arrayGAP: number[] = new Array(R * V * S2 * T).fill(0);
  const GAP: number[][][][] = arrayToNDMatrix(arrayGAP, [R, V, S2, T]) as number[][][][];

  // GAP2<-array(rep(0,R*V*S2*T), dim=c(R,V,S2,T))
  const arrayGAP2: number[] = new Array(R * V * S2 * T).fill(0);
  const GAP2: number[][][][] = arrayToNDMatrix(arrayGAP2, [R, V, S2, T]) as number[][][][];

  // GAP3<-array(rep(0,R*V*S2*T), dim=c(R,V,S2,T))
  const arrayGAP3: number[] = new Array(R * V * S2 * T).fill(0);
  const GAP3: number[][][][] = arrayToNDMatrix(arrayGAP3, [R, V, S2, T]) as number[][][][];

  // INV1<-array(rep(0,V*S2*T), dim=c(V,S2,T))
  const arrayINV1: number[] = new Array(V * S2 * T).fill(0);
  const INV1: number[][][] = arrayToNDMatrix(arrayINV1, [V, S2, T]) as number[][][];

  // for(v in 1:V){
  //   for(s in 1:S[v]){
  //     for(t in 1:T){
  //       #decreciente
  //       delta2[v,s,t]<-1-(1-delta[v,s])^(min(1,(max(0,t-rang1[v,s,1])/max(1,rang1[v,s,2]-rang1[v,s,1]))))
  //       #Creciente
  //       RF2[v,s,t]<-(1+RF[v])^(min(1,(max(0,t-rang2[v,1])/max(1,rang2[v,2]-rang2[v,1]))))-1
        
  //       for(t2 in agep1[s,v]:init1[s,v]){
  //         if(t-t2>0 && agep1[s,v]<init1[s,v]){        
  //           INV1[v,s,t]<-INV1[v,s,t]+NEW[v,s,t-t2]
  //         }}
        
  //       if(t>=(T2+1)){
          
  //         if(t-agep1[s,v]>=1){
  //           OLD[v,s,t]<-NEW[v,s,t-agep1[s,v]]-FIT[v,s,t-agep2[v]]+round(INV1[v,s,t]*(1/(T-T2)))
  //         }
  //         else{
  //           OLD[v,s,t]<-0
  //         }
          
     
  //         FIT[v,s,t] <-RF2[v,s,t]*OLD[v,s,t]
  //         DEM[v,s,t] <- OLD[v,s,t]- FIT[v,s,t]
  //         NEW[v,s,t] <- (FOREC[t,s,v,3]-FOREC[t-1,s,v,3]+DEM[v,s,t])*delta2[v,s,t]
  //         FLEET[v,s,t] <- FLEET[v,s,t-1]+ NEW[v,s,t]-OLD[v,s,t]
          
          
  //       }else{
  //         FLEET[v,s,t]<-HF[s,v,t]
  //         DEM[v,s,t]<-HD[s,v,t]
  //         NEW[v,s,t]<-HN[s,v,t]
  //       }
        
        
  //       for(r in 1:R){
  //         FLEET1[r,v,s,t]<-max(0,round(FLEET[v,s,t]*(Z1[r,v,s,t]/max(1,ZD[v,s,t]))*CORR1[v]*CORR2[s,v]))
  //         FLEET2[r,v,s,t]<-FLEET1[r,v,s,t]*CAP[s,v,1]/10^6
  //         FLEET3[r,v,s,t]<-FLEET2[r,v,s,t]*((1-rho)*U[v,r,1]+rho*U[v,r,2])*(TRIP[r,1,v,s,t]*DIST[r,1]+TRIP[r,2,v,s,t]*DIST[r,2])/(L[s,v,t]*1.852*10^6)
          
  //         GAP[r,v,s,t] <-FLEET1[r,v,s,t]-Z1[r,v,s,t]
  //         GAP2[r,v,s,t]<-FLEET2[r,v,s,t]-Z2[r,v,s,t]
  //         GAP3[r,v,s,t]<-FLEET3[r,v,s,t]-Z3[r,v,s,t]
  //       }
        
        
  //     }}}
  
  for (let v = 0; v < V; v++) {
    for (let s = 0; s < S[v]; s++) {
      for (let t = 0; t < T; t++) {
        // Decreasing
        delta2[v][s][t] = 1 - Math.pow((1 - delta[v][s]), 
          Math.min(1, 
            Math.max(0, ((t + 1) - rang1[v][s][0]) / 
            Math.max(1, (rang1[v][s][1] - rang1[v][s][0])))));

        // Increasing
        RF2[v][s][t] = Math.pow(
          (1 + RF[v]), 
          Math.min(1, 
            Math.max(0, ((t + 1) - rang2[v][0]) / 
            Math.max(1, (rang2[v][1] - rang2[v][0]))))) - 1;

        for (let t2 = agep1[s][v]; t2 <= init1[s][v]; t2++) {
          if ((t + 1) - t2 > 0 && agep1[s][v] < init1[s][v]) {
            INV1[v][s][t] += NEW[v][s][t - t2];
          }
        }

        if ((t + 1) >= (T2 + 1)) {
          if ((t + 1) - agep1[s][v] >= 1) {
            OLD[v][s][t] = NEW[v][s][t - agep1[s][v]] - FIT[v][s][t  - agep2[v]] + 
              Math.round(INV1[v][s][t] * (1 / (T - T2)));
          } else {
            OLD[v][s][t] = 0;
          }

          FIT[v][s][t] = RF2[v][s][t] * OLD[v][s][t];
          DEM[v][s][t] = OLD[v][s][t] - FIT[v][s][t];
          NEW[v][s][t] = (FOREC[t][s][v][2] - FOREC[t - 1][s][v][2] + DEM[v][s][t]) * delta2[v][s][t];
          FLEET[v][s][t] = FLEET[v][s][t - 1] + NEW[v][s][t] - OLD[v][s][t];
        } else {
          FLEET[v][s][t] = HF[s][v][t];
          DEM[v][s][t] = HD[s][v][t];
          NEW[v][s][t] = HN[s][v][t];
        }

        for (let r = 0; r < R; r++) {
          FLEET1[r][v][s][t] = Math.max(0, FLEET[v][s][t] * (Z1[r][v][s][t] / Math.max(1, ZD[v][s][t])) * CORR1[v] * CORR2[s][v]);
          FLEET2[r][v][s][t] = FLEET1[r][v][s][t] * CAP[s][v][0] / Math.pow(10, 6);
          FLEET3[r][v][s][t] = FLEET2[r][v][s][t] * ((1 - rho) * U[v][r][0] + rho * U[v][r][1]) *
            (TRIP[r][0][v][s][t] * DIST[r][0] + TRIP[r][1][v][s][t] * DIST[r][1]) /
            (L[s][v][t] * 1.852 * Math.pow(10, 6));

          GAP[r][v][s][t] = FLEET1[r][v][s][t] - Z1[r][v][s][t];
          GAP2[r][v][s][t] = FLEET2[r][v][s][t] - Z2[r][v][s][t];
          GAP3[r][v][s][t] = FLEET3[r][v][s][t] - Z3[r][v][s][t];
        }
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
    FLEET1: FLEET1,
    FLEET2: FLEET2,
    FLEET3: FLEET3,
    Z1: Z1,
    Z2: Z2,
    Z3: Z3,
    GAP: GAP,
    GAP2: GAP2,
    GAP3: GAP3,
  }

  // console.log(resultObj);

  return resultObj;
}

export { transformData };