
const lineChartOptions = {
    chartArea: { width: '75%' },
    legend: {position: 'bottom', maxLines: 3},
    hAxis: {
      //minValue: 'auto',
      title: 'Period (years)',
      titleTextStyle: {
        italic: false,
      },
      format: '####',
    },
    vAxis: {
      title: 'Fleet (number of vessels)',
      ticks: 'auto',
      titleTextStyle: {
        italic: false,
      },
    },
  }
  
  const fleetOptions = {
    chartArea: { width: '75%' },
    hAxis: {
      minValue: 'auto',
      title: 'Period (years)',
      titleTextStyle: {
        italic: false,
      },
      format: '####',
    },
    isStacked: true,
    legend: {position: 'bottom', maxLines: 3},
    vAxis: {
      title: 'Number of vessels',
      ticks: 'auto',
      titleTextStyle: {
        italic: false,
      },
      minValue: 'auto',
      mixValue: 'auto',
    },
    annotations: {
      alwaysOutside: false,
      textStyle: {
        fontSize: 8,
        color: '#000',
        // auraColor: '#888'
      },
      stem: {
        length: 0,
      }
    },
  };
  

  
  export { fleetOptions, lineChartOptions }