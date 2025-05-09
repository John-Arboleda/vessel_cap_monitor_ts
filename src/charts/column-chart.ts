import { resultNavbarState } from "../components/navbar-results";
import { updateRoute } from "../components/result-input-route";
import { vesselData } from "../logic/data";

function createDataTable(
  dataObjProp: number[][][],
  dataFunction: any,
  header: string[],
  techKeys: number[] = [0, 1, 2, 3, 4],
  sizeKeys: number[] = [0, 1]
): google.visualization.DataTable {

  const dataRows = dataFunction(dataObjProp, techKeys, sizeKeys);

  const dataTable = new google.visualization.DataTable();

  const [ period, ...keys ] = header;

  const filteredKeys = techKeys.map((k: number) => keys[k]);

  [ period, ...filteredKeys ].forEach(columnName => {
    dataTable.addColumn('number', columnName);
  })

  dataTable.addRows(dataRows);

  return dataTable
}

function setColumnOptions(chartOptions: any, percentText: string, minValue: number, maxValue: number){

  const options = { ...chartOptions }

  if (percentText == 'Percentage') {
    options.isStacked = true;
    options.vAxis.minValue = minValue;
    options.vAxis.maxValue = maxValue;
  } else {
    options.isStacked = 'percent';
    options.vAxis.minValue = 0;
    options.vAxis.maxValue = 0;
  }

  return options;
}

function multipleColumnChart(
  dataObj: number[][][],
  dataFunction: any,
  elementId: string,
  navPrefix: string,
  chartOptions: any, // Fix options interface
  header: string[]
): void {

  let { percentText, vesselKeys, sizeKeys } = resultNavbarState(navPrefix);

  let data = createDataTable(dataObj, dataFunction, header, vesselKeys, sizeKeys);

  const container = document.getElementById(elementId) as HTMLElement;

  const chart = new google.visualization.ColumnChart(container);

  const percentButton = document.getElementById(navPrefix + '_percent_button') as HTMLButtonElement;

  const { minValue, maxValue } = chartOptions.vAxis;

  let options = setColumnOptions(chartOptions, percentText, minValue, maxValue);

  percentButton.addEventListener('click', () => {

    percentButton.innerHTML = options.isStacked == 'percent' ? 'Percentage' : 'Values'
    
    options = setColumnOptions(chartOptions, percentButton.innerHTML, minValue, maxValue);
    
    chart.draw(data, options);
  });

  const select_technology = document.getElementById(navPrefix + '_select_vessel') as HTMLSelectElement;
  const select_size = document.getElementById(navPrefix + '_select_size') as HTMLSelectElement;

  function updateDataChart(){
    const techKeys: number[] = select_technology.value.split("").map((a: String) => Number(a));
    const sizeKeys: number[] = select_size.value.split("").map((a: String) => Number(a));
    data = createDataTable(dataObj, dataFunction, header, techKeys, sizeKeys);
    chart.draw(data, options);
  }

  select_technology.addEventListener('change', updateDataChart);
  select_size.addEventListener('change', updateDataChart);

  chart.draw(data, options);
}

function createDataTable3(
  dataObjProp: number[][][][],
  dataFunction: any,
  header: string[],
  routeKeys: number[],
  techKeys: number[] = [0, 1, 2, 3, 4],
  sizeKeys: number[] = [0, 1, 2, 3, 4]
): google.visualization.DataTable {

  const dataRows = dataFunction(dataObjProp, routeKeys, techKeys, sizeKeys);

  // console.log(routeKeys);

  const dataTable = new google.visualization.DataTable();

  const [ period, ...keys ] = header;

  const filteredKeys = techKeys.map((k: number) => keys[k]);

  [ period, ...filteredKeys ].forEach(columnName => {
    dataTable.addColumn('number', columnName);
  })

  dataTable.addRows(dataRows);

  return dataTable
}

function createDataTable4(
  dataObjProp: number[][][][],
  dataFunction: any,
  header: string[],
  routeKeys: number[],
  vesselKeys: number[] = [0, 1, 2, 3, 4],
  sizeKeys: number[] = [0, 1, 2, 3, 4]
): google.visualization.DataTable {

  const dataRows = dataFunction(dataObjProp, routeKeys, vesselKeys, sizeKeys);

  const dataTable = new google.visualization.DataTable();

  const [ period, ...keys ] = header;

  const filteredKeys = sizeKeys.map((k: number) => keys[k]);

  [ period, ...filteredKeys ].forEach(columnName => {
    dataTable.addColumn('number', columnName);
  })

  dataTable.addRows(dataRows);

  return dataTable
}

