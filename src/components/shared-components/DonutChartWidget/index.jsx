import React from 'react';
import { Card } from 'antd';
import ApexChart from 'react-apexcharts';
import { apexPieChartDefaultOption } from 'constants/ChartConstant';
import PropTypes from 'prop-types';

function Chart(props) {
  return <ApexChart {...props} />;
}

function DonutChartWidget(props) {
  const {
    series, customOptions, labels, width, height, title, extra
  } = props;
  let options = apexPieChartDefaultOption;
  options.labels = labels;
  if (!title.text) {
    options.plotOptions.pie.donut.labels.show = false;
  } else {
    options.title = title;
  }
  if (customOptions) {
    options = { ...options, ...customOptions };
  }

  return (
    <>
      <Chart height={height} options={options} series={series} type="donut" width={width} />
      {extra}
    </>
  );
}

export function DonutChartWidgetWrapper({ children, bodyClass }) {
  return (
    <Card>
      <div className={`text-center ${bodyClass}`}>
        {children}
      </div>
    </Card>
  );
}

DonutChartWidgetWrapper.propTypes = {
  bodyClass: PropTypes.string
};
DonutChartWidgetWrapper.defaultProps = {
  bodyClass: ''
};
DonutChartWidget.propTypes = {
  series: PropTypes.arrayOf(PropTypes.number),
  labels: PropTypes.arrayOf(PropTypes.string),
  extra: PropTypes.element,
  height: PropTypes.number,
  width: PropTypes.string,
  title: PropTypes.shape({})
};

DonutChartWidget.defaultProps = {
  series: [],
  labels: [],
  height: 250,
  width: '100%',
  extra: null,
  title: {}
};

export default DonutChartWidget;
