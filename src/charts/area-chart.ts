import { resultNavbarState } from "../components/navbar-results";


function createDataTable(
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

function setAreaOptions(chartOptions: any, percentText: string){

  const options = { ...chartOptions }

  if (percentText == 'Porcentajes') {
    options.isStacked = true;
    options.vAxis.ticks = 'auto';
  } else {
    options.isStacked = 'percent';
    options.vAxis.ticks = [0, 0.25, 0.50, 0.75, 1];
  }

  return options;
}

function multipleAreaChart(
  dataObj: any,
  dataFunction: any,
  elementId: string,
  navPrefix: string,
  chartOptions: any, // Fix options interface
  header: string[]
): void {
  
  let { percentText, techKeys, sizeKeys } = resultNavbarState(navPrefix);
  
  let data = createDataTable(dataObj, dataFunction, header, techKeys, sizeKeys);

  const container = document.getElementById(elementId) as HTMLElement;

  const chart = new google.visualization.AreaChart(container);

  const percentButton = document.getElementById(navPrefix + '_percent_button') as HTMLButtonElement;

  let options = setAreaOptions(chartOptions, percentText);

  percentButton.addEventListener('click', () => {

    percentButton.innerHTML = options.isStacked == 'percent' ? 'Porcentajes' : 'Valores'
    
    options = setAreaOptions(chartOptions, percentButton.innerHTML);

    chart.draw(data, options);
  });

  const selectTechnology = document.getElementById(navPrefix + '_select_tech') as HTMLSelectElement;
  const selectSize = document.getElementById(navPrefix + '_select_size') as HTMLSelectElement;

  function updateDataChart(){
    const techKeys: number[] = selectTechnology.value.split("").map((a: String) => Number(a));
    const sizeKeys: number[] = selectSize.value.split("").map((a: String) => Number(a));
    data = createDataTable(dataObj, dataFunction, header, techKeys, sizeKeys);
    chart.draw(data, options);
  }

  selectTechnology.addEventListener('change', updateDataChart);
  selectSize.addEventListener('change', updateDataChart);

  chart.draw(data, options);
}

export { multipleAreaChart }