import React from 'react';
import {
  Col, Drawer, Empty, Row, Tag
} from 'antd';
import './index.css';
import { useTranslation } from 'react-i18next';

const tagColors = {
  Backlog: '#F79009',
  'In Progress': '#578cff',
  'To Do': '#98A2B3',
  Done: 'green',
  Closed: '#D92D20'
};
const JiraDrawer = ({ open, onClose, jiraIssues }) => {
  const { t } = useTranslation();

  return (
    <Drawer
      title={jiraIssues?.length > 0 ? t('component.jira.chart.numberOfIssues', { count: jiraIssues?.length }) : t('component.jira.chart.noIssues')}
      placement="right"
      onClose={onClose}
      open={open}>
      {jiraIssues?.length > 0 ? jiraIssues.map((issue) => (
        <Row gutter={[5]} className="flex-nowrap mb-3" align="middle" key={issue?.issueKey}>
          <Col className="jira-item-name"><Tag bordered={false} color={tagColors[issue?.status]}>{issue?.status}</Tag></Col>
          <Col className="font-weight-semibold jira-item-key" span={5}><a target="_blank" href={issue?.link} rel="noreferrer">{issue?.issueKey}</a></Col>
          <Col className="jira-item-name" wrap={false}>{issue?.title}</Col>

        </Row>
      )) : <Empty />}
    </Drawer>
  );
};

export default JiraDrawer;
