import React, { useEffect, useState } from 'react';
import {
  Empty, Button, Select, notification
} from 'antd';
import { useTranslation } from 'react-i18next';
import { Card } from 'components/shared-components/Card';
import { noop } from 'lodash';
import ChartWrapper from 'components/shared-components/ChartWrapper';
import ChartWidget from 'components/shared-components/ChartWidget';
import { COLORS } from 'constants/ChartConstant';
import ProjectService from 'services/ProjectService';
import {
  hideMessage, getUserPendingWorkStatistics, resetCallbackStatus, resetJiraPendingStats
} from 'store/slices/jiraSlice';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loading from 'components/shared-components/Loading';
import { initialPaginationConfiguration } from 'constants/MiscConstant';

const JiraPendingWorkWidget = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [projectOptions, setProjectOptions] = useState([]);
  const [projectLoading, setProjectLoading] = useState(true);
  const dispatch = useDispatch();

  const projectId = searchParams.get('projectId');
  const projectKey = searchParams.get('projectKey');

  const {
    jira: {
      message, showMessage, status, callbackStatus, jiraPendingWorkStats, loading: jiraSyncLoading
    } = {}
  } = useSelector(({ jira }) => ({ jira }));

  const handleDataSync = async (id, key) => {
    if (key) {
      dispatch(getUserPendingWorkStatistics({ projectId: id, projectKey: key }));
    } else {
      notification.error({ message: t('component.jira.projectKeyNotFound.error') });
    }
  };

  const handleProjectSelection = (id, { key }) => {
    dispatch(resetJiraPendingStats());
    handleDataSync(id, key);
    setSearchParams({ projectId: id, ...(key && { projectKey: key }) });
  };

  const getProjectKey = (options) => options.find(({ value }) => value
  === projectId)?.key;

  const handleCallbackStatus = (options) => {
    if (callbackStatus) {
      const key = getProjectKey(options);
      handleProjectSelection(projectId, {
        key
      });
      dispatch(resetCallbackStatus());
    } else {
      dispatch(resetJiraPendingStats());
      handleDataSync(projectId, projectKey);
    }
  };

  const getAllProjects = async () => {
    try {
      const response = await ProjectService.getProjectList({
        page: initialPaginationConfiguration.page - 1,
        pageSize: 100
      });
      const { data: { content: projectData } = {} } = response;
      const options = projectData.map((project) => ({
        label: project?.projectName,
        value: project?.projectId,
        key: project?.projectKey
      }));
      if (options?.length > 0) {
        setProjectOptions(options);
        if (!projectId) {
          if (callbackStatus !== undefined) dispatch(resetCallbackStatus());
        } else {
          handleCallbackStatus(options);
        }
      }
    } catch (err) {
      notification.error({ message: err.message });
    } finally {
      setProjectLoading(false);
    }
  };

  useEffect(() => {
    getAllProjects();
  }, []);

  useEffect(() => {
    if (showMessage) {
      notification[status]({ message });
      dispatch(hideMessage());
    }
  }, [showMessage]);

  const handleJiraLinkAccount = async () => {
    try {
      const { data: { authUrl } } = await ProjectService.jiraLinkAccount(projectId);
      if (authUrl) {
        window.location.href = authUrl;
      }
    } catch {
      noop();
    }
  };

  const handleJiraLink = () => {
    if (projectKey) {
      handleJiraLinkAccount();
    } else {
      notification.error({ message: t('component.jira.projectKeyNotFound.error') });
    }
  };
  const jiraPendingWorkOptions = {
    chart: {
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        borderRadiusApplication: 'end',
        columnWidth: '20%'
      }
    },
    xaxis: {
      categories: Object.keys(jiraPendingWorkStats)
    },
    yaxis: {
      forceNiceScale: true
    },
    colors: [COLORS[0]]
  };

  return (
    <Card
      heading={t('component.jira.timelines.jiraUserStories')}
      description={t('component.general.user.project.stories.allocated.description')}
      loading={projectLoading}
      actionBtn={(
        <>
          <Select
            className="mr-2"
            style={{ width: '250px' }}
            value={projectId}
            size="large"
            showSearch
            allowClear={false}
            options={projectOptions}
            onChange={handleProjectSelection}
            placeholder={t('component.general.user.project.stories.select.project.placeholder')} />
          <Button
            disabled={projectOptions?.length === 0}
            onClick={handleJiraLink}>
            {t('component.jira.timelines.jiraLink')}
          </Button>
        </>
    )}
      className="user-project-stat-bar card-height"
      showBorder>
      <ChartWrapper>
        {jiraSyncLoading && <Loading />}
        {Object.keys(jiraPendingWorkStats)?.length > 0 && (
          <ChartWidget
            series={[{
              data: Object.values(jiraPendingWorkStats)
            }]}
            type="bar"
            card={false}
            customOptions={jiraPendingWorkOptions} />
        )}
        {Object.keys(jiraPendingWorkStats)?.length === 0 && !jiraSyncLoading && <Empty /> }
      </ChartWrapper>
    </Card>
  );
};

export default JiraPendingWorkWidget;
