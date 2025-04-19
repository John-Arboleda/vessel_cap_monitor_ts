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

function multipleLineChart(
  dataObj: any,
  dataFunction: any,
  elementId: string,
  navPrefix: string,
  chartOptions: any, // Fix options interface
  header: string[]
): void {
  
  let { vesselKeys, sizeKeys } = resultNavbarState(navPrefix);
  
  let data = createDataTable(dataObj, dataFunction, header, vesselKeys, sizeKeys);

  const container = document.getElementById(elementId) as HTMLElement;

  const chart = new google.visualization.LineChart(container);

  let options = { ...chartOptions };

  const selectVessel = document.getElementById(navPrefix + '_select_tech') as HTMLSelectElement;
  const selectSize = document.getElementById(navPrefix + '_select_size') as HTMLSelectElement;

  function updateDataChart(){
    const techKeys: number[] = selectVessel.value.split("").map((a: String) => Number(a));
    const sizeKeys: number[] = selectSize.value.split("").map((a: String) => Number(a));
    data = createDataTable(dataObj, dataFunction, header, techKeys, sizeKeys);
    chart.draw(data, options);
  }

  selectVessel.addEventListener('change', updateDataChart);
  selectSize.addEventListener('change', updateDataChart);

  chart.draw(data, options);
}

export { multipleLineChart };