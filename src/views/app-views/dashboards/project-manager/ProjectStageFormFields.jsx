import {
  DeleteOutlined, EditOutlined,
  ExclamationCircleOutlined, PlusOutlined
} from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Form,
  Select,
  Row,
  Col,
  Card,
  Modal
} from 'antd';
import { PROJECT_TIMELINES_METRICS, PROJECT_SUBSTAGE_KEYS, stagesColors } from 'constants/MiscConstant';
import { noop } from 'lodash';
import moment from 'moment';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import {
  useState, useMemo, useEffect, useRef
} from 'react';
import { CirclePicker } from 'react-color';
import { useTranslation } from 'react-i18next';
import { createOptionList } from 'utils/utils';
import { DATE_FORMAT_MM_DD_YYYY } from 'constants/DateConstant';
import { useDispatch, useSelector } from 'react-redux';
import Loading from 'components/shared-components/Loading';
import { getStageDetails, resetStageToEdit, setSubStages } from 'store/slices/projectDetailsSlice';
import './ProjectStageFormFields.css';

const { confirm } = Modal;

const { STAGES, SUB_STAGES } = PROJECT_TIMELINES_METRICS;

const ProjectStageFormFields = ({
  form,
  stages,
  projectStages,
  currentDate,
  formToShow,
  projectId,
  setSubStagesFormVisibility,
  subStagesFormVisibility
}) => {
  const stageCirclePickerRef = useRef();
  const substageCirclePickerRef = useRef();
  const [subStageToEdit, setSubStageToEdit] = useState('');
  const dispatch = useDispatch();
  const outlookValue = Form.useWatch('outlook', form);
  const stageFieldName = Form.useWatch('stage', form);
  const {
    stageDetails, subStages, loading
  } = useSelector(({ projectDetails: { stageToEdit } }) => ({
    ...stageToEdit
  }));

  const subStageOutlookValue = Form.useWatch(
    PROJECT_SUBSTAGE_KEYS.subStageOutlook,
    form
  );
  const stageDateRange = Form.useWatch('stageDateRange', form) || [];

  const { t } = useTranslation();
  const { RangePicker } = DatePicker;

  const [lowestSubStage, highestSubStage] = useMemo(() => {
    if (subStages.length) {
      const subStageEndDates = subStages.map(({
        endDate: subStageEndDate
      }) => moment(subStageEndDate));

      const subStageStartDates = subStages.map(({
        startDate: subStageStartDate
      }) => moment(subStageStartDate));
      return [moment.min(subStageStartDates), moment.max(subStageEndDates)];
    }
    return [null, null];
  }, [subStages]);

  useEffect(() => {
    if (lowestSubStage && highestSubStage) {
      form.setFieldsValue({
        stageDateRange: [lowestSubStage, highestSubStage]
      });
    }
  }, [lowestSubStage, highestSubStage]);

  const filteredStages = stages?.filter(
    ({ name }) => {
      const matchedStage = projectStages?.find(
        ({ stageName }) => name === stageName?.props?.title
      );

      return (formToShow === STAGES && !matchedStage)
        || (formToShow === SUB_STAGES && matchedStage);
    }
  );

  const stageSelected = useMemo(
    () => filteredStages?.find(
      ({ name }) => name === stageFieldName
    ),
    [filteredStages, stageFieldName]
  );

  useEffect(() => {
    if (Object.keys(stageDetails).length) {
      form.setFieldsValue(stageDetails);
    }
  }, [stageDetails]);

  useEffect(() => {
    if (stageFieldName) {
      if (formToShow === SUB_STAGES) {
        dispatch(getStageDetails({ projectId, selectedStageName: stageFieldName }));

        return () => {
          dispatch(resetStageToEdit());
        };
      }
      dispatch(setSubStages({ subStages: [] }));
    }
  }, [stageFieldName]);

  const filteredSubStages = stageSelected?.subStages?.filter(
    ({ name }) => !subStages?.find(({ subStageName }) => name === subStageName)
  );

  const showSubStagesForm = () => {
    setSubStagesFormVisibility(true);
  };

  const onCancel = () => {
    setSubStageToEdit('');
    setSubStagesFormVisibility(false);
    form.resetFields(Object.keys(PROJECT_SUBSTAGE_KEYS));
  };

  const onAddSubStage = () => {
    form
      .validateFields(Object.keys(PROJECT_SUBSTAGE_KEYS))
      .then(() => {
        const values = form.getFieldsValue();
        const {
          subStageOutlook: outlook,
          subStageName,
          subStageRange: [startDate = '', endDate = ''] = []
        } = values;
        const newSubStageData = {
          subStageName,
          outlook,
          startDate,
          endDate
        };
        const subStageAlreadyExist = subStages?.find(
          ({ subStageName: name }) => name === subStageName
        );
        const updatedSubStages = [...subStages];
        if (!subStageAlreadyExist && subStageToEdit === '') {
          // add new subStage
          updatedSubStages.push(newSubStageData);
        } else {
          // update existing substages
          const subStageIndex = subStages?.findIndex(
            (item) => item.subStageName === subStageToEdit
          );
          updatedSubStages[subStageIndex] = { ...newSubStageData };
        }

        dispatch(setSubStages({ subStages: [...updatedSubStages] }));
        onCancel();
      })
      .catch(() => noop());
  };

  const disabledDate = (current) => current.isBefore(currentDate, 'day');
  const checkDisabled = () => stageDateRange.length !== 2;

  const removeSubStageHandler = (item) => {
    const updatedSubStages = subStages?.filter(
      ({ subStageName }) => subStageName !== item?.subStageName
    );
    dispatch(setSubStages({ subStages: [...updatedSubStages] }));
    if (subStageToEdit === item?.subStageName && subStagesFormVisibility) {
      onCancel();
    }
  };

  const onEdit = (item) => {
    const {
      subStageName, outlook: subStageOutlook, startDate, endDate
    } = item;
    setSubStageToEdit(subStageName);
    form.setFieldsValue({
      subStageName,
      subStageOutlook,
      subStageRange: [startDate, endDate]
    });
    setSubStagesFormVisibility(true);
  };

  const onDelete = (item) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: <h5>{t('component.project.manager.timelines.remove.confirmation.message')}</h5>,
      onOk() {
        removeSubStageHandler(item);
      }
    });
  };

  const onDragEnd = (result) => {
    const subStagesClone = [...subStages];
    if (!result.destination) return;
    const items = Array.from(subStagesClone);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    dispatch(setSubStages({ subStages: items }));
  };

  return (
    <>
      {
        loading && <div className="d-flex justify-content-center align-items-center project-stage-form-loader"><Loading /></div>
      }
      <Form.Item
        hidden
        data-i="form-item-metric-type"
        name="metricType" />
      <Form.Item
        hidden
        data-i="form-item-metric-dependencies"
        name="dependencies" />
      <Form.Item
        hidden
        data-i="form-item-metric-status"
        name="metricStatus" />
      <Form.Item
        data-i="form-item-project-timeline-stage"
        name="stage"
        label={t('component.project.manager.timelines.selectStage')}
        rules={[
          {
            required: true,
            message: t('component.project.manager.resources.form.validation.stageName.message')
          }
        ]}
        hasFeedback>
        <Select
          allowClear
          getPopupContainer={(trigger) => trigger.parentElement}
          showSearch
          placeholder={t('component.project.manager.timelines.selectStage')}
          optionFilterProp="children"
          filterOption={(input, option) => (option?.label ?? '').includes(input)
            || option?.label?.toLowerCase().indexOf(input?.toLowerCase()) >= 0}
          filterSort={(optionA, optionB) => (optionA?.label ?? '')
            .toLowerCase()
            .localeCompare((optionB?.label ?? '').toLowerCase())}
          options={createOptionList(filteredStages, 'name', 'name')} />
      </Form.Item>
      <Form.Item
        data-i="form-item-project-timeline-stage-startDate"
        name="stageDateRange"
        label={t('component.project.manager.timelines.stage.selectDate')}
        rules={[
          () => ({
            validator(_, value) {
              if (!value) {
                return Promise.reject(
                  new Error(t('component.project.manager.resources.form.validation.stageDate.message'))
                );
              }
              return Promise.resolve();
            }
          })
        ]}>
        <RangePicker
          className="w-100"
          getPopupContainer={(trigger) => trigger.parentElement}
          allowClear={false}
          disabledDate={disabledDate}
          disabled={subStages.length > 0}
          format={DATE_FORMAT_MM_DD_YYYY} />
      </Form.Item>
      <div ref={stageCirclePickerRef}>
        <Form.Item
          name="outlook"
          label={t('component.project.manager.timelines.color')}
          rules={[{
            required: true,
            message: t('component.project.manager.timelines.color.required')
          }]}
          hasFeedback>
          <CirclePicker
            circlePickerRef={stageCirclePickerRef}
            className="w-100"
            color={outlookValue}
            colorChange={(color) => form.setFieldsValue({ outlook: color })}
            triangle="hide"
            colors={stagesColors}
            id="form-item-project-timeline-outlook-field"
            styles={{ width: '100% !important' }} />
        </Form.Item>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="subStageName">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}>
              {subStages.map((item, index) => (
                <Draggable key={item.subStageName} draggableId={item.subStageName} index={index}>
                  {(draggbleProvider) => (
                    <Row
                      justify="space-between align-items-center"
                      key={item?.subStageName}
                      className="mx-0 my-3 px-0"
                      ref={draggbleProvider.innerRef}
                      {...draggbleProvider.draggableProps}
                      {...draggbleProvider.dragHandleProps}>
                      <Col span={1}>
                        <div className="outlook-item" style={{ background: item?.outlook }} />
                      </Col>
                      <Col span={21}>{item?.subStageName}</Col>
                      <Col span={2}>
                        <span>
                          <EditOutlined
                            className="mr-2"
                            id="edit-substage-btn"
                            onClick={() => onEdit(item)} />
                          <DeleteOutlined
                            onClick={() => onDelete(item)}
                            id="remove-substage-btn" />
                        </span>
                      </Col>
                    </Row>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {subStagesFormVisibility ? (
        <Card className="mx-0 mt-2 px-0" id="subStagesCard">
          <Form.Item
            id="subStageName-formItem"
            name={PROJECT_SUBSTAGE_KEYS.subStageName}
            label={t('component.project.manager.timelines.subStage')}
            rules={[{
              required: true,
              message: t('component.project.manager.resources.form.validation.subStageName.message')
            }]}
            hasFeedback>
            <Select
              name={PROJECT_SUBSTAGE_KEYS.subStageName}
              getPopupContainer={(trigger) => trigger.parentElement}
              allowClear
              showSearch
              placeholder={t(
                'component.project.manager.timelines.subStage'
              )}
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label ?? '').includes(input)}
              filterSort={(optionA, optionB) => (optionA?.label ?? '')
                .toLowerCase()
                .localeCompare((optionB?.label ?? '').toLowerCase())}
              options={createOptionList(filteredSubStages, 'name', 'name')} />
          </Form.Item>
          <Form.Item
            id="subStageRange-formItem"
            name={PROJECT_SUBSTAGE_KEYS.subStageRange}
            label={t(
              'component.project.manager.timelines.stage.subStageDate'
            )}
            rules={[{
              required: true,
              message: t('component.project.manager.resources.form.validation.subStageDate.message')
            }]}
            hasFeedback>
            <RangePicker
              className="w-100"
              getPopupContainer={(trigger) => trigger.parentElement}
              disabledDate={disabledDate}
              format={DATE_FORMAT_MM_DD_YYYY} />
          </Form.Item>
          <div ref={substageCirclePickerRef}>
            <Form.Item
              id="subStageColor-formItem"
              label={t('component.project.manager.timelines.color')}
              name={PROJECT_SUBSTAGE_KEYS.subStageOutlook}
              rules={[{
                required: true,
                message: t('component.project.manager.timelines.color.required')
              }]}
              hasFeedback>
              <CirclePicker
                circlePickerRef={substageCirclePickerRef}
                className="w-100"
                color={subStageOutlookValue}
                colorChange={(color) => form.setFieldsValue({ subStageOutlook: color })}
                triangle="hide"
                styles={{ width: '100% !important' }}
                id="subStageColor"
                colors={stagesColors} />
            </Form.Item>

          </div>
          <Row justify="center" gutter={8}>
            <Col lg={12} md={12}>
              <Button
                block
                id="subStage-form-cancel-button"
                onClick={onCancel}>
                {t('component.projectMetrics.form.cancel')}
              </Button>
            </Col>
            <Col lg={12} md={12}>
              <Button
                htmlType="button"
                block
                onClick={onAddSubStage}
                type="primary"
                id="subStage-form-add-button">
                {subStageToEdit
                  ? t('component.common.update.label')
                  : t('component.common.add.label')}
              </Button>
            </Col>
          </Row>
        </Card>
      ) : (
        <Button
          className="mx-0 px-0"
          type="link"
          size="small"
          disabled={checkDisabled()}
          onClick={showSubStagesForm}
          id="add-more-btn-sub-stage"
          icon={<PlusOutlined />}>
          {t('component.project.manager.timelines.stage.addSubStages')}
        </Button>
      )}
    </>
  );
};

export default ProjectStageFormFields;
