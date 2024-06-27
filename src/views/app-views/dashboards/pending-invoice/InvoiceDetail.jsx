import React, { useEffect, useState } from 'react';

import {
  Row, Col, Typography
} from 'antd';
import DataTable from 'components/shared-components/DataTable';
import { useTranslation } from 'react-i18next';
import { getInvoiceData } from 'utils/utils';
import { pendingInvoiceTableColumns } from './PendingInvoiceTableColumns';

const { Title, Text } = Typography;

const InvoiceDetail = ({ invoiceData, loading }) => {
  const { t } = useTranslation();
  const [invoiceInfo, setInvoiceInfo] = useState({
    invoiceDate: '',
    totalAmountToBeCharged: '',
    firstName: '',
    lastName: '',
    email: ''
  });
  const isNotEmpty = (obj) => Object.keys(obj).length > 0;

  useEffect(() => {
    if (isNotEmpty(invoiceData)) {
      setInvoiceInfo({ ...getInvoiceData(invoiceData) });
    }
  }, [invoiceData]);

  return (
    <Row>
      <Col span={24}>
        {isNotEmpty(invoiceData) && (
        <Row gutter={12}>
          <Col sm={24} md={24} lg={5} span={8}>
            <Title level={3} className="mt-0 mb-2">{t('component.invoice.details')}</Title>
            <Title level={4} className="mt-0 mb-2">
              {t('component.invoice.first.name')}
              <Text>{invoiceInfo.firstName}</Text>
            </Title>
            <Title level={4} className="mt-0 mb-2">
              {t('component.invoice.last.name')}
              <Text>{invoiceInfo.lastName}</Text>
            </Title>
            <Title level={4} className="mt-0 mb-2">
              {t('component.invoice.email')}
              <Text>{invoiceInfo.email}</Text>
            </Title>
            <Title level={4} className="mt-0 mb-2">
              {t('component.invoice.date')}
              <Text>{invoiceInfo.invoiceDate}</Text>
            </Title>
          </Col>
        </Row>
        )}

        <Row>
          <Col span={24} className="mt-4">
            <DataTable
              id="id"
              columns={pendingInvoiceTableColumns()}
              data={isNotEmpty(invoiceData) ? [invoiceData] : []}
              loading={loading} />
          </Col>
        </Row>

        {isNotEmpty(invoiceData) && (
        <Row className="text-right mt-5">
          <Col sm={24} md={24} lg={24} span={8}>
            <Title level={4} className="mt-3 mb-2">
              {t('component.invoice.sub.total')}
              <Text>{invoiceInfo.totalAmountToBeCharged}</Text>
            </Title>
            <Title level={4} className="mt-0 mb-2">
              {t('component.invoice.total.amount')}
              <Text>{invoiceInfo.totalAmountToBeCharged}</Text>
            </Title>
          </Col>
        </Row>
        )}
      </Col>
    </Row>
  );
};

export default InvoiceDetail;
