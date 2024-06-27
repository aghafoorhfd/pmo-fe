import React from 'react';
import Chart from 'react-apexcharts';
import { COLORS } from 'constants/ChartConstant';

export const Donut = ({ data }) => {
  const state = {
    series: data,
    options: {
      colors: COLORS,
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    }
  };

  return (
    <Chart
      options={state.options}
      series={state.series}
      height={300}
      type="donut" />
  );
};

export default Donut;
