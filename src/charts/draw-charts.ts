
import { multipleColumnChartSizes } from "./column-chart";
import { multipleLineChart } from "./line-chart";

import { createDataFleet1Lines, createDataFleet2Lines, createDataFleet3Lines, sumPeriodRegionsByVessel,
   sumPeriodRegionsBySize } from "./chart-functions";

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

const vesselTypeHeader: string[] = ['Year', 'Crude Tanker', 'Product Tanker', 'LNG', 'LPG', 'Bulker'];
const aggregateHeader: string[] = ['Year', 'Shipping supply', 'Shipping demand'];

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

  multipleLineChart(resultObj, createDataFleet1Lines, 'vessels_line_chart_div', 'vessels', lineVesselOptions, aggregateHeader);
  multipleColumnChartSizes(resultObj.GAP, sumPeriodRegionsByVessel, sumPeriodRegionsBySize, 'vessels_gap_chart_div', 'vessels', columnVesselOptions, vesselTypeHeader);
  multipleColumnChartSizes(resultObj.Z1, sumPeriodRegionsByVessel, sumPeriodRegionsBySize, 'vessels_column_chart_div', 'vessels', columnVesselOptions, vesselTypeHeader);
  // multipleColumnChart4D(resultObj.GAP, sumPeriodRegionsByVessel, 'vessels_gap_chart_div', 'vessels', columnVesselOptions, vesselTypeHeader);
  // multipleColumnChart4D(resultObj.Z1, sumPeriodRegionsByVessel, 'vessels_column_chart_div', 'vessels', columnVesselOptions, vesselTypeHeader);
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

  multipleLineChart(resultObj, createDataFleet2Lines, 'capacity_line_chart_div', 'capacity', lineCapacityOptions, aggregateHeader);
  multipleColumnChartSizes(resultObj.GAP2, sumPeriodRegionsByVessel, sumPeriodRegionsBySize, 'capacity_gap_chart_div', 'capacity', columnCapacityOptions, vesselTypeHeader);
  multipleColumnChartSizes(resultObj.Z2, sumPeriodRegionsByVessel, sumPeriodRegionsBySize, 'capacity_column_chart_div', 'capacity', columnCapacityOptions, vesselTypeHeader);
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

  multipleLineChart(resultObj, createDataFleet3Lines, 'productivity_line_chart_div', 'productivity', lineProductivityOptions, aggregateHeader);
  multipleColumnChartSizes(resultObj.GAP3, sumPeriodRegionsByVessel, sumPeriodRegionsBySize, 'productivity_gap_chart_div', 'productivity', columnProductivityOptions, vesselTypeHeader);
  multipleColumnChartSizes(resultObj.Z3, sumPeriodRegionsByVessel, sumPeriodRegionsBySize, 'productivity_column_chart_div', 'productivity', columnProductivityOptions, vesselTypeHeader);
}

const drawChartFunctions: { [prefixId: string]: (resultObj: ResultObj) => void } = {
  'vessels': runFleetVesselsCharts,
  'capacity': runFleetCapacityCharts,
  'productivity': runFleetProductivityCharts,
};

export { runFleetVesselsCharts, drawChartFunctions }