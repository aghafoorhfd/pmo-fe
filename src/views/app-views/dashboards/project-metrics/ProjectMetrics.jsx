import { notification, Spin } from 'antd';
import Loading from 'components/shared-components/Loading';
import MetricsWidget from 'components/shared-components/MetricsWidget/MetriceWidget';
import {
  metricKeyMapping,
  METRICS,
  METRICS_COMPONENTS_PROPS_KEY,
  PROJECT_METRICS,
  PROJECT_METRICS_KEYS_MAPPING
} from 'constants/MiscConstant';
import {
  initialCompanyConfiguration,
  initialGlobalConfiguration
} from 'constants/ProjectMetricsConstant';
import { noop } from 'lodash';
import { Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import UserService from 'services/UserService';
import ProjectService from 'services/ProjectService';
import { getMetricsArray } from 'utils/utils';
import ProjectMetricsModal from './ProjectMetricsModal';

const metricsMethods = {};
Object.keys(initialCompanyConfiguration).forEach((key) => {
  metricsMethods[key] = 'post';
});

const ProjectMetrics = () => {
  const [globalConfiguration, setGlobalConfiguration] = useState(
    initialGlobalConfiguration
  );
  const [projectConfiguration, setProjectConfiguration] = useState(
    initialCompanyConfiguration
  );
  const [metricsModalVisibility, setMetricsModalVisibility] = useState(false);
  const [metricComponent, setMetricComponent] = useState(null);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

  const formTitles = (projectMetric) => {
    const metric = metricKeyMapping[projectMetric];
    return {
      modalTitle: t(`component.project.${metric}.modalTitle`),
      metricName: t(`component.project.metrics.${metric}`),
      label: t(`component.project.${metric}.label`),
      placeholder: t(`component.project.${metric}.placeholder`),
      validMessage: t(`component.project.${metric}.validMessage`)
    };
  };

  const getAndSetProjectConfigurations = async () => {
    try {
      const companyConfigurationResponse = await ProjectService.getProjectConfigurations();
      const {
        data: {
          metrics: companyConfigurationData = initialCompanyConfiguration
        }
      } = companyConfigurationResponse;
      if (companyConfigurationResponse?.data?.metrics) {
        Object.keys(companyConfigurationData).forEach((key) => {
          metricsMethods[key] = 'put';
        });
      }

      setProjectConfiguration((prevProjectConfiguration) => ({
        ...prevProjectConfiguration,
        ...companyConfigurationData
      }));
    } catch (error) {
      noop();
      throw error;
    }
  };

  useEffect(() => {
    const fetchGlobalConfiguration = async () => {
      // project and global service api calls.
      setLoading(true);
      Promise.allSettled([
        UserService.getGlobalConfigurations(),
        getAndSetProjectConfigurations()
      ])
        .then((responses) => {
          const successResponse = responses.filter(
            (response) => response.status === 'fulfilled'
          );
          const globalConfigurationResponse = successResponse[0]
            ? successResponse[0].value
            : {};

          const {
            data: {
              metrics: globalConfigurationData = initialGlobalConfiguration
            }
          } = globalConfigurationResponse;

          setGlobalConfiguration(globalConfigurationData);
        })
        .catch((err) => {
          throw err;
        }).finally(() => {
          setLoading(false);
        });
    };
    fetchGlobalConfiguration();
  }, []);

  const updateProjectConfigurations = async (metricData, metricName) => {
    try {
      await ProjectService.updateProjectMetrics(
        { metric: metricData },
        metricsMethods[PROJECT_METRICS_KEYS_MAPPING[metricName]],
        metricName
      );
      getAndSetProjectConfigurations();
      notification.success({
        message: t('component.projectMetrics.updated.message', {
          metricsType: t(
            `component.projectMetrics.${PROJECT_METRICS_KEYS_MAPPING[metricName]}`
          )
        })
      });
    } catch (err) {
      noop();
    }
  };

  const onAddMetric = (metric) => {
    setMetricComponent({
      props: {
        globalData: globalConfiguration[METRICS_COMPONENTS_PROPS_KEY[metric]] || [],
        companyData: projectConfiguration[METRICS_COMPONENTS_PROPS_KEY[metric]],
        metricKey: PROJECT_METRICS[metric],
        ...formTitles(metric)
      }
    });
    setMetricsModalVisibility(true);
  };

  return loading ? (
    <div style={{ height: 'calc(100vh - 200px)' }} className="d-flex justify-content-center align-items-center">
      <Spin />
    </div>
  ) : (
    <>
      <MetricsWidget
        metricsName={t('component.projectMetrics.projectStates')}
        metrics={globalConfiguration.projectStates}
        metricsItemType="tag"
        hideLinkButton />

      <MetricsWidget
        metricsName={t('component.projectMetrics.projectStatus')}
        metrics={globalConfiguration.projectStatus}
        metricsItemType="tag"
        hideLinkButton />

      <MetricsWidget
        metricsName={t('component.projectMetrics.projectOutlook')}
        metrics={globalConfiguration.projectOutlook}
        metricsItemType="tag"
        hideLinkButton />

      <MetricsWidget
        metricsName={t('component.projectMetrics.projectStages')}
        metricsBtnTitle={t('component.projectMetrics.addNewStage')}
        onButtonClick={() => onAddMetric(METRICS.STAGES)}
        metrics={[
          ...getMetricsArray(globalConfiguration.projectStages),
          ...getMetricsArray(projectConfiguration?.projectStages?.selected)
        ]}
        id="project-stage-button" />

      <MetricsWidget
        metricsName={t('component.projectMetrics.milestones')}
        metricsBtnTitle={t('component.projectMetrics.addNewMilestone')}
        onButtonClick={() => onAddMetric(METRICS.MILESTONES)}
        metrics={[
          ...getMetricsArray(globalConfiguration.milestones),
          ...getMetricsArray(projectConfiguration?.milestones?.selected)
        ]}
        id="project-milestones-button" />

      <MetricsWidget
        metricsName={t('component.projectMetrics.projectPriority')}
        metricsBtnTitle={t('component.projectMetrics.addNewLevel')}
        onButtonClick={() => onAddMetric(METRICS.PRIORITY)}
        metrics={[
          ...getMetricsArray(globalConfiguration.projectPriorityLevel),
          ...getMetricsArray(
            projectConfiguration?.projectPriorityLevel?.selected
          )
        ]}
        id="project-priority-button" />

      <MetricsWidget
        metricsName={t('component.projectMetrics.projectCategory')}
        metricsBtnTitle={t('component.projectMetrics.addNewCategory')}
        onButtonClick={() => onAddMetric(METRICS.CATEGORY)}
        metrics={[
          ...getMetricsArray(globalConfiguration.projectCategory),
          ...getMetricsArray(projectConfiguration?.projectCategory?.selected)
        ]}
        id="project-category-button" />

      <MetricsWidget
        metricsName={t('component.projectMetrics.sponsoringDepartment')}
        metricsBtnTitle={t('component.projectMetrics.addNewDepartment')}
        onButtonClick={() => onAddMetric(METRICS.DEPARTMENT)}
        metrics={[
          ...getMetricsArray(globalConfiguration.sponsoringDepartment),
          ...getMetricsArray(
            projectConfiguration?.sponsoringDepartment?.selected
          )
        ]}
        id="project-department-button" />

      <MetricsWidget
        metricsName={t('component.projectMetrics.resourceDiscipline')}
        metricsBtnTitle={t('component.projectMetrics.addNewResourceDiscipline')}
        onButtonClick={() => onAddMetric(METRICS.RESOURCE)}
        metrics={[
          ...getMetricsArray(projectConfiguration?.resourceDiscipline?.selected)
        ]}
        id="project-resource-button" />

      {metricsModalVisibility && (
        <Suspense fallback={<Loading cover="content" />}>
          <ProjectMetricsModal
            setMetricsModalVisibility={setMetricsModalVisibility}
            updateProjectConfigurations={updateProjectConfigurations}
            {...metricComponent.props} />
        </Suspense>
      )}
    </>

  );
};

export default ProjectMetrics;
