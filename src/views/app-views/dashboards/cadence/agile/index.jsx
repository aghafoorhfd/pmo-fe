import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row
} from 'antd';
import { Card } from 'components/shared-components/Card';
import DataTable from 'components/shared-components/DataTable';
import Loading from 'components/shared-components/Loading';
import { DATE_FORMAT_YYYY_MM_DD, DATE_FORMAT_MM_DD_YYYY } from 'constants/DateConstant';
import { methodologyType } from 'constants/ProjectMetricsConstant';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  saveProjectCadence,
  updateProjectCadence
} from 'store/slices/projectDetailsSlice';
import { getSprintDataTableColumns } from '../data-table-config';
import './index.css';

const { AGILE_CAPS } = methodologyType;

const Agile = () => {
  const [formVisibility, setFormVisibility] = useState(false);
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [sprintHelperText, setSprintHelperText] = useState('');
  const [currentSprintEndDate, setCurrentSprintEndDate] = useState('');
  const sprintDuration = Form.useWatch('sprintDuration', form);
  const sprintStartDate = Form.useWatch('sprintStartDate', form);

  const {
    projectCadence: { agile: agileDetails },
    agileLoading: loading
  } = useSelector((state) => state.projectDetails);

  const handleSubmit = (values) => {
    const data = { methodologyType: AGILE_CAPS, ...values };
    if (agileDetails) {
      dispatch(updateProjectCadence(data));
    } else {
      data.sprintStartDate = moment(data?.sprintStartDate).format(
        DATE_FORMAT_YYYY_MM_DD
      );
      dispatch(saveProjectCadence(data));
    }
    setFormVisibility(false);
  };
  const getCurrentSprintEndDate = (sprints = []) => {
    const currentDate = moment().format(DATE_FORMAT_YYYY_MM_DD);
    const currentSprint = sprints?.find(({ startDate, endDate }) => moment(currentDate).isBetween(startDate, endDate, undefined, '[]')) || sprints[0];
    return currentSprint?.endDate ? moment(currentSprint.endDate) : '';
  };

  const onEdit = () => {
    form.setFieldsValue({
      ...agileDetails,
      sprintStartDate: moment(
        agileDetails.sprintStartDate,
        DATE_FORMAT_YYYY_MM_DD
      )
    });
    setCurrentSprintEndDate(getCurrentSprintEndDate(agileDetails?.currentHalfSprints));
    setFormVisibility(true);
  };

  useEffect(() => {
    if (!loading && !agileDetails) {
      setFormVisibility(true);
    }
  }, [loading, agileDetails]);

  const shouldDisplaySprintMessage = () => (agileDetails
    ? !!currentSprintEndDate : sprintDuration >= 10 && sprintDuration <= 30 && sprintStartDate);

  useEffect(() => {
    if (shouldDisplaySprintMessage()) {
      const sprintEndDate = agileDetails ? currentSprintEndDate : moment(sprintStartDate).add(sprintDuration - 1, 'days');
      const message = `Your sprint will end on ${sprintEndDate.format(DATE_FORMAT_MM_DD_YYYY)} 
      and the end day will be ${sprintEndDate.format('dddd')}`;
      setSprintHelperText(message);
    } else if (sprintHelperText) {
      setSprintHelperText('');
    }
  }, [sprintDuration, sprintStartDate, currentSprintEndDate]);

  return (
    <Card
      data-i="agile-card"
      heading={t('component.cadence.agile.cadence.title')}
      style={{ minHeight: '266px', height: 'auto' }}
      showBorder>
      {loading ? (
        <Loading />
      ) : (
        <>
          {agileDetails?.sprints && (
          <DataTable
            dataI="sprints"
            id="id"
            columns={getSprintDataTableColumns(agileDetails?.currentHalfSprints)}
            data={agileDetails?.sprints}
            bordered
            className="mb-4 agile-table" />
          )}

          {formVisibility ? (
            <Form
              form={form}
              name="agile-cadence-form"
              data-i="agile-cadence-form"
              onSubmit={(e) => e.preventDefault()}
              onFinish={handleSubmit}>
              <Row gutter={24}>
                <Col xxl={12} xl={12} lg={24} md={24} xs={24}>
                  <Form.Item
                    name="sprintStartDate"
                    label={t('component.cadence.agile.sprintStartDate')}
                    labelCol={{
                      xxl: { span: 6 },
                      xl: { span: 7 },
                      lg: { span: 12 },
                      span: 12
                    }}
                    labelAlign="left"
                    rules={[
                      {
                        required: true
                      }
                    ]}>
                    <DatePicker
                      disabled={agileDetails}
                      className="agile-form-field"
                      placeholder={t(
                        'component.projectMetrics.form.placeholder.date'
                      )}
                      format={DATE_FORMAT_MM_DD_YYYY}
                      id="sprint-start-date" />
                  </Form.Item>
                </Col>

                <Col xxl={12} xl={12} lg={24} md={24} xs={24}>
                  <Form.Item
                    data-i="sprint-duration"
                    name="sprintDuration"
                    label={t(
                      'component.projectMetrics.form.label.sprintDuration'
                    )}
                    labelAlign="left"
                    labelCol={{
                      xxl: { span: 6 },
                      xl: { span: 7 },
                      lg: { span: 12 },
                      span: 12
                    }}
                    rules={[
                      {
                        required: true
                      },
                      () => ({
                        validator(_, value) {
                          if (value < 10 || value > 30) {
                            return Promise.reject(
                              new Error(
                                t(
                                  'component.projectMetrics.form.validation.sprintDuration'
                                )
                              )
                            );
                          }
                          return Promise.resolve();
                        }
                      })
                    ]}>
                    <Input
                      type="number"
                      data-i="sprint-duration-input-field"
                      className="agile-form-field"
                      min="10"
                      placeholder={t(
                        'component.cadence.agile.placeholder.enterSprint.duration.days'
                      )}
                      id="sprint-duration" />
                  </Form.Item>
                  {
                sprintHelperText && (
                  <span className="sprint-helper-text">
                    {sprintHelperText}
                  </span>
                )
              }
                </Col>

                <Col xxl={12} xl={12} lg={24} md={24} xs={24}>
                  <Form.Item
                    data-i="sprint-number"
                    name="sprintName"
                    label={t('component.cadence.agile.sprintNumber')}
                    labelCol={{
                      xxl: { span: 6 },
                      xl: { span: 7 },
                      lg: { span: 12 },
                      span: 12
                    }}
                    labelAlign="left"
                    rules={[
                      {
                        required: true
                      },
                      () => ({
                        validator(_, value) {
                          if (value < 0 || value > 10000) {
                            return Promise.reject(
                              new Error(
                                t(
                                  'component.projectMetrics.form.validation.currentSprintName'
                                )
                              )
                            );
                          }
                          return Promise.resolve();
                        }
                      })
                    ]}>
                    <Input
                      type="number"
                      disabled={agileDetails}
                      min="0"
                      className="agile-form-field"
                      placeholder={t(
                        'component.projectMetrics.form.placeholder.currentSprintName'
                      )}
                      id="sprint-name" />
                  </Form.Item>
                </Col>
              </Row>

              <Row justify="start">
                {agileDetails && !loading ? (
                  <>
                    <Button
                      className="action-button  mr-2"
                      id="agile-cancel-btn"
                      onClick={() => setFormVisibility(false)}>
                      {t('component.auth.cancel')}
                    </Button>
                    <Button
                      className="action-button"
                      data-i="agile-save-btn"
                      id="agile-save-btn"
                      type="primary"
                      htmlType="submit">
                      {t('component.common.save.label')}
                    </Button>
                  </>
                ) : (
                  <Button
                    className="action-button "
                    data-i="agile-activate-btn"
                    type="primary"
                    htmlType="submit"
                    id="agile-activate-btn">
                    {t('component.cadence.button.activate')}
                  </Button>
                )}
              </Row>
            </Form>
          ) : (
            <Row justify="start">
              <Button className="action-button" onClick={onEdit} id="agile-edit-btn">
                {t('component.common.edit.label')}
              </Button>
            </Row>
          )}
        </>
      )}
    </Card>
  );
};

export default Agile;
