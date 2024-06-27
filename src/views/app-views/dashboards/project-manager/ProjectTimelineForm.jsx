import { Form } from 'antd';
import { useEffect, useRef } from 'react';
import { PROJECT_TIMELINES_METRICS, PROJECT_STAGE_KEYS, PROJECT_SUBSTAGE_KEYS } from 'constants/MiscConstant';
import { getConfigurationOptions } from 'store/slices/projectDetailsSlice';
import { useDispatch, useSelector } from 'react-redux';
import ProjectStageFormFields from './ProjectStageFormFields';
import ProjectMilestoneFormFields from './ProjectMilestoneFormFields';
import ProjectDependencyFormFields from './ProjectDependencyFormFields';
import ProjectSubStageForm from './ProjectSubStageForm';

const {
  STAGES, DEPENDENCY, MILESTONES, SUB_STAGES, SUB_STAGES_DEPENDENCY
} = PROJECT_TIMELINES_METRICS;
const ProjectTimelineForm = ({
  formToShow, form, setCheckForm, handleSubmit,
  milestones, projectTasks, projectId, subStagesFormVisibility,
  setSubStagesFormVisibility
}) => {
  const {
    configurationMetrics, selectedProjectDetails: { projectCadence },
    projectCadence: {
      agile, sdlc
    }
  } = useSelector(({ projectDetails }) => (projectDetails));
  const formRef = useRef();

  const { fiscalYearStartDate = '' } = sdlc || {};
  const { sprintStartDate = '' } = agile || {};
  const companyStartDate = sprintStartDate || fiscalYearStartDate;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getConfigurationOptions());
  }, []);

  useEffect(() => () => {
    form.resetFields();
  }, []);

  const onFinishFailed = (errorInfo) => {
    const { name: [name] = [] } = errorInfo?.errorFields[0] || {};
    const firstErrorField = formRef?.current?.getFieldInstance([name]);
    const { outlook } = PROJECT_STAGE_KEYS;
    const { subStageOutlook } = PROJECT_SUBSTAGE_KEYS;
    if (name === subStageOutlook || name === outlook) {
      const { props: { circlePickerRef: { current } = {} } = {} } = firstErrorField;
      current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
    }
  };
  return (
    <Form
      ref={formRef}
      form={form}
      onFinishFailed={onFinishFailed}
      name="project-timeline-metrics"
      data-i="project-timeline-metrics-form"
      onFinish={handleSubmit}
      onFieldsChange={() => {
        setCheckForm(true);
      }}
      scrollToFirstError={{
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      }}
      layout="vertical">
      {
        (formToShow === STAGES || formToShow === SUB_STAGES) && (
          <ProjectStageFormFields
            form={form}
            projectStages={projectTasks}
            stages={configurationMetrics?.projectStages}
            projectCadence={projectCadence}
            currentDate={companyStartDate}
            formToShow={formToShow}
            projectId={projectId}
            subStagesFormVisibility={subStagesFormVisibility}
            setSubStagesFormVisibility={setSubStagesFormVisibility} />
        )
      }
      {
        formToShow === DEPENDENCY && (
          <ProjectDependencyFormFields
            form={form}
            projectStages={projectTasks} />
        )
      }
      {
        formToShow === MILESTONES && (
          <ProjectMilestoneFormFields
            form={form}
            milestones={milestones}
            projectMilestones={configurationMetrics?.milestones}
            currentDate={companyStartDate} />
        )
      }
      {
        formToShow === SUB_STAGES_DEPENDENCY && (
          <ProjectSubStageForm
            projectId={projectId}
            stages={configurationMetrics?.projectStages}
            projectStages={projectTasks}
            form={form} />
        )
      }
    </Form>
  );
};

export default ProjectTimelineForm;