function multipleColumnChart4D(
  dataObj: number[][][][],
  dataFunction: any,
  elementId: string,
  navPrefix: string,
  chartOptions: any, // Fix options interface
  header: string[]
): void {

  let { percentText, vesselKeys, sizeKeys, routesKeys } = resultNavbarState(navPrefix);

  let data = createDataTable3(dataObj, dataFunction, header, routesKeys, vesselKeys, sizeKeys);

  const container = document.getElementById(elementId) as HTMLElement;

  const chart = new google.visualization.ColumnChart(container);

  const percentButton = document.getElementById(navPrefix + '_percent_button') as HTMLButtonElement;

  const { minValue, maxValue } = chartOptions.vAxis;

  let options = setColumnOptions(chartOptions, percentText, minValue, maxValue);

  percentButton.addEventListener('click', () => {

    percentButton.innerHTML = options.isStacked == 'percent' ? 'Percentage' : 'Values'
    
    options = setColumnOptions(chartOptions, percentButton.innerHTML, minValue, maxValue);
    
    chart.draw(data, options);
  });

  const select_technology = document.getElementById(navPrefix + '_select_vessel') as HTMLSelectElement;
  const select_size = document.getElementById(navPrefix + '_select_size') as HTMLSelectElement;
  const origin_select = document.getElementById(navPrefix + '_select_region_origin') as HTMLSelectElement;
  const destination_select = document.getElementById(navPrefix + '_select_region_dest') as HTMLSelectElement;

  function updateDataChart(){
    const techKeys: number[] = select_technology.value.split("").map((a: String) => Number(a));
    const sizeKeys: number[] = select_size.value.split("").map((a: String) => Number(a));
    const routesKeys: number[] = updateRoute(origin_select.value, destination_select.value);
    data = createDataTable3(dataObj, dataFunction, header, routesKeys, techKeys, sizeKeys);
    chart.draw(data, options);
  }

  select_technology.addEventListener('change', updateDataChart);
  select_size.addEventListener('change', updateDataChart);
  origin_select.addEventListener('change', updateDataChart);
  destination_select .addEventListener('change', updateDataChart);

  chart.draw(data, options);
}

function multipleColumnChartSizes(
  dataObj: number[][][][],
  vesselFunction: any,
  sizeFunction: any,
  elementId: string,
  navPrefix: string,
  chartOptions: any, // Fix options interface
  vesselHeader: string[]
): void {

  let { percentText, vesselKeys, sizeKeys, routesKeys } = resultNavbarState(navPrefix);

  // let data = createDataTable3(dataObj, vesselFunction, vesselHeader, routesKeys, vesselKeys, sizeKeys);
  let data: any

  if (vesselKeys.length > 1){
    data = createDataTable3(dataObj, vesselFunction, vesselHeader, routesKeys, vesselKeys, sizeKeys);
  } else {
    const vesselSizes: string[] = vesselData[vesselKeys[0]]["sizes"]
    const sizeHeader: string[] = ['Year', ...vesselSizes]
    data = createDataTable4(dataObj, sizeFunction, sizeHeader, routesKeys, vesselKeys, sizeKeys);
  }

  const container = document.getElementById(elementId) as HTMLElement;

  const chart = new google.visualization.ColumnChart(container);

  const percentButton = document.getElementById(navPrefix + '_percent_button') as HTMLButtonElement;

  const { minValue, maxValue } = chartOptions.vAxis;

  let options = setColumnOptions(chartOptions, percentText, minValue, maxValue);

  percentButton.addEventListener('click', () => {

    percentButton.innerHTML = options.isStacked == 'percent' ? 'Percentage' : 'Values'
    
    options = setColumnOptions(chartOptions, percentButton.innerHTML, minValue, maxValue);
    
    chart.draw(data, options);
  });

  const select_vessel = document.getElementById(navPrefix + '_select_vessel') as HTMLSelectElement;
  const select_size = document.getElementById(navPrefix + '_select_size') as HTMLSelectElement;
  const origin_select = document.getElementById(navPrefix + '_select_region_origin') as HTMLSelectElement;
  const destination_select = document.getElementById(navPrefix + '_select_region_dest') as HTMLSelectElement;

  function updateDataChart(){
    const vesselKeys: number[] = select_vessel.value.split("").map((a: String) => Number(a));
    const sizeKeys: number[] = select_size.value.split("").map((a: String) => Number(a));
    const routesKeys: number[] = updateRoute(origin_select.value, destination_select.value);
    if (vesselKeys.length > 1){
      data = createDataTable3(dataObj, vesselFunction, vesselHeader, routesKeys, vesselKeys, sizeKeys);
    } else {
      const vesselSizes: string[] = vesselData[vesselKeys[0]]["sizes"]
      const sizeHeader: string[] = ['Year', ...vesselSizes]
      data = createDataTable4(dataObj, sizeFunction, sizeHeader, routesKeys, vesselKeys, sizeKeys);
    }
    chart.draw(data, options);
  }

  select_vessel.addEventListener('change', updateDataChart);
  select_size.addEventListener('change', updateDataChart);
  origin_select.addEventListener('change', updateDataChart);
  destination_select .addEventListener('change', updateDataChart);
  window.addEventListener('resize', updateDataChart);

  chart.draw(data, options);
}


export { multipleColumnChart, multipleColumnChart4D, multipleColumnChartSizes }