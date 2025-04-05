import { multipleAreaChart } from "./area-chart";
import { multipleColumnChart, sumColumnChart } from "./column-chart";
import { multipleLineChart } from "./line-chart";

import { createDataFleet1Lines, createDataFleet2Lines, createGapBySize, dataPropNegative, maxValueVAxis, 
  createDataAreaCost, createDataTotalCost, createDataQfuel, costNegObj } from "./chart-functions";

import { sellFleetOptions, buyFleetOptions, fleetOptions, emissionsOptions, 
  co2Options, dieselOptions, gasOptions, electricOptions, hydrogenOptions, 
  incomeOptions, spendingOptions, totalCostOptions } from "./chart-options";

interface ResultObj {
  // SAVED1: number[],
  // SAVED2: number[],
  // CO2SAVED: number[],
  // WTTX: number[][][],
  // TTWX: number[][][],
  // N: number[][][],
  // G: number[][][],
  // D: number[][][],
  // OLD: number[][][],
  // TCX: number[][][],
  // VFCX: number[][][],
  // VACX: number[][][],
  // QFUEL: number[][][],
  FLEET: number[][][],
  Z: number[][][],
  FLEET2: number[][][],
  Z2: number[][][],
  GAP: number[][][],
  GAP2: number[][][],
  Q3: number[][][][],
  X2: number[][][][],
}

const techTypeHeader: string[] = ['Periodo', 'Diesel Actual', 'Diesel Nuevo', 'Gas', 'Eléctrico', 'Hidrógeno'];

function runFleetStrategiesCharts(resultObj: ResultObj) {
  google.charts.load('current', { packages: ['corechart', 'bar', 'table', 'controls'] });
  return new Promise<void>((resolve) => {
    google.charts.setOnLoadCallback(() => {
      drawFleetStrategiesChart(resultObj);
      resolve();
    });
  });
}

function drawFleetStrategiesChart(resultObj: ResultObj): void {

  const emisHeader: string[] = ['Periodo', 'Well-to-Tank', 'Tank-to-Wheel']

  multipleLineChart(resultObj, createDataFleet1Lines, 'area_chart_div', 'strategies', emissionsOptions, emisHeader);
  multipleColumnChart(resultObj.GAP, createGapBySize, 'gap-strategies-chart', 'strategies', fleetOptions, techTypeHeader);

}

// function runFleetCharts(resultObj: ResultObj) {
//   google.charts.load('current', { packages: ['corechart', 'bar', 'table', 'controls'] });
//   return new Promise<void>((resolve) => {
//     google.charts.setOnLoadCallback(() => {
//       drawFleetCharts(resultObj);
//       resolve();
//     });
//   });
// }

// function drawFleetCharts(resultObj: ResultObj): void {

//   const buyBody = createFleetByTech(resultObj.G);
//   const sellBody = createFleetByTech(resultObj.D);

//   const vAxisMaxValue = maxValueVAxis(buyBody, sellBody);
//   sellFleetOptions.vAxis.minValue = -vAxisMaxValue;
//   buyFleetOptions.vAxis.maxValue = vAxisMaxValue;

//   const negPropD = dataPropNegative(resultObj.D);
//   multipleColumnChart(resultObj.G, createFleetByTech, 'buy_column_chart', 'capacity', buyFleetOptions, techTypeHeader);

//   multipleColumnChart(negPropD, createFleetByTech, 'sell_column_chart', 'capacity', sellFleetOptions, techTypeHeader);

//   multipleColumnChart(resultObj.N, createFleetByTech, 'fleet_column_chart', 'capacity', fleetOptions, techTypeHeader);

//   multipleColumnChart(resultObj.OLD, createFleetByTech, 'old_column_chart', 'capacity', fleetOptions, techTypeHeader);
// }

// function runCostsCharts(resultObj: ResultObj) {
//   google.charts.load('current', { packages: ['corechart', 'bar', 'table', 'controls'] });
//   return new Promise<void>((resolve) => {
//     google.charts.setOnLoadCallback(() => {
//       drawCostsCharts(resultObj);
//       resolve();
//     });
//   });
// }

// function drawCostsCharts(resultObj: ResultObj): void {

//   multipleAreaChart(resultObj, createDataTotalCost, 'cost_area_chart', 'costs', totalCostOptions, ['Periodo', 'Ingresos netos']);

//   const costHeader: string[] = ['Periodo', 'Carbon Tax', 'Combustible', 'Activos']

//   const postResultObj = costNegObj(resultObj, false);
//   const negResultObj = costNegObj(resultObj, true);

//   const incomeBody = createDataAreaCost(postResultObj);
//   const spendingBody = createDataAreaCost(negResultObj);

//   const vAxisMaxValue = maxValueVAxis(incomeBody, spendingBody);
//   spendingOptions.vAxis.minValue = -vAxisMaxValue;
//   incomeOptions.vAxis.maxValue = vAxisMaxValue;

//   sumColumnChart(postResultObj, createDataAreaCost, 'income_area_chart', 'costs', incomeOptions, costHeader);
//   sumColumnChart(negResultObj, createDataAreaCost, 'spending_area_chart', 'costs', spendingOptions, costHeader);
// }

function runFleetCapacityCharts(resultObj: ResultObj) {
  google.charts.load('current', { packages: ['corechart', 'bar', 'table', 'controls'] });
  return new Promise<void>((resolve) => {
    google.charts.setOnLoadCallback(() => {
      drawFleetCapacityChart(resultObj);
      resolve();
    });
  });
}

function drawFleetCapacityChart(resultObj: ResultObj): void {

  const emisHeader: string[] = ['Periodo', 'Well-to-Tank', 'Tank-to-Wheel']
  multipleLineChart(resultObj, createDataFleet2Lines, 'fleet_capacity_chart_div', 'capacity', emissionsOptions, emisHeader);
  multipleColumnChart(resultObj.GAP2, createGapBySize, 'gap_capacity_chart', 'capacity', fleetOptions, techTypeHeader);
}

// function runEnergyCharts(resultObj: ResultObj) {
//   google.charts.load('current', { packages: ['corechart', 'bar', 'table', 'controls'] });
//   return new Promise<void>((resolve) => {
//     google.charts.setOnLoadCallback(() => {
//       drawEnergyCharts(resultObj);
//       resolve();
//     });
//   });
// }

// function drawEnergyCharts(resultObj: ResultObj): void {
//   const vehHeader: string[] = ['Periodo', 'C2', 'C3S3'];
//   multipleAreaChart(resultObj.QFUEL[0], createDataQfuel, 'current_diesel_area_chart', 'energy', dieselOptions, vehHeader);
//   multipleAreaChart(resultObj.QFUEL[1], createDataQfuel, 'new_diesel_area_chart', 'energy', dieselOptions, vehHeader);
//   multipleAreaChart(resultObj.QFUEL[2], createDataQfuel, 'gas_area_chart', 'energy', gasOptions, vehHeader);
//   multipleAreaChart(resultObj.QFUEL[3], createDataQfuel, 'electric_area_chart', 'energy', electricOptions, vehHeader);
//   multipleAreaChart(resultObj.QFUEL[4], createDataQfuel, 'hydrogen_area_chart', 'energy', hydrogenOptions, vehHeader);
// }

const drawChartFunctions: { [prefixId: string]: (resultObj: ResultObj) => void } = {
  'strategies': runFleetStrategiesCharts,
  'capacity': runFleetCapacityCharts,
  // 'costs': runCostsCharts,
  // 'energy': runEnergyCharts
};

export { runFleetStrategiesCharts, drawChartFunctions }