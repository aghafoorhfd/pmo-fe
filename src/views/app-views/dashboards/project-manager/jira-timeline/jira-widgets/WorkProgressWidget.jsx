import React from 'react';
import { Empty } from 'antd';
import { Card } from 'components/shared-components/Card';
import { JIRA_WORK_PROGRESS_CHART_COLORS } from 'constants/MiscConstant';
import DonutChartWidget from 'components/shared-components/DonutChartWidget';
import { startCase } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

const WorkProgressWidget = () => {
  const { t } = useTranslation();

  const {
    selectedProjectDetails: { jiraStatistics = {} } = {}
  } = useSelector((state) => (state.projectDetails));

  return (
    <Card
      heading={t('component.jira.timelines.jiraWorkProgress')}
      description={t('component.jira.timelines.widget.description')}
      showBorder>
      <div style={{ height: '350px' }} className="align-content-lg-center">
        { Object.keys(jiraStatistics)?.length ? (
          <DonutChartWidget
            height={200}
            series={Object.values(jiraStatistics) || []}
            labels={Object.keys(jiraStatistics).map((key) => (key === 'todoStories' ? 'To Do Stories' : startCase(key))) || []}
            customOptions={
            {
              colors: Object.values(JIRA_WORK_PROGRESS_CHART_COLORS),
              legend: {
                show: true,
                position: 'right',
                offsetY: 50,
                offsetX: 0,
                onItemHover: {
                  highlightDataSeries: false
                }

              }
            }
            } />
        ) : <Empty />}
      </div>
    </Card>
  );
};

export default WorkProgressWidget;
