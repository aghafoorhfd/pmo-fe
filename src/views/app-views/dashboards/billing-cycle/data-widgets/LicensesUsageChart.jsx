import React from 'react';
import DonutChartWidget from 'components/shared-components/DonutChartWidget';
import PropTypes from 'prop-types';
import { COLORS } from 'constants/ChartConstant';

const LicensesUsageChart = ({ chartData }) => (
  <DonutChartWidget
    data-i="licenses-chart"
    series={chartData?.series}
    labels={chartData?.label}
    customOptions={
          {
            colors: [COLORS[11], COLORS[9]],
            legend: {
              show: true,
              position: 'right',
              offsetY: 80,
              offsetX: 50,
              onItemHover: {
                highlightDataSeries: false
              }
            }
          }
          }
    width="600px"
    height={230} />

);
LicensesUsageChart.propTypes = {
  chartData: PropTypes.shape({
    series: PropTypes.arrayOf(PropTypes.number).isRequired,
    label: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired
};

export default LicensesUsageChart;
