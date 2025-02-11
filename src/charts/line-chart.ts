
function createDataTable(
    dataObj: any,
    dataFunction: any,
    header: string[],
    // techKeys: number[] = [0, 1, 2, 3, 4],
    // sizeKeys: number[] = [0, 1]
  ): google.visualization.DataTable {
  
    //const dataRows = dataFunction(dataObj, techKeys, sizeKeys);
    const dataRows = dataFunction(dataObj);
  
    const dataTable = new google.visualization.DataTable();
  
    header.forEach(columnName => {
      dataTable.addColumn('number', columnName);
    })
  
    dataTable.addRows(dataRows);
  
    return dataTable
  }
  
  
  function simpleLineChart(
    dataObj: any,
    dataFunction: any,
    id_element: string,
    chartOptions: any,
    header: string[]
  ) {
  
    // const arrSavedCO2: (number|Date)[][] = dataFunction(dataObj);
  
    // const dataArr: (string|number|Date)[][] = [
    //   header, ...arrSavedCO2
    // ]
  
    // const dataTable = google.visualization.arrayToDataTable(dataArr);
    const dataTable = createDataTable(dataObj, dataFunction, header);
  
    const container = document.getElementById(id_element) as HTMLElement;
  
    const chart = new google.visualization.LineChart(container);
  
    chart.draw(dataTable, chartOptions);
  }
  
  export { simpleLineChart };