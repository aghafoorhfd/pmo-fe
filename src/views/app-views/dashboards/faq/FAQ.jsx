import React from 'react';
import {
  Typography, Collapse, Empty, Divider
} from 'antd';
import { useSelector } from 'react-redux';
import { faqData, contactSupportEmail } from 'mock/data/faqAndSupportData';
import { ROLES_ACCESS_TYPES } from 'constants/MiscConstant';
import { useTranslation } from 'react-i18next';
import { hasAccessType } from 'utils/utils';
import './index.css';

const { Title } = Typography;
const { Panel } = Collapse;

const FAQ = () => {
  const {
    auth: { userProfile: { accessType } }
  } = useSelector((state) => ({
    auth: state.auth
  }));
  const { t } = useTranslation();

  const renderFaqItems = (faqs) => faqs.map(({ question, answer, key }) => (
    <Panel header={question} key={key}>
      {answer}
    </Panel>
  ));

  const areFaqsEmpty = () => {
    if (hasAccessType(accessType, ROLES_ACCESS_TYPES.SUPER_ADMIN.key)) {
      return Object.keys(faqData).every((faqAccessType) => faqData[faqAccessType].length === 0);
    }
    return faqData[accessType].length === 0;
  };

  const renderFaqContent = () => {
    if (areFaqsEmpty()) {
      return (
        <div>
          <Empty description={t('component.faq.not.available')} />
        </div>
      );
    }

    if (hasAccessType(accessType, ROLES_ACCESS_TYPES.SUPER_ADMIN.key)) {
      return Object.keys(faqData).map((faqAccessType) => (
        faqData[faqAccessType].length > 0 && (
          < >
            <h4>{t(ROLES_ACCESS_TYPES[faqAccessType].value)}</h4>
            {renderFaqItems(faqData[faqAccessType])}
          </>
        )
      ));
    }

    return renderFaqItems(faqData[accessType]);
  };

  return (
    <>
      <Title level={2}>{t('component.faq.heading')}</Title>
      <p>
        {t('component.faq.description')}
        &nbsp;
        <strong>{contactSupportEmail}</strong>
      </p>
      <Divider className="my-8" />

      <Collapse defaultActiveKey={['1']} bordered={false} className="faq-collapse">
        {renderFaqContent()}
      </Collapse>
    </>
  );
};

export default FAQ;
