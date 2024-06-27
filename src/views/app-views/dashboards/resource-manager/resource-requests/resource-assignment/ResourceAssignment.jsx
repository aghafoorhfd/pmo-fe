import { CloseOutlined } from '@ant-design/icons';
import { Col, Row, Typography } from 'antd';
import { Card } from 'components/shared-components/Card';
import { useTranslation } from 'react-i18next';
import ProjectStatisticWidget from 'views/app-views/dashboards/project-manager/ProjectStatisticsWidget';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import ResourceCapacity from './ResourceCapacity';

const ResourceAssignment = ({ request, handleClose }) => {
  const {
    projectDetail: { projectId },
    resourceRequestDetail: {
      resourceDiscipline
    }
  } = request;
  const { t } = useTranslation();
  const { Text } = Typography;

  return (
    <>
      <ProjectStatisticWidget
        projectId={projectId}
        contentAddon={(
          <Row align="middle" justify="center" className="mt-2">
            <Col span={3}><Text className="sub-heading">{t('component.project.manager.resources.column.label.resourceDiscipline')}</Text></Col>
            <Col span={21} className="d-flex align-items-center">
              {resourceDiscipline}
            </Col>
          </Row>
      )} />
      <Card heading={t('component.project.manager.resources.currentAvailableTeamCapacity')} actionBtn={<CloseOutlined id="team-capacity-close-btn" onClick={handleClose} />}>
        <ResourceCapacity request={request} handleCapictySheetClose={handleClose} />
      </Card>
    </>
  );
};

export default ResourceAssignment;

ResourceCapacity.propTypes = {
  request: PropTypes.objectOf,
  handleClose: PropTypes.func
};
ResourceCapacity.defaultProps = {
  request: {},
  handleClose: noop
};
