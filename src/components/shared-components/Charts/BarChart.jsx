import React from 'react';
import Chart from 'react-apexcharts';
import { Empty } from 'antd';
import PropTypes from 'prop-types';
import Loading from 'components/shared-components/Loading';

const BasicBar = ({
  color = [],
  multiColorBars = false,
  data = [], categories = [], name, height, xaxisLabel, yaxisLabel, isLabelInPercentage, loading
}) => {
  const state = {
    series: [{
      name,
      data
    }],
    options: {
      plotOptions: {
        bar: {
          borderRadius: 8,
          borderRadiusApplication: 'end',
          distributed: multiColorBars,
          columnWidth: '35px',
          horizontal: false
        }
      },
      colors: color,
      legend: {
        show: false,
        showForSingleSeries: false
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        labels: {
          show: true
        },
        categories,
        title: {
          text: xaxisLabel
        }
      },
      yaxis: {
        labels: {
          show: true,
          formatter(val) {
            return Math.floor(val) + (isLabelInPercentage && '%');
          }
        },
        title: {
          text: yaxisLabel
        }
      }
    }
  };

  const displayChart = () => (data?.length > 0 ? (
    <div style={{ width: '100%' }}>
      <Chart
        className="apexcharts-bar"
        options={state.options}
        series={state.series}
        type="bar"
        height={height} />
    </div>
  ) : <Empty />);

  return loading ? (
    <Loading />
  ) : (
    displayChart()
  );
};

BasicBar.propTypes = {
  height: PropTypes.number,
  isLabelInPercentage: PropTypes.bool
};

BasicBar.defaultProps = {
  height: 300,
  isLabelInPercentage: false
};

export default BasicBar;
