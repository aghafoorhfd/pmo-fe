import React from 'react';
import { useTranslation } from 'react-i18next';
import BasicBar from 'components/shared-components/Charts/BarChart';
import { Card } from 'components/shared-components/Card';
import { useSelector } from 'react-redux';
import { startCase } from 'lodash';

const JiraUserStoriesWidget = () => {
  const { t } = useTranslation();

  const {
    selectedProjectDetails: { jiraStatistics = {} } = {}
  } = useSelector((state) => (state.projectDetails));

  return (
    <Card
      heading={t('component.jira.timelines.jiraUserStories')}
      description={t('component.jira.timelines.widget.description')}
      showBorder>
      <div style={{ height: '350px' }} className="align-content-lg-center">
        <BasicBar
          height={200}
          data={Object.values(jiraStatistics) || []}
          categories={Object.keys(jiraStatistics).map((key) => (key === 'todoStories' ? 'To Do Stories' : startCase(key))) || []} />
      </div>
    </Card>
  );
};

export default JiraUserStoriesWidget;
