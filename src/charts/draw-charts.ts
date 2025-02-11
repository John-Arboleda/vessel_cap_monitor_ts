import { multipleAreaChart } from "./area-chart";
import { multipleColumnChart, sumColumnChart } from "./column-chart";
import { simpleLineChart } from "./line-chart";

import { createDataAreaEmis, createFleetByTech, dataPropNegative, maxValueVAxis, 
  createDataAreaCost, createDataTotalCost, dataSavedCO2, createDataQfuel, costNegObj } from "./chart-functions";

import { sellFleetOptions, buyFleetOptions, fleetOptions, emissionsOptions, 
  co2Options, dieselOptions, gasOptions, electricOptions, hydrogenOptions, 
  incomeOptions, spendingOptions, totalCostOptions } from "./chart-options";

interface ResultObj {
  SAVED1: number[],
  SAVED2: number[],
  CO2SAVED: number[],
  WTTX: number[][][],
  TTWX: number[][][],
  N: number[][][],
  G: number[][][],
  D: number[][][],
  OLD: number[][][],
  TCX: number[][][],
  VFCX: number[][][],
  VACX: number[][][],
  QFUEL: number[][][]
}

const techTypeHeader: string[] = ['Periodo', 'Diesel Actual', 'Diesel Nuevo', 'Gas', 'Eléctrico', 'Hidrógeno'];

function runEmissionCharts(resultObj: ResultObj) {
  google.charts.load('current', { packages: ['corechart', 'bar', 'table', 'controls'] });
  return new Promise<void>((resolve) => {
    google.charts.setOnLoadCallback(() => {
      drawEmissionsCharts(resultObj);
      resolve();
    });
  });
}

function drawEmissionsCharts(resultObj: ResultObj): void {

  // console.log(resultObj);
  
  const co2Header = ['Periodo', 'Operacional', 'Renovación', 'Total'];
  simpleLineChart(resultObj, dataSavedCO2, 'saved-co2', co2Options, co2Header)

  const emisHeader: string[] = ['Periodo', 'Well-to-Tank', 'Tank-to-Wheel']
  multipleAreaChart(resultObj, createDataAreaEmis, 'area_chart_div', 'emissions', emissionsOptions, emisHeader);

}

function runFleetCharts(resultObj: ResultObj) {
  google.charts.load('current', { packages: ['corechart', 'bar', 'table', 'controls'] });
  return new Promise<void>((resolve) => {
    google.charts.setOnLoadCallback(() => {
      drawFleetCharts(resultObj);
      resolve();
    });
  });
}

function drawFleetCharts(resultObj: ResultObj): void {

  const buyBody = createFleetByTech(resultObj.G);
  const sellBody = createFleetByTech(resultObj.D);

  const vAxisMaxValue = maxValueVAxis(buyBody, sellBody);
  sellFleetOptions.vAxis.minValue = -vAxisMaxValue;
  buyFleetOptions.vAxis.maxValue = vAxisMaxValue;

  const negPropD = dataPropNegative(resultObj.D);
  multipleColumnChart(resultObj.G, createFleetByTech, 'buy_column_chart', 'fleet', buyFleetOptions, techTypeHeader);

  multipleColumnChart(negPropD, createFleetByTech, 'sell_column_chart', 'fleet', sellFleetOptions, techTypeHeader);

  multipleColumnChart(resultObj.N, createFleetByTech, 'fleet_column_chart', 'fleet', fleetOptions, techTypeHeader);

  multipleColumnChart(resultObj.OLD, createFleetByTech, 'old_column_chart', 'fleet', fleetOptions, techTypeHeader);
}

function runCostsCharts(resultObj: ResultObj) {
  google.charts.load('current', { packages: ['corechart', 'bar', 'table', 'controls'] });
  return new Promise<void>((resolve) => {
    google.charts.setOnLoadCallback(() => {
      drawCostsCharts(resultObj);
      resolve();
    });
  });
}

function drawCostsCharts(resultObj: ResultObj): void {

  multipleAreaChart(resultObj, createDataTotalCost, 'cost_area_chart', 'costs', totalCostOptions, ['Periodo', 'Ingresos netos']);

  const costHeader: string[] = ['Periodo', 'Carbon Tax', 'Combustible', 'Activos']

  const postResultObj = costNegObj(resultObj, false);
  const negResultObj = costNegObj(resultObj, true);

  const incomeBody = createDataAreaCost(postResultObj);
  const spendingBody = createDataAreaCost(negResultObj);

  const vAxisMaxValue = maxValueVAxis(incomeBody, spendingBody);
  spendingOptions.vAxis.minValue = -vAxisMaxValue;
  incomeOptions.vAxis.maxValue = vAxisMaxValue;

  sumColumnChart(postResultObj, createDataAreaCost, 'income_area_chart', 'costs', incomeOptions, costHeader);
  sumColumnChart(negResultObj, createDataAreaCost, 'spending_area_chart', 'costs', spendingOptions, costHeader);
}

function runEnergyCharts(resultObj: ResultObj) {
  google.charts.load('current', { packages: ['corechart', 'bar', 'table', 'controls'] });
  return new Promise<void>((resolve) => {
    google.charts.setOnLoadCallback(() => {
      drawEnergyCharts(resultObj);
      resolve();
    });
  });
}

function drawEnergyCharts(resultObj: ResultObj): void {
  const vehHeader: string[] = ['Periodo', 'C2', 'C3S3'];
  multipleAreaChart(resultObj.QFUEL[0], createDataQfuel, 'current_diesel_area_chart', 'energy', dieselOptions, vehHeader);
  multipleAreaChart(resultObj.QFUEL[1], createDataQfuel, 'new_diesel_area_chart', 'energy', dieselOptions, vehHeader);
  multipleAreaChart(resultObj.QFUEL[2], createDataQfuel, 'gas_area_chart', 'energy', gasOptions, vehHeader);
  multipleAreaChart(resultObj.QFUEL[3], createDataQfuel, 'electric_area_chart', 'energy', electricOptions, vehHeader);
  multipleAreaChart(resultObj.QFUEL[4], createDataQfuel, 'hydrogen_area_chart', 'energy', hydrogenOptions, vehHeader);
}

const drawChartFunctions: { [prefixId: string]: (resultObj: ResultObj) => void } = {
  'emissions': runEmissionCharts,
  'fleet': runFleetCharts,
  'costs': runCostsCharts,
  'energy': runEnergyCharts
};

export { runEmissionCharts, runFleetCharts, runCostsCharts, runEnergyCharts, drawChartFunctions }