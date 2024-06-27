import React from 'react';
import PropTypes from 'prop-types';
import {
  Row, Col,
  Typography,
  Button,
  Tag
} from 'antd';
import {
  PROJECT_OUTLOOK,
  PROJECT_STATES,
  PROJECT_STATUS
} from 'constants/ProjectMetricsConstant';
import { useTranslation } from 'react-i18next';
import { PlusOutlined } from '@ant-design/icons';
import { noop } from 'lodash';

const { Paragraph } = Typography;

const MetricsWidget = ({
  metrics,
  metricsName,
  metricsBtnTitle,
  hideLinkButton,
  onButtonClick,
  id
}) => {
  const { t } = useTranslation();

  const tileStyles = {
    mainContainerStyle: { marginTop: '13px' },
    rowStyle: {
      width: '100%',
      background: '#FFFFFF',
      border: '1px solid #E4E7EC',
      borderRadius: '8px 8px 8px 8px'
    },
    columnStyle: {
      display: 'flex',
      justifyContent: 'center',
      borderRight: '1px solid #E4E7EC',
      background: '#3E79F7',
      borderRadius: '8px 0px 0px 8px'
    },
    paragraphStyle: {
      color: 'white', fontSize: '16px', fontWeight: '600', width: '70%', overflowWrap: 'break-word'
    },
    metriceColumnStyle: {
      padding: '20px 0px 15px 20px'
    },
    metriceTagStyle: {
      color: '#1D2939', background: '#E4E7EC', paddingTop: '8px', height: '40px', display: 'inline-block', border: 'none', fontSize: '14px', fontWeight: '400'
    },
    btnIconStyle: { fontSize: '20px', strokeWidth: '10' },
    btnStyle: {
      display: 'flex',
      margin: '20px 0px 10px 17px'
    }
  };

  const statusAndStatesTileStyles = {
    rowStyle: {
      width: '100%',
      background: '#FFFFFF',
      border: '0.5px solid #E4E7EC',
      borderRadius:
        metricsName === PROJECT_STATES ? '8px 8px 0px 0px' : '0px 0px 8px 8px'
    },
    columnStyle: {
      display: 'flex',
      justifyContent: 'center',
      height: '90px',
      background: '#F2F4F7',
      borderRight: '1px solid #E4E7EC',
      borderRadius:
        metricsName === PROJECT_STATES ? '8px 0px 0px 0px' : '0px 0px 0px 8px'
    },
    paragraphStyle: {
      color: '#667085', fontSize: '16px', fontWeight: '600', width: '65%', overflowWrap: 'break-word'
    },
    matricsTagStyle: {
      background: '#E4E7EC',
      color: '#98A2B3',
      padding: '12px',
      border: 'none'
    }
  };
  const checkStylesToDisplay = () => (metricsName === PROJECT_STATUS
    || metricsName === PROJECT_STATES);

  const getTagStyle = (metric) => {
    if (checkStylesToDisplay()) {
      return statusAndStatesTileStyles.matricsTagStyle;
    }
    return {
      ...tileStyles.metriceTagStyle,
      ...(metricsName === PROJECT_OUTLOOK ? {
        background: metric?.code,
        color: 'white',
        border: 'none'
      } : {})
    };
  };
  const getMetricName = (metric) => {
    const hoursInfo = metric?.resourceCapacity ? ` (${metric.resourceCapacity} hours)` : '';
    return `${metric?.name}${hoursInfo}`;
  };

  return (
    <div style={!checkStylesToDisplay() ? tileStyles.mainContainerStyle : {}}>
      <Row
        justify="start"
        style={
          checkStylesToDisplay()
            ? statusAndStatesTileStyles.rowStyle
            : tileStyles.rowStyle
        }>
        <Col
          justify="start"
          span={3}
          className="d-flex align-items-center fw-bold left-column"
          style={
            checkStylesToDisplay()
              ? statusAndStatesTileStyles?.columnStyle
              : tileStyles?.columnStyle
          }>
          <Paragraph
            strong
            className="mb-0"
            style={
              checkStylesToDisplay()
                ? statusAndStatesTileStyles.paragraphStyle
                : tileStyles.paragraphStyle
            }>
            {metricsName}
          </Paragraph>
        </Col>
        <Col span={21}>
          <Row>
            {metrics.map((metric) => (
              <Col
                key={metric?.name || metric}
                style={tileStyles.metriceColumnStyle}>
                <Tag
                  key={metric?.name || metric}
                  style={getTagStyle(metric)}>
                  {metricsName === PROJECT_OUTLOOK ? metric.description : getMetricName(metric)}
                </Tag>
              </Col>
            ))}
            {!hideLinkButton && (
              <Button
                type="primary"
                onClick={onButtonClick}
                icon={<PlusOutlined style={tileStyles.btnIconStyle} />}
                ghost
                style={tileStyles.btnStyle}
                id={id}>
                {t('component.projectMetrics.addNewMetrics', {
                  metricsBtnTitle
                })}
              </Button>
            )}
          </Row>
        </Col>
      </Row>
    </div>
  );
};

MetricsWidget.propTypes = {
  metrics: PropTypes.arrayOf(PropTypes.objectOf),
  metricsName: PropTypes.string,
  hideLinkButton: PropTypes.bool,
  onButtonClick: PropTypes.func,
  id: PropTypes.string
};

MetricsWidget.defaultProps = {
  metrics: [],
  metricsName: '',
  onButtonClick: noop,
  hideLinkButton: false,
  id: ''
};

export default MetricsWidget;
