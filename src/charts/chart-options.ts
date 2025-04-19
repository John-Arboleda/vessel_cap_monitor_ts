
const co2Options = {
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
  
  const emissionsOptions: any = {
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
      title: 'Fleet (Number of vessels)',
      ticks: 'auto',
      titleTextStyle: {
        italic: false,
      }
    },
  };
  
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
  
  const buyFleetOptions = {
    chartArea: { width: '75%', height: 200, top: 100 },
    hAxis: {
      minValue: 'auto',
      // title: 'Periodo (años)',
      titleTextStyle: {
        italic: false,
      },
      textPosition: 'none',
      format: '####',
    },
    isStacked: true,
    legend: {position: 'none', maxLines: 3},
    vAxis: {
      title: 'Número de vehículos\nincorporados',
      ticks: 'auto',
      titleTextStyle: {
        italic: false,
      },
      minValue: 0,
      maxValue: 20000,
    },
    annotations: {
      alwaysOutside: true,
      textStyle: {
        fontSize: 8,
        color: '#000',
        // auraColor: '#888'
      },
      stem: {
        length: -5,
      }
    },
  };
  
  const sellFleetOptions = {
    chartArea: { width: '75%', height: 200, top: 0 },
    hAxis: {
      minValue: 'auto',
      title: 'Periodo (años)',
      titleTextStyle: {
        italic: false,
      },
      format: '####',
    },
    isStacked: true,
    legend: {position: 'bottom', maxLines: 3},
    vAxis: {
      title: 'Número de vehículos\ndesintegrados',
      ticks: 'auto',
      titleTextStyle: {
        italic: false,
      },
      maxValue: 0,
      minValue: -20000,
    },
    annotations: {
      alwaysOutside: true,
      textStyle: {
        fontSize: 8,
        color: '#000',
        // auraColor: '#888'
      },
      stem: {
        length: -10,
      }
    },
  };
  
  const fuelOptions = {
    chartArea: { width: '75%' },
    hAxis: {
      minValue: 'auto',
      title: 'Periodo (años)',
      titleTextStyle: {
        italic: false,
      },
      format: '####',
    },
    isStacked: true,
    legend: {position: 'bottom', maxLines: 3},
    vAxis: {
      ticks: 'auto',
      titleTextStyle: {
        italic: false,
      }
    },
  };
  
  const fuelOptionsVAxis = {
    ticks: 'auto',
    titleTextStyle: {
      italic: false,
    }
  }
  
  const dieselOptions = {
    ...fuelOptions,
    vAxis: {
      ...fuelOptionsVAxis,
      title: 'Diesel (Millones de Galones)'
    },
  };
  
  const gasOptions = {
    ...fuelOptions,
    vAxis: {
      ...fuelOptionsVAxis,
      title: 'Gas Natural (Millones m^3)'
    }
  };
  
  const electricOptions = {
    ...fuelOptions,
    vAxis: {
      ...fuelOptionsVAxis,
      title: 'Electricidad (Gigawatts)'
    }
  };
  
  const hydrogenOptions = {
    ...fuelOptions,
    vAxis: {
      ...fuelOptionsVAxis,
      title: 'Hidrógeno (Millones Kg)'
    }
  };
  
  const incomeOptions: any = {
    chartArea: { width: '75%', height: 200, top: 100 },
    hAxis: {
      minValue: 'auto',
      // title: 'Periodo (años)',
      titleTextStyle: {
        italic: false,
      },
      textPosition: 'none',
      format: '####',
    },
    isStacked: true,
    legend: {position: 'none', maxLines: 3},
    vAxis: {
      title: 'Impuestos\n(Millones de pesos)',
      ticks: 'auto',
      titleTextStyle: {
        italic: false,
      },
      minValue: 0,
      maxValue: 20000,
    },
    annotations: {
      alwaysOutside: true,
      textStyle: {
        fontSize: 8,
        color: '#000',
        // auraColor: '#888'
      },
      stem: {
        length: -5,
      }
    },
  };
  
  const spendingOptions: any = {
    chartArea: { width: '75%', height: 200, top: 0 },
    hAxis: {
      minValue: 'auto',
      title: 'Periodo (años)',
      titleTextStyle: {
        italic: false,
      },
      format: '####',
    },
    isStacked: true,
    legend: {position: 'bottom', maxLines: 3},
    vAxis: {
      title: 'Subsidios\n(Millones de pesos)',
      ticks: 'auto',
      titleTextStyle: {
        italic: false,
      },
      maxValue: 0,
      minValue: -20000,
    },
    annotations: {
      alwaysOutside: true,
      textStyle: {
        fontSize: 8,
        color: '#000',
        // auraColor: '#888'
      },
      stem: {
        length: -10,
      }
    },
  };
  
  const totalCostOptions: any = {
    chartArea: { width: '75%' },
    hAxis: {
      minValue: 'auto',
      title: 'Periodo (años)',
      titleTextStyle: {
        italic: false,
      },
      format: '####',
    },
    isStacked: true,
    legend: {position: 'bottom', maxLines: 3},
    vAxis: {
      title: 'Millones de pesos',
      ticks: 'auto',
      titleTextStyle: {
        italic: false,
      }
    },
  };
  
  export { sellFleetOptions, buyFleetOptions, fleetOptions, 
    emissionsOptions, co2Options, dieselOptions, gasOptions,
    electricOptions, hydrogenOptions, incomeOptions, spendingOptions, totalCostOptions }