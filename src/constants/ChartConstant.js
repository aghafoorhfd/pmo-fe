export const COLOR_1 = '#3e82f7'; // blue
export const COLOR_2 = '#04d182'; // cyan
export const COLOR_3 = '#ff6b72'; // volcano
export const COLOR_4 = '#ffc107'; // gold
export const COLOR_5 = '#a461d8'; // purple
export const COLOR_6 = '#fa8c16'; // orange
export const COLOR_7 = '#17bcff'; // geekblue
export const COLOR_8 = '#A5A5A5'; // grey
export const COLOR_9 = '#FFEF5E'; // orange
export const COLOR_10 = '#509CF5'; // light-blue
export const COLOR_11 = '#D0D5DD'; // light Grey
export const COLOR_12 = '#039855'; // green
export const COLOR_13 = '#D92D20'; // red

export const COLOR_1_LIGHT = 'rgba(62, 130, 247, 0.15)';
export const COLOR_2_LIGHT = 'rgba(4, 209, 130, 0.1)';
export const COLOR_3_LIGHT = 'rgba(222, 68, 54, 0.1)';
export const COLOR_4_LIGHT = 'rgba(255, 193, 7, 0.1)';
export const COLOR_5_LIGHT = 'rgba(139, 75, 157, 0.1)';
export const COLOR_6_LIGHT = 'rgba(250, 140, 22, .1)';
export const COLOR_7_LIGHT = 'rgba(23, 188, 255, 0.15)';

export const COLORS = [
  COLOR_1,
  COLOR_2,
  COLOR_3,
  COLOR_4,
  COLOR_5,
  COLOR_6,
  COLOR_7,
  COLOR_8,
  COLOR_9,
  COLOR_10,
  COLOR_11,
  COLOR_12,
  COLOR_13
];

export const COLORS_LIGHT = [
  COLOR_1_LIGHT,
  COLOR_2_LIGHT,
  COLOR_3_LIGHT,
  COLOR_4_LIGHT,
  COLOR_5_LIGHT,
  COLOR_6_LIGHT,
  COLOR_7_LIGHT
];

export const COLOR_AXES = '#edf2f9';
export const COLOR_TEXT = '#455560';

export const apexLineChartDefaultOption = {
  chart: {
    zoom: {
      enabled: false
    },
    toolbar: {
      show: false
    }
  },
  colors: [...COLORS],
  dataLabels: {
    enabled: false
  },
  stroke: {
    width: 3,
    curve: 'smooth',
    lineCap: 'round'
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    offsetY: -15,
    itemMargin: {
      vertical: 20
    },
    tooltipHoverFormatter(val, opts) {
      return `${val} - ${opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex]}`;
    }
  },
  xaxis: {
    categories: []
  },
  grid: {
    xaxis: {
      lines: {
        show: true
      }
    },
    yaxis: {
      lines: {
        show: false
      }
    }
  }
};

export const apexAreaChartDefaultOption = { ...apexLineChartDefaultOption };

export const apexBarChartDefaultOption = {
  chart: {
    zoom: {
      enabled: false
    },
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '25px',
      startingShapre: 'rounded',
      endingShape: 'rounded'
    }
  },
  colors: [...COLORS],
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    width: 6,
    curve: 'smooth',
    colors: ['transparent']
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    offsetY: -15,
    inverseOrder: true,
    itemMargin: {
      vertical: 20
    },
    tooltipHoverFormatter(val, opts) {
      return `${val} - ${opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex]}`;
    }
  },
  xaxis: {
    categories: []
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter: (val) => `${val}`
    }
  }
};

export const apexPieChartDefaultOption = {
  colors: [...COLORS],
  plotOptions: {
    pie: {
      donut: {
        size: '60%',
        labels: {
          show: true
        }
      }
    }
  },
  labels: [],
  dataLabels: {
    enabled: true,
    formatter: (val) => `${val.toFixed(0)}%`
  },
  legend: {
    show: true,
    onItemHover: {
      highlightDataSeries: false
    }
  },
  chart: {
    fontFamily: 'Inter',
    foreColor: 'rgb(69, 85, 96)'
  },
  stroke: {
    width: 0
  }
};

export const apexSparklineChartDefultOption = {
  chart: {
    type: 'line',
    sparkline: {
      enabled: true
    }
  },
  stroke: {
    width: 2,
    curve: 'smooth'
  },
  tooltip: {
    fixed: {
      enabled: false
    },
    x: {
      show: false
    },
    y: {
      title: {
        formatter() {
          return '';
        }
      }
    },
    marker: {
      show: false
    }
  }
};
