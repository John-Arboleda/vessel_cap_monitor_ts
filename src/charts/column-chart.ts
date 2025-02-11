import { resultNavbarState } from "../components/navbar-results";

// interface DataObj {
//   WTTX: number[][][];
//   TTWX: number[][][];
// }

// Define an interface for the data function
// interface DataFunction {
//   (dataObj: DataObj): number[][];
//   (arg0: any, arg1: any, arg2: any): any;
// }

// Define an interface for the chart options
// interface ChartOptions {
//   chartArea: {
//       width: string;
//   };
//   hAxis: {
//       minValue: number | string | undefined;
//       title: string;
//       titleTextStyle: {
//           italic: boolean;
//       };
//   };
//   isStacked: boolean | "percent";
//   legend: {
//       position: string;
//       maxLines: number;
//   };
//   vAxis: {
//       title: string;
//       ticks: number[] | string |undefined;
//       titleTextStyle: {
//           italic: boolean;
//       };
//   };
// }

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

  if (percentText == 'Porcentajes') {
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

  let { percentText, techKeys, sizeKeys } = resultNavbarState(navPrefix);

  let data = createDataTable(dataObj, dataFunction, header, techKeys, sizeKeys);

  const container = document.getElementById(elementId) as HTMLElement;

  const chart = new google.visualization.ColumnChart(container);

  const percentButton = document.getElementById(navPrefix + '_percent_button') as HTMLButtonElement;

  const { minValue, maxValue } = chartOptions.vAxis;

  let options = setColumnOptions(chartOptions, percentText, minValue, maxValue);

  percentButton.addEventListener('click', () => {

    percentButton.innerHTML = options.isStacked == 'percent' ? 'Porcentajes' : 'Valores'
    
    options = setColumnOptions(chartOptions, percentButton.innerHTML, minValue, maxValue);
    
    chart.draw(data, options);
  });

  const select_technology = document.getElementById(navPrefix + '_select_tech') as HTMLSelectElement;
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

function createDataTable2(
  dataObj: any,
  dataFunction: any,
  header: string[],
  techKeys: number[] = [0, 1, 2, 3, 4],
  sizeKeys: number[] = [0, 1]
): google.visualization.DataTable {

  const dataRows = dataFunction(dataObj, techKeys, sizeKeys);

  const dataTable = new google.visualization.DataTable();

  header.forEach(columnName => {
    dataTable.addColumn('number', columnName);
  })

  dataTable.addRows(dataRows);

  return dataTable
}

function sumColumnChart(
  dataObj: any,
  dataFunction: any,
  elementId: string,
  navPrefix: string,
  chartOptions: any, // Fix options interface
  header: string[]
): void {

  let { percentText, techKeys, sizeKeys } = resultNavbarState(navPrefix);

  let data = createDataTable2(dataObj, dataFunction, header, techKeys, sizeKeys);

  const container = document.getElementById(elementId) as HTMLElement;

  const chart = new google.visualization.ColumnChart(container);

  const percentButton = document.getElementById(navPrefix + '_percent_button') as HTMLButtonElement;

  const { minValue, maxValue } = chartOptions.vAxis;

  let options = setColumnOptions(chartOptions, percentText, minValue, maxValue);
  
  percentButton.addEventListener('click', () => {
    
    percentButton.innerHTML = options.isStacked == 'percent' ? 'Porcentajes' : 'Valores'
    
    options = setColumnOptions(chartOptions, percentButton.innerHTML, minValue, maxValue);

    chart.draw(data, options);
  });

  const selectTechnology = document.getElementById(navPrefix + '_select_tech') as HTMLSelectElement;
  const selectSize = document.getElementById(navPrefix + '_select_size') as HTMLSelectElement;

  function updateDataChart(){
    const techKeys: number[] = selectTechnology.value.split("").map((a: String) => Number(a));
    const sizeKeys: number[] = selectSize.value.split("").map((a: String) => Number(a));
    data = createDataTable2(dataObj, dataFunction, header, techKeys, sizeKeys);
    chart.draw(data, options);
  }

  selectTechnology.addEventListener('change', updateDataChart);
  selectSize.addEventListener('change', updateDataChart);

  chart.draw(data, options);
}

export { multipleColumnChart, sumColumnChart }