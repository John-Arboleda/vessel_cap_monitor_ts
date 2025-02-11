// # Parametros user

// TRM<-4000 # Dolar - COP
// CT<-200 # Tax carbon USD/ton
// tt<-10 # Periodo de instalacion del tax carbon

// rate<-0.2682 # Tasa del prestamo
// per<-5 # Años del prestamo
// LO <- c(0.10,0.90,0.00) # Porcentajes de los flujos del prestamo

// RN<-c(0.10,0.10) // Tasa de renovación

// Minimización de viajes vacíos
// eta<-1 # Ratio de implementacion viajes vacios


// lambda<- c(0,1,0,0) # Ratio implementacion politicas de consolidacion

// gamma<- c(0.09, 0.15,0.05) # Porcentajes de ahorro por mejoras 

// Top<-6 # Periodo maximo de implementacion de los ratios
// st <- 0 # Periodo inicio de implementacion de los ratios

// ti <- array(c(0,0,0,0,6,0,0,0,11,16), dim=c(I,V)) # Año inicio de disponibilidad technologia en mercado
// tf <- array(c(30,11,11,26,26,0,11,11,26,26), dim=c(I,V)) # Año fin de disponibilidad technologia en mercado
// VAC <- c(0,0.35,0.35,-0.35,-0.35) # Porcentaje de subsidio / Penalizacion activos

// tc1<-c(0,0,0,0,0)# Periodo inicio de subsidio combustible
// tc2<-c(1,5,5,5,5)# Periodo finalizacion de subsidio combustible
// VFC <- c(0,0.35,0.35,-0.35,-0.35) # Porcentaje de subsidio / Penalizacion combustible


const defaultValues = {
    ti: [
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 11],
      [6, 16]
    ],
    tf: [
      [0, 0],
      [11, 11],
      [11, 11],
      [26, 26],
      [26, 26]
    ],
    VAC: [0, 0.35, 0.35, -0.35, -0.35],
    VFC: [0.35, 0.35, 0.35, -0.35, -0.35],
    tc1: [0, 0, 0, 0, 0],
    tc2: [5, 5, 5, 5, 5],
    CT: 200,
    tt: 10,
    TRM: 4000,
    eta: 1,
    lambda: [0, 1, 0, 0],
    gamma: [0.09, 0.15, 0.05],
    Top: 6,
    st: 0,
    RN: [0.10, 0.10],
    LO: [0.10, 0.90, 0.00],
    rate: 0.2682,
    per: 5,
    agep: 20,
    scl: 100,
  }
  
  export { defaultValues }