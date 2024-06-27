import {
  Alert,
  Button,
  Form,
  Input,
  Row,
  Card,
  Col,
  Tag,
  Tooltip,
  Space,
  notification,
  InputNumber
} from 'antd';
import DataTransfer from 'components/shared-components/DataTransfer';
import Modal from 'components/shared-components/Modal/index';
import { REGEX } from 'constants/RegexConstant';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getMetricsData, preProcessingData } from 'utils/utils';
import { PlusOutlined } from '@ant-design/icons';
import { PROJECT_METRICS } from 'constants/MiscConstant';

const FormItemTitleField = 'title';
const initialStageToEdit = { stage: '', subStages: [] };
const initialSubStageInputField = { inputValue: '', inputVisible: false };

const ProjectMetricsModal = ({
  globalData,
  companyData,
  metricKey,
  modalTitle,
  metricName,
  label,
  placeholder,
  validMessage,
  setMetricsModalVisibility,
  updateProjectConfigurations
}) => {
  const [addFormVisibility, setAddFormVisibility] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [projectMetrics, setProjectMetrics] = useState({
    selectedData: [],
    selectedKeys: []
  });

  const [stageToEdit, setStageToEdit] = useState(initialStageToEdit);
  const [subStageInputField, setSubStageInputField] = useState(initialSubStageInputField);
  const [editInputIndex, setEditInputIndex] = useState(-1);

  const inputRef = useRef(null);

  const isStages = metricKey === PROJECT_METRICS.STAGES;
  const isResourceDiscipline = metricKey === PROJECT_METRICS.RESOURCE;

  const [form] = Form.useForm();
  const { t } = useTranslation();

  useEffect(() => {
    const [list, targetKeys] = preProcessingData(
      globalData,
      companyData,
      isStages,
      isResourceDiscipline
    );
    setProjectMetrics({
      selectedData: list,
      selectedKeys: targetKeys
    });

    return () => {
      setAddFormVisibility(false);
    };
  }, [globalData, companyData]);

  // useEffect to focus on inputfield when AddNewSubstage is clicked
  useEffect(() => {
    if (subStageInputField.inputVisible) {
      inputRef.current?.focus();
    }
  }, [subStageInputField.inputVisible]);

  // function to remove substage
  const handleClose = (removedTag) => {
    setStageToEdit({
      ...stageToEdit,
      subStages: stageToEdit.subStages.filter(
        ({ name }) => name !== removedTag
      )
    });
  };

  // function to show input field for subStage
  const showInput = () => {
    setSubStageInputField({
      ...subStageInputField,
      inputVisible: true
    });
    setEditInputIndex(-1);
  };
  const handleInputChange = (e) => {
    setSubStageInputField({
      ...subStageInputField,
      inputValue: e.target.value
    });
  };
  const handleInputConfirm = () => {
    const dataAlreadyExist = stageToEdit.subStages?.find(
      ({ name }) => name.toLowerCase() === subStageInputField.inputValue.trim().toLowerCase()
    );
    if (subStageInputField.inputValue && !dataAlreadyExist) {
      setStageToEdit({
        ...stageToEdit,
        subStages: [...stageToEdit.subStages, { name: subStageInputField.inputValue.trim() }]
      });
    }
    setSubStageInputField(initialSubStageInputField);
  };

  const onSubStageDoubleClick = (e, inputValue, index) => {
    setEditInputIndex(index);
    setSubStageInputField({
      ...subStageInputField,
      inputValue
    });
    e.preventDefault();
  };
  const handleEditInputConfirm = () => {
    const { inputValue } = subStageInputField;
    if (inputValue.trim()) {
      const newTags = [...stageToEdit.subStages];
      newTags[editInputIndex].name = inputValue.trim();
      setStageToEdit({ ...stageToEdit, subStages: newTags });
      setEditInputIndex(-1);
      setSubStageInputField({
        ...subStageInputField,
        inputValue: ''
      });
    }
  };

  const getResourceDisciplineCapacity = (resourceCapacity) => (isResourceDiscipline
     && { resourceCapacity });

  const handleCancelForm = () => {
    form.resetFields();
    setAddFormVisibility(false);
    setSubStageInputField(initialSubStageInputField);
    setStageToEdit(initialStageToEdit);
  };

  const handleSubmit = (values) => {
    const title = values.title.trim();
    const { resourceCapacity } = values;
    if (title.length > 0) {
      const dataAlreadyExist = projectMetrics?.selectedData?.find(
        (item) => item.title.toLowerCase() === title.toLowerCase()
      );

      const sameStageAndSubStage = (stageToEdit.subStages || []).find(
        (item) => item.name.toLowerCase() === title.toLowerCase()
      );

      if (dataAlreadyExist && stageToEdit.stage !== dataAlreadyExist?.title) {
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
        }, 2000);
      } else if (sameStageAndSubStage) {
        notification.error({
          message: t('component.project.metrics.sameStageAndSubStage')
        });
      } else {
        let { selectedData = [] } = projectMetrics;

        if (stageToEdit.stage) {
          const stageIndex = selectedData?.findIndex(
            ({ title: name }) => name === stageToEdit.stage
          );
          selectedData[stageIndex] = {
            ...selectedData[stageIndex],
            title,
            subStages: stageToEdit.subStages,
            ...getResourceDisciplineCapacity(resourceCapacity)
          };
        } else {
          selectedData = [
            ...selectedData,
            {
              key: selectedData.length + 1,
              title,
              ...(isStages ? { subStages: stageToEdit.subStages } : {}),
              ...getResourceDisciplineCapacity(resourceCapacity)
            }
          ];
        }
        setProjectMetrics({
          ...projectMetrics,
          selectedData
        });
        setIsSaveDisabled(false);
        handleCancelForm();
      }
    }
  };
  const addNewDataForm = () => (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
      name="user-modal-form"
      data-i="add-projectCategories-form">
      <Form.Item
        className="mb-2"
        data-i="form-item-projectCategories"
        name={FormItemTitleField}
        label={label}
        rules={[
          {
            required: true,
            message: placeholder
          },
          {
            pattern: REGEX.ALPHA_NUMERIC,
            message: validMessage
          }
        ]}
        hasFeedback>
        <Input
          data-i="form-item-milestoneName-inputField"
          id="stage-input-field"
          allowClear
          placeholder={placeholder} />
      </Form.Item>
      {
      isResourceDiscipline && (
        <Form.Item
          className="mb-2"
          data-i="form-item-resourceDiscipline-hours"
          name="resourceCapacity"
          label={t('component.project.metrics.resourceDiscipline.hours.label')}
          rules={[
            {
              required: true,
              message: t('component.project.metrics.resourceDiscipline.hours.placeholder')
            },
            {
              validator: (_, value) => {
                if (value < 1 || value > 15) {
                  return Promise.reject(t('component.project.metrics.resourceDiscipline.hours.max'));
                }
                return Promise.resolve();
              }
            }
          ]}
          hasFeedback>
          <InputNumber
            className="w-100"
            data-i="form-item-resourceDiscipline-hours-inputField"
            id="resourceDiscipline-hours-inputField"
            allowClear
            placeholder={t('component.project.metrics.resourceDiscipline.hours.placeholder')} />
        </Form.Item>
      )
    }

      {isStages && (
      <Space size={[0, 8]} wrap>
        <Space size={[0, 8]} wrap>
          {stageToEdit?.subStages?.map(({ name: tag }, index) => {
            if (editInputIndex === index) {
              return (
                <Input
                  key={tag}
                  size="small"
                  value={subStageInputField.inputValue}
                  onChange={handleInputChange}
                  onBlur={handleEditInputConfirm}
                  onPressEnter={handleEditInputConfirm} />
              );
            }

            const isLongTag = tag.length > 20;
            const tagElem = (
              <Tag key={tag} closable onClose={() => handleClose(tag)}>
                <span
                  onDoubleClick={(e) => onSubStageDoubleClick(e, tag, index)}>
                  {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                </span>
              </Tag>
            );
            return isLongTag ? (
              <Tooltip title={tag} key={tag}>
                {tagElem}
              </Tooltip>
            ) : (
              tagElem
            );
          })}
        </Space>

        {subStageInputField.inputVisible && (
        <Input
          data-i="sub-stage-inputField"
          id="sub-stage-inputField"
          ref={inputRef}
          className="mb-2"
          placeholder={t(
            'component.project.stages.subStage.placeholder'
          )}
          value={subStageInputField.inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm} />
        )}
        <Button
          type="link"
          size="small"
          onClick={showInput}
          id="sub-stage-add-more"
          disabled={subStageInputField.inputVisible && !subStageInputField.inputValue}
          icon={<PlusOutlined />}>
          {t('component.project.stages.subStage.label')}
        </Button>
      </Space>
      )}
      <Form.Item shouldUpdate className="mb-0">
        {() => (
          <Row justify="center" gutter={8}>
            <Col lg={12} md={12}>
              <Button
                block
                data-i="projectCategories-form-cancel-button"
                id="stage-form-cancel-button"
                onClick={handleCancelForm}>
                {t('component.projectMetrics.form.cancel')}
              </Button>
            </Col>
            <Col lg={12} md={12}>
              <Button
                block
                htmlType="submit"
                type="primary"
                data-i="addProjectCategories-button"
                id="stage-form-submit-button">
                {stageToEdit.stage
                  ? t('component.common.update.label')
                  : t('component.common.add.label')}
              </Button>
            </Col>
          </Row>
        )}
      </Form.Item>
    </Form>
  );

  const addNewData = () => (addFormVisibility ? (
    <Card className="mb-0">
      <motion.div
        animate={{
          opacity: showMessage ? 1 : 0,
          marginBottom: showMessage ? 20 : 0,
          height: showMessage ? 30 : 0
        }}
        initial={{ opacity: 0, marginBottom: 0, height: 0 }}>
        <Alert
          message={t('component.project.metrics.valueAlreadyExist', {
            metricName
          })}
          showIcon
          type="error" />
      </motion.div>
      {addNewDataForm()}
    </Card>
  ) : (
    <Button
      icon={<PlusOutlined />}
      style={{ width: '100%' }}
      data-i="add-new-metric-button"
      id="add-new-metric-button"
      onClick={() => {
        setAddFormVisibility(true);
      }}>
      {label}
    </Button>
  ));

  // will close the modal
  const onCancel = () => {
    setMetricsModalVisibility(false);
  };

  // will close the modal and hit the endpoint to save changes
  const onOk = () => {
    setMetricsModalVisibility(false);
    updateProjectConfigurations(
      getMetricsData(
        projectMetrics.selectedData,
        projectMetrics.selectedKeys,
        globalData.length,
        isStages
      ),
      metricKey
    );
  };
  // on ADD and Remove params(nextTargetKeys, direction, moveKeys)
  const handleChange = (nextTargetKeys) => {
    setProjectMetrics({ ...projectMetrics, selectedKeys: nextTargetKeys });
    setIsSaveDisabled(false);
  };

  const handleDelete = ({ key, title }) => {
    // to close the form when item to edit got deleted
    if (stageToEdit.stage === title) {
      handleCancelForm();
    }
    const selectedData = projectMetrics?.selectedData?.filter(
      (data) => data?.title !== title
    );
    const selectedKeys = projectMetrics?.selectedKeys?.filter((data) => data !== key);

    setProjectMetrics({
      selectedData,
      selectedKeys
    });
    setIsSaveDisabled(false);
  };

  const handleEdit = ({ title }) => {
    setAddFormVisibility(true);
    const selectedItem = projectMetrics.selectedData?.find(
      (stage) => stage?.title === title
    );
    form.setFieldsValue({
      [FormItemTitleField]: title,
      ...getResourceDisciplineCapacity(selectedItem?.resourceCapacity)
    });
    setStageToEdit({ stage: title, subStages: selectedItem?.subStages || [] });
  };

  return (
    <Modal
      width={550}
      forceRender
      data-i="metrics-modal"
      open
      title={modalTitle}
      confirmOnCancel={!isSaveDisabled}
      onCancel={onCancel}
      onOk={onOk}
      okButtonProps={{ disabled: isSaveDisabled }}
      okText={t('component.common.save.label')}>
      <DataTransfer
        data={projectMetrics.selectedData}
        keys={projectMetrics.selectedKeys}
        handleChange={handleChange}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        isStages={isStages}
        titles={[
          t('component.button.label.inActive'),
          t('component.button.label.active')
        ]} />
      <div className="mt-4">{addNewData()}</div>
    </Modal>
  );
};
ProjectMetricsModal.propType = {
  globalData: PropTypes.arrayOf([PropTypes.string]),
  companyData: PropTypes.arrayOf([PropTypes.string]),
  metricKey: PropTypes.string,
  modalTitle: PropTypes.string,
  metricName: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  validMessage: PropTypes.string,
  setMetricsModalVisibility: PropTypes.func,
  updateProjectConfigurations: PropTypes.func
};
export default ProjectMetricsModal;
