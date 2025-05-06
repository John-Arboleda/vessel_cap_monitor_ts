import { resultNavbarState } from "../components/navbar-results";
import { updateRoute } from "../components/result-input-route";

function createDataTable(
  dataObj: any,
  dataFunction: any,
  header: string[],
  routeKeys: number[],
  vesselKeys: number[] = [0, 1, 2, 3, 4],
  sizeKeys: number[] = [0, 1, 2, 3, 4]
): google.visualization.DataTable {

  const dataRows = dataFunction(dataObj, routeKeys, vesselKeys, sizeKeys);

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
  
  let { vesselKeys, sizeKeys, routesKeys } = resultNavbarState(navPrefix);
  
  let data = createDataTable(dataObj, dataFunction, header, routesKeys, vesselKeys, sizeKeys);

  const container = document.getElementById(elementId) as HTMLElement;

  const chart = new google.visualization.LineChart(container);

  let options = { ...chartOptions };

  const selectVessel = document.getElementById(navPrefix + '_select_vessel') as HTMLSelectElement;
  const selectSize = document.getElementById(navPrefix + '_select_size') as HTMLSelectElement;
  const origin_select = document.getElementById(navPrefix + '_select_region_origin') as HTMLSelectElement;
  const destination_select = document.getElementById(navPrefix + '_select_region_dest') as HTMLSelectElement;

  function updateDataChart(){
    const techKeys: number[] = selectVessel.value.split("").map((a: String) => Number(a));
    const sizeKeys: number[] = selectSize.value.split("").map((a: String) => Number(a));
    const routesKeys: number[] = updateRoute(origin_select.value, destination_select.value);
    data = createDataTable(dataObj, dataFunction, header, routesKeys, techKeys, sizeKeys);
    
    chart.draw(data, options);
  }

  selectVessel.addEventListener('change', updateDataChart);
  selectSize.addEventListener('change', updateDataChart);
  origin_select.addEventListener('change', updateDataChart);
  destination_select .addEventListener('change', updateDataChart);
  window.addEventListener('resize', updateDataChart);

  chart.draw(data, options);
}

export { multipleLineChart };