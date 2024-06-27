import {
  Button, Col, Row, Tooltip
} from 'antd';
import { Card } from 'components/shared-components/Card';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { noop } from 'lodash';
import { useSelector } from 'react-redux';
import moment from 'moment';

const ImpactedEpics = ({
  // addWorkItem,
  onJiraSync,
  onJiraLink,
  jiraLinkLoader,
  jiraSyncLoader
}) => {
  const { t } = useTranslation();
  const {
    projectDetails: { selectedProjectDetails: { lastJiraDataSync, id: pID } = {} } = {}
  } = useSelector(({ projectDetails }) => ({ projectDetails }));
  const syncedDate = moment(lastJiraDataSync).format('dddd, MMMM Do YYYY, h:mm a');
  return (
    <Card style={{ backgroundColor: '#F2F4F7' }}>
      <Row>
        <Col className="d-flex flex-grow-1 justify-content-end mr-3">
          {/* <Button
            id="jira-work-item-btn"
            disabled={!lastJiraDataSync}
            className="mx-2"
            onClick={addWorkItem}>
            {t('component.jira.timelines.addWorkItem')}
          </Button> */}
          <Tooltip title={lastJiraDataSync ? `${t('component.jira.timelines.lastSync')} ${syncedDate}` : ''}>
            <Button id="jira-sync-btn" loading={jiraSyncLoader} disabled={jiraSyncLoader || !pID} className="mx-2" onClick={onJiraSync}>{t('component.jira.timelines.dataSync')}</Button>
          </Tooltip>
          <Button id="jira-link-btn" className="mx-2" disabled={jiraLinkLoader || !pID} onClick={onJiraLink} loading={jiraLinkLoader}>{t('component.jira.timelines.jiraLink')}</Button>
        </Col>
      </Row>
    </Card>
  );
};

ImpactedEpics.propTypes = {
  // addWorkItem: PropTypes.func,
  onJiraSync: PropTypes.func,
  onJiraLink: PropTypes.func,
  jiraLinkLoader: PropTypes.bool,
  jiraSyncLoader: PropTypes.bool
};
ImpactedEpics.defaultProps = {
  // addWorkItem: noop,
  onJiraSync: noop,
  onJiraLink: noop,
  jiraLinkLoader: false,
  jiraSyncLoader: false
};

export default ImpactedEpics;
