
import { multipleColumnChart, multipleColumnChart4D } from "./column-chart";
import { multipleLineChart } from "./line-chart";

import { createDataFleet1Lines, createDataFleet2Lines, createGapBySize, sumPeriodRegions } from "./chart-functions";

import {  fleetOptions, lineChartOptions } from "./chart-options";

interface ResultObj {
  FLEET: number[][][],
  Z: number[][][],
  FLEET2: number[][][],
  Z2: number[][][],
  GAP: number[][][],
  GAP2: number[][][],
  Q3: number[][][][],
  X2: number[][][][],
}

const techTypeHeader: string[] = ['Year', 'Crude Tanker', 'Product Tanker', 'LNG', 'LPG', 'Bulker'];

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

  const fleetHeader: string[] = ['Year', 'FLEET', 'Z']

  multipleLineChart(resultObj, createDataFleet1Lines, 'area_chart_div', 'strategies', lineChartOptions, fleetHeader);
  multipleColumnChart(resultObj.GAP, createGapBySize, 'gap-strategies-chart', 'strategies', fleetOptions, techTypeHeader);
  multipleColumnChart4D(resultObj.X2, sumPeriodRegions, 'routes-strategies-chart', 'strategies', fleetOptions, techTypeHeader);
}


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

  const fleetHeader: string[] = ['Year', 'FLEET2', 'Z2'];

  multipleLineChart(resultObj, createDataFleet2Lines, 'fleet_capacity_chart_div', 'capacity', lineChartOptions, fleetHeader);
  multipleColumnChart(resultObj.GAP2, createGapBySize, 'gap_capacity_chart', 'capacity', fleetOptions, techTypeHeader);
  multipleColumnChart4D(resultObj.Q3, sumPeriodRegions, 'routes-capacity-chart', 'capacity', fleetOptions, techTypeHeader);
}

const drawChartFunctions: { [prefixId: string]: (resultObj: ResultObj) => void } = {
  'strategies': runFleetStrategiesCharts,
  'capacity': runFleetCapacityCharts,
};

export { runFleetStrategiesCharts, drawChartFunctions }