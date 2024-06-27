import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

import {
  Button, Col, Card, Row, Typography
} from 'antd';
import { CloseCircleOutlined, EditOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import './Styles.css';

// Setting Confings
import { settingsList } from './SettingConfigs';

const SettingsItem = ({ values }) => {
  const { t } = useTranslation();
  const { Text } = Typography;

  const [openRowKey, setOpenRowKey] = useState(null);

  const {
    description, forms, heading, icon, name
  } = values;

  const handleEditClick = (value) => {
    if (value === openRowKey) setOpenRowKey(null);
    else {
      setOpenRowKey(value);
    }
  };

  return (
    <Card>
      <Row
        className="ml-2 mb-3"
        align="middle">
        <Col data-i="icon" className="ant-col ant-col-xs-24 ant-col-xl-2">
          {icon}
        </Col>

        <Col data-i="heading" className="ant-col ant-col-xs-24 ant-col-xl-20">
          <Text strong>
            {heading}
          </Text>
          <br />
          <Text>
            {description}
          </Text>
        </Col>

        <Col className="ant-col ant-col-xs-24 ant-col-xl-2">
          <Button
            data-i="edit/close-btn"
            size="small"
            icon={openRowKey === name ? <CloseCircleOutlined /> : <EditOutlined />}
            onClick={() => handleEditClick(name)}>
            {openRowKey === name ? t('component.conflict.manager.button.close') : t('component.common.edit.label')}
          </Button>
        </Col>
      </Row>

      <Card
        id={name}
        className={openRowKey && openRowKey === name ? 'card-animation' : 'card-animation card-initial-style'}>
        <Col>
          {forms}
        </Col>
      </Card>
    </Card>
  );
};

SettingsItem.propTypes = {
  values: PropTypes.shape({
    description: PropTypes.string.isRequired,
    forms: PropTypes.element.isRequired,
    heading: PropTypes.string.isRequired,
    icon: PropTypes.element.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired
};

export default function SettingsScreen() {
  const { t } = useTranslation();

  return (
    <Card data-i="settings-main-heading" title={t('component.user.profile.settings.screen.mainHeading')}>
      {
        settingsList.map((settings) => (
          <Fragment key={settings.key}>
            <SettingsItem values={settings} />
          </Fragment>
        ))
      }
    </Card>
  );
}
