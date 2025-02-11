import * as d3 from "d3";
import { defaultValues } from "./data";

async function parseTSV(url: string): Promise<number[][]> {
  const response = await fetch(url);
  const text = await response.text();
  const parsedRows = d3.tsvParseRows(text);
  
  // Convert each string in the parsed rows to a number
  return parsedRows.map((row: string[]) => row.map((cell: string) => parseFloat(cell)))
}

function arrayToMatrix(data: number[], dim: number[]): number[][] {
  const result: number[][] = [];
  const [ a ] = dim;
  let dataArr = [...data];
  while(dataArr.length > 0){
    result.push(dataArr.splice(0, a));
  }
  return d3.transpose(result);
}

async function transformData( dataObj = defaultValues ){
   
  const dataEMIS: number[][] = await parseTSV('../files/dataEMIS.txt');
  const dataEVOL: number[][] = await parseTSV('../files/dataEVOL.txt');
  const dataPASS: number[][] = await parseTSV('../files/dataPASS.txt');
  // # Sets
  // T<-26 # Periodos de tiempo
  // I<-5 # Tecnologias incluida la actual
  // V<-2 # Tipos de vehiculos
  // P<-4 # Politicas de consolidacion
  // C<-3 # Elementos de costo
  // REP<-0.85 # Representatividad de la flota
  const T: number = 26;
  const I: number = 5;
  const V: number = 2;
  const P: number = 4;
  const C: number = 3;
  const REP: number = 0.85;

  // # Parametros developer
  // scl<-10^6 # escala logit
  // beta <- c(1,1,1) # Coeficientes logit
  // salv<-0.2 # Porcentaje de salvamento con respecto a lo que vale nuevo el vehiculo
  // const scl: number = 10**3;
  const { scl } = dataObj;
  const beta: number[] = [1, 1, 1];
  const salv: number = 0.2;

  // FM<-array(c(1, 1,0.91, 0.59, 1.05), dim=c(I)) # Factor de mantenimiento
  // TTW<- array(c(5401,5401,511,203,9500), dim=c(I)) # Tank to wheel factor
  // #TTW<- array(c(0,0,0,0,0), dim=c(I)) # Tank to wheel factor
  // WTT<- array(c(10133,10133,1952,0,0), dim=c(I)) # Evolucion Tank to Wheel
  // CF <- array(c(8497,8497,2410,755,9840), dim=c(I)) # Costo de combustible año cero
  const FM: number[] = [1, 1, 0.91, 0.59, 1.05];
  const TTW: number[] = [5401, 5401, 511, 203, 9500];
  const WTT: number[] = [10133, 10133, 1952, 0, 0];
  const CF: number[] = [8497, 8497, 2410, 755, 9840];

  // W<-array(c(4,7), dim=c(V)) # Peso del vehiculo vacio
  // KMV <- array(c(165846, 260283), dim=c(V)) # Kilometros que un vehiculo recorre al año
  // CM<-array(c(40.40, 68.33), dim=c(V)) # costo por kilometro de mantenimiento de un vehiculo nuevo
  // EMPT0 <- array(c(0.6929,0.6637), dim=c(V)) # Porcentaje actual de viajes vacios en el pais
  // EMPT1 <- array(c(0.2995,0.2900), dim=c(V)) # Porcentaje optimo de viajes vacios en el pais
  // QVEH <- array(c(366250,201259,151919,70116,328705,204607,154142,106955), dim=c(P,V)) # numero de viajes requerido por politica
  const W: number[] = [4, 7];
  const KMV: number[] = [260283, 165846];
  const CM: number[] = [40.40, 68.33];
  const EMPT0: number[] = [0.6929, 0.6637];
  const EMPT1: number[] = [0.2995, 0.2900];
  const arrayQVEH: number[] = [366250, 201259, 151919, 70116, 328705, 204607, 154142, 106955];
  const QVEH: number[][] = arrayToMatrix(arrayQVEH, [P, V]);

  // KMT <- array(c(1099.56,0,0,0,0,1016.37,0,0,0,0), dim=c(I,V)) # milllones de km que recorre cada tipo de vehiculo en el rndc
  // TON <- array(c(5.70,0,0,0,0,31.12,0,0,0,0), dim=c(I,V)) # toneladas promedio por viaje de cada tipo de vehiculo
  // INV <- array(c(67513,0,0,0,0,54080,0,0,0,0), dim=c(I,V)) # Numero de vehiculos de cada tipo que realiza viajes en el RNDC
  // nn <- array(c(20,20,20,10,10), dim=c(I)) # vida util de un vehiculo
  const arrayKMT: number[] = [1099.56, 0, 0, 0, 0, 1016.37, 0, 0, 0, 0];
  const KMT: number[][] = arrayToMatrix(arrayKMT, [I, V]);

  const arrayTON: number[] = [5.70, 0, 0, 0, 0, 31.12, 0, 0, 0, 0];
  const TON: number[][] = arrayToMatrix(arrayTON, [I, V]);

  const arrayINV: number[] = [67513, 0, 0, 0, 0, 54080, 0, 0, 0, 0];
  const INV: number[][] = arrayToMatrix(arrayINV, [I, V]);

  const nn: number[] = [20, 20, 20, 10, 10];
  // A<- array(c(0,440,557,640,1640,0,716,906,1060,2192), dim=c(I,V)) # costo de los activos en el año actual
  // EFF2 <- array(c(14.122,15.452,2.986,0.750,19.867,4.964,6.041,1.168,0.389,9.966), dim=c(I,V)) # Galones por ton-km
  // omega<-array(c(1, 3.26, 5.33, 7.21, 8.91, 10.45, 11.84, 13.1, 14.22, 15.21, 16.1, 16.88, 17.56, 18.15, 18.66, 19.09, 19.44, 19.73, 19.96, 20.14), dim=c(20)) # Curva del costo por edad de mantenmiento
  const arrayA: number[] = [0, 440, 557, 640, 1640, 0, 716, 906, 1060, 2192];
  const A: number[][] = arrayToMatrix(arrayA, [I, V]);

  const arrayEFF2: number[] = [14.122, 15.452, 2.986, 0.750, 19.867, 4.964, 6.041, 1.168, 0.389, 9.966];
  const EFF2: number[][] = arrayToMatrix(arrayEFF2, [I, V]);

  const omega: number[] = [
    1, 3.26, 5.33, 7.21, 8.91, 10.45, 11.84, 13.1, 14.22, 15.21,
    16.1, 16.88, 17.56, 18.15, 18.66, 19.09, 19.44, 19.73, 19.96, 20.14
  ];
  // # Parametros afectados por escenarios
  // opt<-1 # 1,Si es libre albeldrio del dueño renovar su vehiculo. 0, de lo contrario
  // esc<-3 # 1, pesimista, 2, esperado, 3 optimista.
  // INF<-array(c(0.131,0.071,0.046), dim=c(3)) # inflacion media anual esperada
  // DEV<-array(c(0.138,0.049,0.008), dim=c(3)) # inflacion media anual esperada
  // RG <- array(c(0.018,0.026,0.041,0.018,0.026,0.041), dim=c(3,V)) # Crecimiento anual de la flota
  // roi<-array(c(0.103, 0.122, 0.151), dim=c(3)) # Rentabilidad del sector, larepublica
  const opt: number = 1;
  const esc: number = 2;
  const INF: number[] = [0.131, 0.071, 0.046];
  const DEV: number[] = [0.138, 0.049, 0.008];

  const arrayRG: number[] = [0.018, 0.026, 0.041, 0.018, 0.026, 0.041];
  const RG: number[][] = arrayToMatrix(arrayRG, [3, V]);

  const roi: number[] = [0.103, 0.122, 0.151];

  // GR<- array(c(0.017,0.017,0.0243,0.1380,0.053,
  //              0.014,0.014,0.0083,0.0367,0.030,
  //              0.007,0.007,0.0017,0.0095,-0.03), dim=c(3,I)) # Cambio del costo de combustible anual
  const arrayGR: number[] = [0.017, 0.017, 0.0243, 0.1380, 0.053, 0.014, 0.014, 0.0083, 0.0367, 0.030, 0.007, 0.007, 0.0017, 0.0095, -0.03];
  const GR: number[][] = arrayToMatrix(arrayGR, [I, 3]);

  // EVOL <- array(data.matrix(data1), dim=c(T,I,3)) # Factor evolucion de la eficiencia de los motores
  // EMI<- array(data.matrix(data2), dim=c(T,I,3)) # Evolucion Tank to Wheel
  // PASS<- array(data.matrix(data3), dim=c(T,I,V)) # Factor evolucion precio activo de las tecnologias

  const EVOL: number[][][] = dataEVOL.map(row => arrayToMatrix(row, [I, 3]));
  const EMI: number[][][] = dataEMIS.map(row => arrayToMatrix(row, [I, 3]));
  const PASS: number[][][] = dataPASS.map(row => arrayToMatrix(row, [I, V]));

  // # Parametros user
  // ti <- array(c(0,0,0,0,6,0,0,0,11,16), dim=c(I,V)) # Año fin de disponibilidad technologia en mercado
  // tf <- array(c(30,11,11,26,26,0,11,11,26,26), dim=c(I,V)) # Año fin de disponibilidad technologia en mercado
  // VAC <- c(0,0.35,0.35,-0.35,-0.35) # Porcentaje de subsidio / Penalizacion activos
  // VFC <- c(0,0.35,0.35,-0.35,-0.35) # Porcentaje de subsidio / Penalizacion combustible
  // tc1<-c(0,0,0,0,0)# Periodo inicio de subsidio combustible
  // tc2<-c(1,5,5,5,5)# Periodo finalizacion de subsidio combustible
  const { ti, tf, VAC, VFC, tc1, tc2 } = dataObj

  // CT<-200 # Tax carbon USD/ton
  // tt<-10 # Periodo de instalacion del tax carbon
  // TRM<-4000 # Dolar - COP
  const { CT, tt, TRM } = dataObj

  // eta<-1 # Ratio de implementacion viajes vacios
  // lambda<- c(0,1,0,0) # Ratio implementacion politicas de consolidacion
  // gamma<- c(0.09, 0.15,0.05) # Porcentajes de ahorro por mejoras 
  // Top<-6 # Periodo maximo de implementacion de los ratios
  // st <- 0 # Periodo inicio de implementacion de los ratios
  const { eta, lambda, gamma, Top, st } = dataObj

  // RN<-c(0.10,0.10)
  // LO <- c(0.10,0.90,0.00) # Porcentajes de los flujos del prestamo
  // rate<-0.2682 # Tasa del prestamo
  // per<-5 # Años del prestamo
  const { RN, LO, rate, per } = dataObj

  // agep<-20 # Años maximo un vehiculo puede ser conservado en circulacion
  const { agep } = dataObj; //user param assets

  // #####################################

  // K3<- array(rep(0,T), dim=c(T))
  // K2<- array(rep(0,V*T), dim=c(V,T))
  // K1<- array(rep(0,V*T), dim=c(V,T))

  const K3: number[] = new Array(T).fill(0);
  const K2: number[][] = new Array(V).fill(0).map(() => new Array(T).fill(0));
  const K1: number[][] = new Array(V).fill(0).map(() => new Array(T).fill(0));

  // Original
  // for(t in 1:T){
    
  //   K3[t]<-((1-gamma[1])*(1-gamma[2])*(1-gamma[3]))^(min(1,(max(0,t-st)/(Top-st))));
    
  //   for(v in 1:V){
      
  //     for(p in 1:P){
  //       K2[v,t] <-  K2[v,t]+((lambda[p]*QVEH[p,v]*W[v])/(QVEH[1,v]*W[v]))^(min(1,(max(0,t-st)/(Top-st))))
  //     }
      
  //     K1[v,t]<-((1-eta)*EMPT0[v]+eta*EMPT1[v])^(min(1,(max(0,t-st)/(Top-st))))  
  //   }}

  // corrige indice +1
  for(let t = 0; t < T; t++){

    K3[t] = ((1 - gamma[0]) * (1 - gamma[1]) * (1 - gamma[2])) ** Math.min(1, (Math.max(0, (t + 1) - st) / (Top - st)));
    
    for(let v = 0; v < V; v++){

      for(let p = 0; p < P; p++){

        K2[v][t] = K2[v][t] + (((lambda[p] * QVEH[p][v] * W[v]) / (QVEH[0][v] * W[v])) ** Math.min(1, (Math.max(0, (t + 1) - st) / (Top - st))));
      
      }
      K1[v][t] = ((1 - eta) * EMPT0[v] + eta * EMPT1[v]) ** Math.min(1, (Math.max(0, (t + 1) - st) / (Top - st)));
    }
  }

  // TK<- array(rep(0,I*V*T), dim=c(I,V,T))
  // for(t in 1:T){
  //   for(v in 1:V){
  //     for(i in 1:I){
  //       TK[i,v,t] <- KMT[i,v]*(TON[i,v]+W[v]*K2[v,t]*(1+K1[v,t]))*(1+RG[esc,v])^t
  //     }}}
  const TK: number[][][] = new Array(I).fill(0).map(() => new Array(V).fill(0).map(() => new Array(T).fill(0)));
  for(let t = 0; t < T; t++) {
    for(let v = 0; v < V; v++) {
      for(let i = 0; i < I; i++) {
        TK[i][v][t] = KMT[i][v] * (TON[i][v] + W[v] * K2[v][t] * (1 + K1[v][t])) * Math.pow((1 + RG[esc - 1][v]), (t + 1));
      }
    }
  }

  // F<- array(rep(0,I*V*T), dim=c(I,V,T))
  // Fs<- array(rep(0,I*V*T), dim=c(I,V,T))

  // for(t in 1:T){
  //   for(v in 1:V){
  //     for(i in 1:I){
  //       if(EFF2[i,v]>0){
  //       F[i,v,t] <- (10^3/EFF2[i,v])*TK[i,v,t]*K3[t]
  //       Fs[i,v,t] <-(10^3/EFF2[i,v])*KMT[i,v]*(TON[i,v]+W[v]*(1+EMPT0[v]))*(1+RG[esc,v])^t
  //             }
  //        }}}
  const F: number[][][] = new Array(I).fill(0).map(() => new Array(V).fill(0).map(() => new Array(T).fill(0)));
  const Fs: number[][][] = new Array(I).fill(0).map(() => new Array(V).fill(0).map(() => new Array(T).fill(0)));


  for(let t = 0; t < T; t++) {
    for(let v = 0; v < V; v++) {
      for(let i = 0; i < I; i++) {
        if(EFF2[i][v] > 0) {
          F[i][v][t] = (10**3 / EFF2[i][v]) * TK[i][v][t] * K3[t];
          Fs[i][v][t] = (10**3 / EFF2[i][v]) * KMT[i][v] * (TON[i][v] + W[v] * (1 + EMPT0[v])) * Math.pow((1 + RG[esc - 1][v]), (t + 1));
        }
      }
    }
  }

  // TEMPA1<- array(rep(0,T), dim=c(T))
  // TEMPA0<- array(rep(0,T), dim=c(T))
  const TEMPA1: number[] = new Array(T).fill(0);
  const TEMPA0: number[] = new Array(T).fill(0);

  // for(t in 1:T){
  //   for(v in 1:V){
  //     for(i in 1:I){
  //       TEMPA1[t] <- TEMPA1[t]+F[i,v,t]*(WTT[i]*EMI[t,i,esc]+TTW[i])
  //       TEMPA0[t] <- TEMPA0[t]+Fs[i,v,t]*(WTT[i]*EMI[t,i,esc]+TTW[i])
  //     }}}
  for(let t = 0; t < T; t++) {
    for(let v = 0; v < V; v++) {
      for(let i = 0; i < I; i++) {
        TEMPA1[t] = TEMPA1[t] + F[i][v][t] * (WTT[i] * EMI[t][i][esc - 1] + TTW[i]);
        TEMPA0[t] = TEMPA0[t] + Fs[i][v][t] * (WTT[i] * EMI[t][i][esc - 1] + TTW[i]);
      }
    }
  }

  // SAVED1<- array(rep(0,T), dim=c(T))
  // for(t in 1:T){
  //   SAVED1[t]<-1-TEMPA1[t]/TEMPA0[t];
  // }
  const SAVED1: number[] = new Array(T).fill(0);
  for(let t = 0; t < T; t++){
    SAVED1[t] = 1 - TEMPA1[t] / TEMPA0[t];
  }

  // PROD<- array(rep(0,V*T), dim=c(V,T))
  // for(v in 1:V){
  //     for(t in 1:T){
  //       for(i in 1:I){
  // PROD[v,t]<-PROD[v,t]+TK[i,v,t]*K3[t]
  //       }}}
  const PROD: number[][] = new Array(V).fill(0).map(() => new Array(T).fill(0));
  for(let v = 0; v < V; v++) {
    for(let t = 0; t < T; t++) {
      for(let i = 0; i < I; i++) {
        PROD[v][t] = PROD[v][t] + TK[i][v][t] * K3[t];
      }
    }
  }

  // FLEET<- array(rep(0,V), dim=c(V))
  // for(v in 1:V){
  //     for(i in 1:I){
  // FLEET[v]<-FLEET[v]+INV[i,v]
  // }}
  const FLEET: number[] = new Array(V).fill(0);
  for(let v = 0; v < V; v++) {
    for(let i = 0; i < I; i++) {
      FLEET[v] = FLEET[v] + INV[i][v];
    }
  }

  // E<- array(rep(0,I*V*T), dim=c(I,V,T))
  // for(v in 1:V){
  //   for(i in 1:I){
  //     for(t in 1:T){
  //       if(EFF2[i,v]>0){
  //       // E[i,v,t]=PROD[v,t]*(10^3/EFF2[i,v])*EVOL[t,i,esc]/(FLEET[v]*(1+RG[esc,v])^t)
  //       // E[i,v,t]=(10^6)*KMT[1,v]/(EFF2[i,v]*EVOL[t,i,esc]*FLEET[v])
  //        E[i,v,t]=KMV[v]*(F[1,v,t]/Fs[1,v,t])/(EFF2[i,v]*EVOL[t,i,esc])
  //     }}}}



  const E: number[][][] = new Array(I).fill(0).map(() => new Array(V).fill(0).map(() => new Array(T).fill(0)));
  for(let v = 0; v < V; v++) {
    for(let i = 0; i < I; i++) {
      for(let t = 0; t < T; t++) {
        if(EFF2[i][v] > 0) {
          // E[i][v][t] = PROD[v][t] * (10**3 / EFF2[i][v]) * EVOL[t][i][esc - 1] / (FLEET[v] * Math.pow((1 + RG[esc - 1][v]), (t + 1)));
          // E[i,v,t]=(10^6)KMT[1,v](F[1,v,t]/Fs[1,v,t])/(EFF2[i,v]*EVOL[t,i,esc]*FLEET[v])
          E[i][v][t] = KMV[v]* (F[0][v][t] / Fs[0][v][t]) / (EFF2[i][v] * EVOL[t][i][esc - 1]);
        }
      }
    }
  }

  // NPV<- array(rep(0,I*V*T*C), dim=c(I,V,T,C))
  // for(v in 1:V){
  //   for(i in 1:I){
  //     for(t in 1:T){
  //       if(i==1){NPV[i,v,t,1]<-0
  //       }else{
  //       NPV[i,v,t,1]<-A[i,v]*PASS[t,i,v]*((1+DEV[esc])^t)*(1+VAC[i])*(LO[1]+LO[2]*(rate/(1-(1+rate)^(-per)))*((1-(1+roi[esc])^(-per))/roi[esc]) + (LO[3]-salv)/((1+roi[esc])^per))
  //     }}}}
  const NPV: number[][][][] = new Array(I).fill(0).map(() => new Array(V).fill(0).map(() => new Array(T).fill(0).map(() => new Array(C).fill(0))));
  for(let v = 0; v < V; v++) {
    for(let i = 0; i < I; i++) {
      for(let t = 0; t < T; t++) {
        if(i == 0) {
          NPV[i][v][t][0] = 0;
        } else {
          NPV[i][v][t][0] = A[i][v] * PASS[t][i][v] * Math.pow((1 + DEV[esc - 1]), (t + 1)) * (1 + VAC[i]) * (LO[0] + LO[1] * (rate / (1 - Math.pow((1 + rate), -per))) * ((1 - Math.pow((1 + roi[esc - 1]), -per)) / roi[esc - 1]) + (LO[2] - salv) / Math.pow((1 + roi[esc - 1]), per));
        }
      }
    }
  }

  // IMP<-array(rep(0,I*T), dim=c(I,T))
  // for(i in 1:I){
  //   for(t1 in 1:T){
      
  //     if(VFC[i]>=0){
  // IMP[i,t1]<-min(1,max(0,(t1-tc1[i])/(tc2[i]-tc1[i])))
  // }else{IMP[i,t1]<- 1-min(1,max(0,(t1-tc1[i])/(tc2[i]-tc1[i])))}

  // }}
  const IMP: number[][] = new Array(I).fill(0).map(() => new Array(T).fill(0));
  for(let i = 0; i < I; i++) {
    for(let t1 = 0; t1 < T; t1++) {
      // if(VFC[i] >= 0) {
      IMP[i][t1] = Math.min(1, Math.max(0, ((t1 + 1) - tc1[i]) / (tc2[i] - tc1[i])));
      // } else {
      //   IMP[i][t1] = 1 - Math.min(1, Math.max(0, ((t1 + 1) - tc1[i]) / (tc2[i] - tc1[i])));
      // }
    }
  }  

    
  // for(v in 1:V){
  //   for(i in 1:I){
  //     for(t in 1:T){
  //       for(t1 in t:t+nn[i]){
          
  //         if(t1<=T){        
  //           NPV[i,v,t,2]<-NPV[i,v,t,2]+E[i,v,t]*((CF[i]/10^6)*(1+VFC[i]*IMP[i,t1])*(1+GR[esc,i])^t1+(CT/10^6)*(TRM/10^6)*min(1,t1/tt)*(WTT[i]*EMI[t,i,esc]+TTW[i]))*(1/(1+roi[esc])^(t-t1))
  //         }else{NPV[i,v,t,2]<-NPV[i,v,t,2]+E[i,v,t]*((CF[i]/10^6)*(1+VFC[i]*IMP[i,T])*(1+GR[esc,i])^t1+(CT/10^6)*(TRM/10^6)*min(1,t1/tt)*(WTT[i]*EMI[T,i,esc]+TTW[i]))*(1/(1+roi[esc])^(t-t1))}
          

  //       }}}}



//   if(t1<=T){    
//     NPV[i,v,t,2]<-NPV[i,v,t,2]+E[i,v,t]((CF[i]/10^6)(1+VFC[i]IMP[i,t1])+(CT/10^6)(TRM/10^6)min(1,t1/tt)(WTT[i]EMI[t,i,esc]+TTW[i]))(1+GR[i,esc])^t1*(1/(1+roi[esc])^(t1-t))
// }else{NPV[i,v,t,2]<-NPV[i,v,t,2]+E[i,v,t]((CF[i]/10^6)(1+VFC[i]IMP[i,T] )+(CT/10^6)(TRM/10^6)min(1,t1/tt)(WTT[i]EMI[T,i,esc]+TTW[i]))(1+GR[i,esc])^t1*(1/(1+roi[esc])^(t1-t))}
  for(let v = 0; v < V; v++){
    for(let i = 0; i < I; i++){
      for(let t = 0; t < T; t++){
        for(let t1 = t; t1 <= (t + nn[i]); t1++){
          if(t1 < T){
            NPV[i][v][t][1] += E[i][v][t] * ((CF[i] / 10**6) * (1 + VFC[i] * IMP[i][t1]) + (CT / 10**6) * (TRM / 10**6) * Math.min(1, (t1 + 1) / tt) * (WTT[i] * EMI[t1][i][esc - 1] + TTW[i])) * (1 + GR[i][esc - 1]) ** (t1 + 1)  * (1 / (1 + roi[esc - 1]) ** ((t1 + 1) - (t + 1)));
          } else {
            NPV[i][v][t][1] += E[i][v][t] * ((CF[i] / 10**6) * (1 + VFC[i] * IMP[i][T - 1]) + (CT / 10**6) * (TRM / 10**6) * Math.min(1, (t1 + 1) / tt) * (WTT[i] * EMI[T - 1][i][esc - 1] + TTW[i])) * (1 + GR[i][esc - 1]) ** (t1 + 1) * (1 / (1 + roi[esc - 1]) ** ((t1 + 1) - (t + 1)));
          }
        }
      }
    }
  }

  // for(v in 1:V){
  //   for(i in 1:I){
  //     for(t in 1:T){
  //       for(t1 in 1:nn[i]){
  //         if(i==1){
  //           NPV[i,v,t,3]<-NPV[i,v,t,3]+(CM[v]/10^6)*((1+INF[esc])^t)*FM[i]*(1+omega[20])*KMV[v]*(1/(1+roi[esc])^(t1))
  //           }else{
  //           NPV[i,v,t,3]<-NPV[i,v,t,3]+(CM[v]/10^6)*((1+INF[esc])^t)*FM[i]*(1+omega[t1])*KMV[v]*(1/(1+roi[esc])^(t1))
  //       }}}}}
  for(let v = 0; v < V; v++){
    for(let i = 0; i < I; i++){
      for(let t = 0; t < T; t++){
        for(let t1 = 0; t1 < nn[i]; t1++){
          if(i === 0){
            NPV[i][v][t][2] += (CM[v] / 10**6) * ((1 + INF[esc - 1]) ** (t + 1)) * FM[i] * (1 + omega[19]) * KMV[v] * (1 / (1 + roi[esc - 1]) ** (t1 + 1));
          } else {
            NPV[i][v][t][2] += (CM[v] / 10**6) * ((1 + INF[esc - 1]) ** (t + 1)) * FM[i] * (1 + omega[t1]) * KMV[v] * (1 / (1 + roi[esc - 1]) ** (t1 + 1));
          }
        }
      }
    }
  }

  // EAA<- array(rep(0,I*V*T*C), dim=c(I,V,T,C))
  // for(v in 1:V){
  //   for(i in 1:I){
  //     for(t in 1:T){
  //       for(c in 1:C){
  //         EAA[i,v,t,c]<-NPV[i,v,t,c]*roi[esc]/(1-(1+roi[esc])^(-nn[i]))
  //       }}}}
  let EAA: number[][][][] = [];
  for(let i = 0; i < I; i++){
    EAA[i] = [];
    for(let v = 0; v < V; v++){
      EAA[i][v] = [];
      for(let t = 0; t < T; t++){
        EAA[i][v][t] = [];
        for(let c = 0; c < C; c++){
          EAA[i][v][t][c] = NPV[i][v][t][c] * roi[esc-1] / (1 - (1 + roi[esc-1]) ** (-nn[i]));
        }
      }
    }
  }

  // UTIL<- array(rep(0,I*V*T), dim=c(I,V,T))
  // for(v in 1:V){
  //   for(i in 1:I){
  //     for(t in 1:T){
  //       for(c in 1:C){
  //         UTIL[i,v,t]<-UTIL[i,v,t]-beta[c]*EAA[i,v,t,c]/scl  
  //       }}}}
  let UTIL: number[][][] = [];
  for(let i = 0; i < I; i++){
    UTIL[i] = [];
    for(let v = 0; v < V; v++){
      UTIL[i][v] = [];
      for(let t = 0; t < T; t++){
        UTIL[i][v][t] = 0;
        for(let c = 0; c < C; c++){
          UTIL[i][v][t] = UTIL[i][v][t] - (beta[c] * EAA[i][v][t][c] / scl); 
        }
      }
    }
  }

  // TEMPX<- array(rep(0,V*T), dim=c(V,T))
  // for(v in 1:V){
  //   for(i in 1:I){
  //     for(t in 1:T){
  //       if(t>=ti[i,v]){
  //         if(t<=tf[i,v]){
            
  //         if(i==1){
  //           if(opt==1){TEMPX[v,t]<-TEMPX[v,t]
  //           }else{TEMPX[v,t]<-TEMPX[v,t]+exp(UTIL[i,v,t])}
  //           }else{TEMPX[v,t]<-TEMPX[v,t]+exp(UTIL[i,v,t])}
            
  //         }else{ TEMPX[v,t]<-TEMPX[v,t]}
  //       }else{ TEMPX[v,t]<-TEMPX[v,t]}
        
  //     }}}
  let TEMPX: number[][] = [];
  for(let v = 0; v < V; v++){
    TEMPX[v] = [];
    for(let t = 0; t < T; t++){
      TEMPX[v][t] = 0;
      for(let i = 0; i < I; i++){
        if(t >= (ti[i][v] - 1)){
          if(t <= (tf[i][v] - 1)){
            if(i === 0){
              if(opt === 1){
                // Do nothing
              } else {
                TEMPX[v][t] += Math.exp(UTIL[i][v][t]);
              }
            } else {
              TEMPX[v][t] += Math.exp(UTIL[i][v][t]);
            }
          }
          // Do nothing if t > tf[i][v]
        }
        // Do nothing if t < ti[i][v]
      }
    }
  }

  // PROB<- array(rep(0,I*V*T), dim=c(I,V,T))
  // for(v in 1:V){
  //   for(i in 1:I){
  //     for(t in 1:T){
  //       if(t>=ti[i,v]){
  //         if(t<=tf[i,v]){
            
  //           if(i==1){
  //             if(opt==1){ PROB[i,v,t]<-0
  //             }else{ PROB[i,v,t]<-exp(UTIL[i,v,t])/TEMPX[v,t]}
  //           }else{ PROB[i,v,t]<-exp(UTIL[i,v,t])/TEMPX[v,t]}
            
  //         }else{PROB[i,v,t]<-0}
  //       }else{PROB[i,v,t]<-0}
  //     }}}
  let PROB: number[][][] = [];
  for(let i = 0; i < I; i++){
    PROB[i] = [];
    for(let v = 0; v < V; v++){
      PROB[i][v] = [];
      for(let t = 0; t < T; t++){
        if(t >= (ti[i][v] - 1)){
          if(t <= (tf[i][v] - 1)){
            if(i === 0){
              if(opt === 1){
                PROB[i][v][t] = 0;
              } else {
                PROB[i][v][t] = Math.exp(UTIL[i][v][t]) / TEMPX[v][t];
              }
            } else {
              PROB[i][v][t] = Math.exp(UTIL[i][v][t]) / TEMPX[v][t];
            }
          } else {
            PROB[i][v][t] = 0;
          }
        } else {
          PROB[i][v][t] = 0;
        }
      }
    }
  }

  // N<- array(rep(0,I*V*T), dim=c(I,V,T))
  // G<- array(rep(0,I*V*T), dim=c(I,V,T))
  // D<- array(rep(0,I*V*T), dim=c(I,V,T))
  // OLD<- array(rep(0,I*V*T), dim=c(I,V,T))
  // for(v in 1:V){
  //   for(i in 1:I){
  //     for(t in 1:T){
        
  //       if(t>=2){  
          
  //         if(t-agep>=1){
  //           OLD[i,v,t]<-OLD[i,v,t-1]+G[i,v,t-agep]-D[i,v,t-1]}
  //         else{OLD[i,v,t]<-OLD[i,v,t-1]-D[i,v,t-1]}
          
  //         if(opt==1){
  //         D[i,v,t] <- RN[v]*OLD[i,v,t]  
  //         }else{D[i,v,t] <- PROB[1,v,t]*OLD[i,v,t] }
          
  //         for(i2 in 1:I){
  //           G[i,v,t] <- G[i,v,t]+PROB[i,v,t]*(RG[esc,v]*N[i2,v,t-1]+D[i2,v,t])
  //         }
          
  //         N[i,v,t] <- N[i,v,t-1]+G[i,v,t]-D[i,v,t]
  //       }else{
  //         OLD[i,v,t]<-INV[i,v]
          
  //         if(opt==1){
  //           D[i,v,t] <- RN[v]*OLD[i,v,t]  
  //         }else{D[i,v,t] <- PROB[1,v,t]*OLD[i,v,t] }
          
  //         for(i2 in 1:I){
  //           G[i,v,t] <- G[i,v,t]+PROB[i,v,t]*(RG[esc,v]*INV[i2,v]+D[i2,v,t])
  //         }
          
  //         N[i,v,t] <- INV[i,v]+G[i,v,t]-D[i,v,t]
  //       }
        
  //     }}}
  let N: number[][][] = new Array(I).fill(0).map(() => new Array(V).fill(0).map(() => new Array(T).fill(0)));
  let G: number[][][] = new Array(I).fill(0).map(() => new Array(V).fill(0).map(() => new Array(T).fill(0)));
  let D: number[][][] = new Array(I).fill(0).map(() => new Array(V).fill(0).map(() => new Array(T).fill(0)));
  let OLD: number[][][] = new Array(I).fill(0).map(() => new Array(V).fill(0).map(() => new Array(T).fill(0)));

  for(let v = 0; v < V; v++){
    for(let i = 0; i < I; i++){
      for(let t = 0; t < T; t++){

        if(t >= 1){  

          if(t - agep >= 0){
            OLD[i][v][t] = OLD[i][v][t - 1] + G[i][v][t - agep] - D[i][v][t - 1];
          } else {
            OLD[i][v][t] = OLD[i][v][t - 1] - D[i][v][t - 1];
          }

          if(opt === 1){
            D[i][v][t] = RN[v] * OLD[i][v][t];  
          } else {
            D[i][v][t] = PROB[0][v][t] * OLD[i][v][t];
          }

          for(let i2 = 0; i2 < I; i2++){
            
            G[i][v][t] = G[i][v][t] + PROB[i][v][t] * (RG[esc - 1][v] * N[i2][v][t - 1] + D[i2][v][t]); 
          }

          N[i][v][t] = N[i][v][t - 1] + G[i][v][t] - D[i][v][t];
        } else {
          OLD[i][v][t] = INV[i][v];

          if(opt === 1){
            D[i][v][t] = RN[v] * OLD[i][v][t];  
          } else {
            D[i][v][t] = PROB[0][v][t] * OLD[i][v][t];
          }

          for(let i2 = 0; i2 < I; i2++){
            
            G[i][v][t] = G[i][v][t] + PROB[i][v][t] * (RG[esc - 1][v] * INV[i2][v] + D[i2][v][t]);
          }

          N[i][v][t] = INV[i][v] + G[i][v][t] - D[i][v][t];
        }
      }
    }
  }

  // WTTX<- array(rep(0,I*V*T), dim=c(I,V,T))
  // TTWX<- array(rep(0,I*V*T), dim=c(I,V,T))
  // QFUEL<- array(rep(0,I*V*T), dim=c(I,V,T))
  // for(t in 1:T){
  //   for(v in 1:V){
  //     for(i in 1:I){
  //       WTTX[i,v,t]<-N[i,v,t]*(WTT[i]*EMI[t,i,esc])*E[i,v,t]/10^6
  //       QFUEL[i,v,t]<-N[i,v,t]*E[i,v,t]/10^6
  //       TTWX[i,v,t]<-TTW[i]*QFUEL[i,v,t]
  //     }}}
  let WTTX: number[][][] = new Array(I).fill(0).map(() => new Array(V).fill(0).map(() => new Array(T).fill(0)));
  let TTWX: number[][][] = new Array(I).fill(0).map(() => new Array(V).fill(0).map(() => new Array(T).fill(0)));
  let QFUEL: number[][][] = new Array(I).fill(0).map(() => new Array(V).fill(0).map(() => new Array(T).fill(0)));

  for(let t = 0; t < T; t++){
    for(let v = 0; v < V; v++){
      for(let i = 0; i < I; i++){
        WTTX[i][v][t] = N[i][v][t] * (WTT[i] * EMI[t][i][esc - 1]) * E[i][v][t] / 10 ** 6;
        QFUEL[i][v][t] = N[i][v][t] * E[i][v][t] / 10 ** 6;
        TTWX[i][v][t] = TTW[i] * QFUEL[i][v][t];
      }
    }
  }

  // TEMPB1<- array(rep(0,T), dim=c(T))
  // TEMPB0<- array(rep(0,T), dim=c(T))
  // for(t in 1:T){
  //   for(v in 1:V){
  //     for(i in 1:I){
  //       TEMPB1[t] <- TEMPB1[t]+(WTTX[i,v,t]+TTWX[i,v,t])
  //       TEMPB0[t] <- TEMPB0[t]+N[i,v,t]*(WTT[1]*EMI[t,1,esc]+TTW[1])*E[1,v,1]
  //     }}}
  let TEMPB1: number[] = new Array(T).fill(0);
  let TEMPB0: number[] = new Array(T).fill(0);

  for(let t = 0; t < T; t++){
    for(let v = 0; v < V; v++){
      for(let i = 0; i < I; i++){
        TEMPB1[t] = TEMPB1[t] + (WTTX[i][v][t] + TTWX[i][v][t]);
        TEMPB0[t] = TEMPB0[t] + N[i][v][t] * (WTT[0] * EMI[t][0][esc - 1] + TTW[0]) * E[0][v][0] / 10 ** 6;
      }
    }
  }

  // SAVED2<- array(rep(0,T), dim=c(T))
  // for(t in 1:T){
  //   SAVED2[t]<-(REP)*(1-TEMPB1[t]/TEMPB0[t]);
  // }
  let SAVED2: number[] = new Array(T).fill(0);

  for(let t = 0; t < T; t++){
    SAVED2[t] = (REP) * (1 - TEMPB1[t] / TEMPB0[t]);
  }

  // N<-floor(N)
  // D<-floor(D)
  // G<-floor(G)
  // OLD<-floor(OLD)
  function floorThreeDArray(array: number[][][]): number[][][] {
    return array.map(iArray => 
        iArray.map(vArray => 
            vArray.map(tValue => Math.floor(tValue))
        )
    );
  }

  N = floorThreeDArray(N);
  D = floorThreeDArray(D);
  G = floorThreeDArray(G);
  OLD = floorThreeDArray(OLD);

  // CO2SAVED<- array(rep(0,T), dim=c(T))
  // for(t in 1:T){
  //   CO2SAVED[t]<-1-(1-SAVED1[t])*(1-SAVED2[t])
  // }
  const CO2SAVED: number[] = Array(T).fill(0);

  for(let t = 0; t < T; t++) {
    CO2SAVED[t] = 1 - (1 - SAVED1[t]) * (1 - SAVED2[t]);
  }

  // #############Otros calculos ###########

  // VFCX<- array(rep(0,I*V*T), dim=c(I,V,T))
  // TCX<- array(rep(0,I*V*T), dim=c(I,V,T))
  // VACX<- array(rep(0,I*V*T), dim=c(I,V,T))
  // for(v in 1:V){
  //   for(i in 1:I){
  //     for(t in 1:T){
        
  //       VFCX[i,v,t]<-N[i,v,t]*E[i,v,t]*((CF[i]/10^6)*(VFC[i]*IMP[i,t1])*(1+GR[esc,i])^t1)*(1/(1+INF[esc])^t)
  //       TCX[i,v,t] <-N[i,v,t]*E[i,v,t]*((CT/10^6)*(TRM/10^6)*min(1,t/tt)*(WTT[i]*EMI[t,i,esc]+TTW[i]))*(1/(1+INF[esc])^t)
  //       VACX[i,v,t]<-G[i,v,t]*A[i,v]*PASS[t,i,v]*((1+DEV[esc])^t)*(VAC[i])*(1/(1+INF[esc])^t)

  //     }}}
  const VFCX: number[][][] = new Array(I).fill(0).map(() => new Array(V).fill(0).map(() => new Array(T).fill(0)));
  const TCX: number[][][] = new Array(I).fill(0).map(() => new Array(V).fill(0).map(() => new Array(T).fill(0)));
  const VACX: number[][][] = new Array(I).fill(0).map(() => new Array(V).fill(0).map(() => new Array(T).fill(0)));

  for(let v = 0; v < V; v++){
    for(let i = 0; i < I; i++){
      for(let t = 0; t < T; t++){

        VFCX[i][v][t] = N[i][v][t] * E[i][v][t] * ((CF[i] / 10**6) * (VFC[i] * IMP[i][t]) * (1 + GR[i][esc - 1])**(t + 1)) * (1 / (1 + INF[esc - 1])**(t + 1));
        TCX[i][v][t] = N[i][v][t] * E[i][v][t] * ((CT / 10**6) * (TRM / 10**6) * Math.min(1, (t + 1) / tt) * (WTT[i] * EMI[t][i][esc - 1] + TTW[i])) * (1 / (1 + INF[esc - 1])**(t + 1));
        VACX[i][v][t] = G[i][v][t] * A[i][v] * PASS[t][i][v] * ((1 + DEV[esc - 1])**(t + 1)) * (VAC[i]) * (1 / (1 + INF[esc - 1])**(t + 1));
      }
    }
  }

  // Ahorros y Emisiones
  // // ######### Grafica 1 (Hoja 1) #######
  // gráfico de líneas misma gráfica

  // Ahorro por prácticas operativas y administrativas (operacional)
  // // SAVED1

  // Ahorro por componente de renovación tecnologica (renovación)
  // // SAVED2

  // Ahorro anual de emisiones (total)
  // // CO2SAVED


  // Emisiones
  // // ######### Grafica 2 (Hoja 1) #######
  // Gráfico de área

  // Well to tank
  // // WTTX

  // Tank to wheel
  // TTWX

  // Flota
  // ######### Grafica 3,4,5,6 (Hoja 2)#######

  // Gráfica doble comprados y desintegrados
  // Renovados
  // // G
  // Desintegrados
  // // D

  // Gráfico de barras
  // Flota actual
  // // N

  // Gráfico de barras
  // Flota vieja en el sistema
  // // OLD

  // Costos

  // // ######### Grafica 7 (Hoja 3) #######
  
  // Area chart
  // Ingresos por carbon tax
  // // TCX

  // Subsidio o penalización de combustible
  // // VFCX

  // Subsidio o penalización de los activos
  // // VACX

  // energía
  // // ######### Grafica 8,9,10,11 (Hoja 3)#######
  // Cantidad de energía necesaria para cada tipo
  // Column chart
  // // QFUEL
  // Sumar diesel para viejos y nuevos

  const resultObj = {
    SAVED1: SAVED1,
    SAVED2: SAVED2,
    CO2SAVED: CO2SAVED,
    WTTX: WTTX,
    TTWX: TTWX,
    N: N,
    G: G,
    D: D,
    OLD: OLD,
    TCX: TCX,
    VFCX: VFCX,
    VACX: VACX,
    QFUEL: QFUEL
  }

  return resultObj
}

export { transformData }