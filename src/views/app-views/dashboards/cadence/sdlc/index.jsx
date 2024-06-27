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
import { getQuartersDataTableColumns } from '../data-table-config';
import './index.css';

const { SDLC_CAPS } = methodologyType;

const Sdlc = () => {
  const [formVisibility, setFormVisibility] = useState(false);

  const [form] = Form.useForm();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    projectCadence: { sdlc: sdlcDetails },
    sdlcLoading: loading
  } = useSelector((state) => state.projectDetails);

  const handleSubmit = (values) => {
    const data = {
      ...values,
      methodologyType: SDLC_CAPS,
      fiscalYearName: values?.fiscalYearName?.trim()
    };
    if (sdlcDetails) {
      dispatch(updateProjectCadence(data));
    } else {
      data.fiscalYearStartDate = moment(data?.fiscalYearStartDate).format(
        DATE_FORMAT_YYYY_MM_DD
      );
      dispatch(saveProjectCadence(data));
    }
    setFormVisibility(false);
  };

  const onEdit = async () => {
    form.setFieldsValue({
      ...sdlcDetails,
      fiscalYearStartDate: moment(
        sdlcDetails?.fiscalYearStartDate,
        DATE_FORMAT_YYYY_MM_DD
      )
    });
    setFormVisibility(true);
  };

  useEffect(() => {
    if (!loading && !sdlcDetails) {
      setFormVisibility(true);
    }
  }, [loading]);

  return (
    <Card
      data-i="sdlc-card"
      heading={t('component.cadence.sdlc.cadence.title')}
      style={{ minHeight: '266px', height: 'auto' }}
      showBorder>
      {loading ? (
        <Loading />
      ) : (
        <>
          {sdlcDetails?.currentYearQuarters && (
            <DataTable
              dataI="quaters"
              id="id"
              columns={getQuartersDataTableColumns(sdlcDetails?.quartersNames)}
              data={sdlcDetails?.currentYearQuarters}
              bordered
              className="mb-4 agile-table" />
          )}

          {formVisibility ? (
            <Form
              form={form}
              name="sdlc-cadence-form"
              data-i="sdlc-cadence-form"
              onFinish={handleSubmit}>
              <Row gutter={[16, 4]}>
                <Col xxl={12} xl={12} lg={24} md={24} xs={24}>
                  <Form.Item
                    name="fiscalYearStartDate"
                    label={t('component.cadence.sdlc.fiscalYearStartDate')}
                    rules={[
                      {
                        required: true
                      }
                    ]}
                    labelAlign="left"
                    labelCol={{
                      xxl: { span: 7 },
                      xl: { span: 8 },
                      lg: { span: 12 },
                      span: 12
                    }}>

                    <DatePicker
                      data-i="fiscalYearStartDateField"
                      id="fiscalYearStartDateField"
                      disabled={sdlcDetails}
                      className="agile-form-field"
                      format={DATE_FORMAT_MM_DD_YYYY}
                      placeholder={t(
                        'component.projectMetrics.form.placeholder.date'
                      )} />
                  </Form.Item>
                </Col>

                <Col xxl={12} xl={12} lg={24} md={24} xs={24}>
                  <Form.Item
                    name="fiscalYearName"
                    label={t('component.cadence.sdlc.fiscalYear')}
                    rules={[
                      {
                        required: true,
                        message: t('component.cadence.sdlc.yearName.valid')
                      }
                    ]}
                    labelAlign="left"
                    labelCol={{
                      xxl: { span: 5 },
                      xl: { span: 6 },
                      lg: { span: 12 },
                      span: 12
                    }}>
                    <Input
                      data-i="yearNameField"
                      id="yearNameField"
                      className="agile-form-field"
                      allowClear
                      placeholder={t(
                        'component.cadence.sdlc.yearName.placeholder'
                      )} />
                  </Form.Item>
                </Col>
              </Row>
              <Row justify="start">
                {sdlcDetails ? (
                  <>
                    <Button
                      className="action-button mr-2"
                      id="sdlc-cancel-btn"
                      onClick={() => setFormVisibility(false)}>
                      {t('component.auth.cancel')}
                    </Button>
                    <Button
                      className="action-button"
                      data-i="sdlc-save-btn"
                      id="sdlc-save-btn"
                      type="primary"
                      htmlType="submit">
                      {t('component.common.save.label')}
                    </Button>
                  </>
                ) : (
                  <Button
                    className="action-button"
                    data-i="sdlc-activate-btn"
                    id="sdlc-activate-btn"
                    type="primary"
                    htmlType="submit">
                    {t('component.cadence.button.activate')}
                  </Button>
                )}
              </Row>
            </Form>
          ) : (
            <Row justify="start">
              <Button className="action-button" onClick={onEdit} id="sdlc-edit-btn">
                {t('component.common.edit.label')}
              </Button>
            </Row>
          )}
        </>
      )}
    </Card>
  );
};

export default Sdlc;
