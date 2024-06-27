import { Row, Col, notification } from 'antd';
import { Card } from 'components/shared-components/Card';
import BasicBar from 'components/shared-components/Charts/BarChart';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ResourceService from 'services/ResourceService';

const ProjectCapacity = ({ teamId }) => {
  const { t } = useTranslation();
  const [availableProjectCapacityStats, setAvailableProjectCapacityStats] = useState([]);
  const [requestProjectCapacityStats, setRequestProjectCapacityStats] = useState([]);
  const [statsLoading, setStatsLoading] = useState(false);

  const capacitiesKeys = {
    availableCapacity: setAvailableProjectCapacityStats,
    requestCapacity: setRequestProjectCapacityStats
  };

  const statsCountHandler = (data, type) => {
    const keys = Object.keys(data) || 0;
    const values = Object.values(data) || 0;

    if (Object.keys(data)?.length > 0) {
      return (
        capacitiesKeys[type]({
          labels: keys,
          series: values
        })
      );
    }
  };

  const getCapacityOfProjects = async () => {
    try {
      if (teamId) {
        setStatsLoading(true);
        const { data: availableStatsData = {} } = await
        ResourceService.projectAvailableCapacity(teamId);
        const { data: requestStatsData = {} } = await
        ResourceService.projectRequestCapacity(teamId);
        statsCountHandler(availableStatsData?.availableCapacityCount || {}, 'availableCapacity');
        statsCountHandler(requestStatsData?.availableCapacityRequestStats || {}, 'requestCapacity');
      }
    } catch ({ message }) {
      notification.error({ message });
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    getCapacityOfProjects();
    return () => {
      setAvailableProjectCapacityStats([]);
      setRequestProjectCapacityStats([]);
    };
  }, [teamId]);

  return (

    <Row gutter={[16, 4]}>
      <Col span={12}>
        <Card
          heading={t('component.resource.manager.resource.commitment.widget.projectAvailableCapacity')}
          description={t('component.resource.manager.resource.commitment.widget.projectAvailableCapacity.details')}
          className="user-capacity-widget-card"
          showBorder>
          <div style={{ height: '350px' }} className="align-content-lg-center">
            <BasicBar
              loading={statsLoading}
              data={availableProjectCapacityStats?.series}
              categories={availableProjectCapacityStats?.labels}
              name={t('component.resource.manager.resource.commitment.widget.yaxisLabel')}
              xaxisLabel={t('component.resource.manager.resource.commitment.widget.xaxisLabel')}
              yaxisLabel={t('component.resource.manager.resource.commitment.widget.yaxisLabel')} />
          </div>
        </Card>
      </Col>
      <Col span={12}>
        <Card
          heading={t('component.resource.manager.resource.commitment.widget.projectCapacityRequest')}
          description={t('component.resource.manager.resource.commitment.widget.projectCapacityRequest.details')}
          className="user-capacity-widget-card"
          showBorder>
          <div style={{ height: '350px' }} className="align-content-lg-center">
            <BasicBar
              loading={statsLoading}
              data={requestProjectCapacityStats?.series}
              categories={requestProjectCapacityStats?.labels}
              name={t('component.resource.manager.resource.commitment.widget.yaxisLabel')}
              xaxisLabel={t('component.resource.manager.resource.commitment.widget.xaxisLabel')}
              yaxisLabel={t('component.resource.manager.resource.commitment.widget.yaxisLabel')} />
          </div>
        </Card>
      </Col>
    </Row>

  );
};

export default ProjectCapacity;
