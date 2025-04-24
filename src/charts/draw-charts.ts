
import { multipleColumnChart4D } from "./column-chart";
import { multipleLineChart } from "./line-chart";

import { createDataFleet1Lines, createDataFleet2Lines, createDataFleet3Lines, sumPeriodRegions } from "./chart-functions";

import {  lineVesselOptions, columnVesselOptions, lineCapacityOptions, 
  columnCapacityOptions, lineProductivityOptions, columnProductivityOptions } from "./chart-options";

interface ResultObj {
  FLEET1: number[][][][],
  FLEET2: number[][][][],
  FLEET3: number[][][][],
  Z1: number[][][][],
  Z2: number[][][][],
  Z3: number[][][][],
  GAP: number[][][][],
  GAP2: number[][][][],
  GAP3: number[][][][],
}

const techTypeHeader: string[] = ['Year', 'Crude Tanker', 'Product Tanker', 'LNG', 'LPG', 'Bulker'];

function runFleetVesselsCharts(resultObj: ResultObj) {
  google.charts.load('current', { packages: ['corechart', 'bar', 'table', 'controls'] });
  return new Promise<void>((resolve) => {
    google.charts.setOnLoadCallback(() => {
      drawFleetVesselsChart(resultObj);
      resolve();
    });
  });
}

function drawFleetVesselsChart(resultObj: ResultObj): void {

  const fleetHeader: string[] = ['Year', 'FLEET1', 'Z1']

  multipleLineChart(resultObj, createDataFleet1Lines, 'vessels_line_chart_div', 'vessels', lineVesselOptions, fleetHeader);
  multipleColumnChart4D(resultObj.GAP, sumPeriodRegions, 'vessels_gap_chart_div', 'vessels', columnVesselOptions, techTypeHeader);
  multipleColumnChart4D(resultObj.Z1, sumPeriodRegions, 'vessels_column_chart_div', 'vessels', columnVesselOptions, techTypeHeader);
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

  multipleLineChart(resultObj, createDataFleet2Lines, 'capacity_line_chart_div', 'capacity', lineCapacityOptions, fleetHeader);
  multipleColumnChart4D(resultObj.GAP2, sumPeriodRegions, 'capacity_gap_chart_div', 'capacity', columnCapacityOptions, techTypeHeader);
  multipleColumnChart4D(resultObj.Z2, sumPeriodRegions, 'capacity_column_chart_div', 'capacity', columnCapacityOptions, techTypeHeader);
}


function runFleetProductivityCharts(resultObj: ResultObj) {
  google.charts.load('current', { packages: ['corechart', 'bar', 'table', 'controls'] });
  return new Promise<void>((resolve) => {
    google.charts.setOnLoadCallback(() => {
      drawFleetProductivityChart(resultObj);
      resolve();
    });
  });
}

function drawFleetProductivityChart(resultObj: ResultObj): void {

  const fleetHeader: string[] = ['Year', 'FLEET3', 'Z3'];

  multipleLineChart(resultObj, createDataFleet3Lines, 'productivity_line_chart_div', 'productivity', lineProductivityOptions, fleetHeader);
  multipleColumnChart4D(resultObj.GAP3, sumPeriodRegions, 'productivity_gap_chart_div', 'productivity', columnProductivityOptions, techTypeHeader);
  multipleColumnChart4D(resultObj.Z3, sumPeriodRegions, 'productivity_column_chart_div', 'productivity', columnProductivityOptions, techTypeHeader);
}

const drawChartFunctions: { [prefixId: string]: (resultObj: ResultObj) => void } = {
  'vessels': runFleetVesselsCharts,
  'capacity': runFleetCapacityCharts,
  'productivity': runFleetProductivityCharts,
};

export { runFleetVesselsCharts, drawChartFunctions }