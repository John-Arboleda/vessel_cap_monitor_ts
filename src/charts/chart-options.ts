
const lineVesselOptions = {
    chartArea: { width: '75%' },
    legend: {position: 'bottom', maxLines: 3},
    hAxis: {
      //minValue: 'auto',
      title: 'Years',
      titleTextStyle: {
        italic: false,
      },
      format: '####',
    },
    vAxis: {
      title: 'Number of vessels',
      ticks: 'auto',
      titleTextStyle: {
        italic: false,
      },
    },
  }
  
  const columnVesselOptions = {
    chartArea: { width: '75%' },
    hAxis: {
      minValue: 'auto',
      title: 'Years',
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
  
  const lineCapacityOptions = {
    chartArea: { width: '75%' },
    legend: {position: 'bottom', maxLines: 3},
    hAxis: {
      //minValue: 'auto',
      title: 'Years',
      titleTextStyle: {
        italic: false,
      },
      format: '####',
    },
    vAxis: {
      title: '10^6 tonnes',
      ticks: 'auto',
      titleTextStyle: {
        italic: false,
      },
    },
  }
  
  const columnCapacityOptions = {
    chartArea: { width: '75%' },
    hAxis: {
      minValue: 'auto',
      title: 'Years',
      titleTextStyle: {
        italic: false,
      },
      format: '####',
    },
    isStacked: true,
    legend: {position: 'bottom', maxLines: 3},
    vAxis: {
      title: '10^6 tonnes',
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

  const lineProductivityOptions = {
    chartArea: { width: '75%' },
    legend: {position: 'bottom', maxLines: 3},
    hAxis: {
      //minValue: 'auto',
      title: 'Years',
      titleTextStyle: {
        italic: false,
      },
      format: '####',
    },
    vAxis: {
      title: '10^12  tonnes-miles',
      ticks: 'auto',
      titleTextStyle: {
        italic: false,
      },
    },
  }
  
  const columnProductivityOptions = {
    chartArea: { width: '75%' },
    hAxis: {
      minValue: 'auto',
      title: 'Years',
      titleTextStyle: {
        italic: false,
      },
      format: '####',
    },
    isStacked: true,
    legend: {position: 'bottom', maxLines: 3},
    vAxis: {
      title: '10^12  tonnes-miles',
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
  
  export { lineVesselOptions, columnVesselOptions, lineCapacityOptions, columnCapacityOptions, lineProductivityOptions, columnProductivityOptions }