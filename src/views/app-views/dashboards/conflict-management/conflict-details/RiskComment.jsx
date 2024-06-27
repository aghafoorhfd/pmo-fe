import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Form, Input
} from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  OrderedListOutlined, UnorderedListOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import './Styles.css';
import { Card } from 'components/shared-components/Card';
import { spaceValidator } from 'utils/utils';
import { CONFLICT_ACTIONS } from 'constants/MiscConstant';

const RiskComment = ({
  selectedTab,
  onClose,
  handleSubmit,
  isDetailsPageOpened,
  isUserHasAccess,
  checkForms
}) => {
  const { t } = useTranslation();

  const { OPENED } = CONFLICT_ACTIONS;

  const icons = [
    { id: '1', component: BoldOutlined, className: '' },
    { id: '2', component: ItalicOutlined, className: '' },
    { id: '3', component: UnderlineOutlined, className: '' },
    { id: '4', component: UnorderedListOutlined, className: '' },
    { id: '5', component: OrderedListOutlined, className: '' }
  ];
  return (
    <Card
      className="card-container"
      heading={t('component.conflict.manager.your.comment')}>
      <Form.Item
        wrapperCol={24}
        name="conflictNotes"
        className="mt-3"
        rules={[
          {
            validator: (_, value) => spaceValidator(value)
          }
        ]}>
        <Input.TextArea
          placeholder={t('component.conflict.manager.details.commentPlaceHolder')}
          rows={4}
          disabled={selectedTab !== OPENED || isUserHasAccess}
          className="input-fields icon-area" />
      </Form.Item>
      <div className="icon-container">
        {icons.map((icon) => (
          <icon.component
            key={icon.id}
            className={`mr-5 cursor-pointer ${icon.className}`} />
        ))}
      </div>
      <div className="text-right">
        <Button onClick={onClose} className="mr-2">{t('component.auth.cancel')}</Button>
        {selectedTab === OPENED
         && <Button onClick={handleSubmit} disabled={!checkForms} type="primary">{!isDetailsPageOpened ? t('component.common.save.label') : t('component.conflict.manager.button.UpdateRisk')}</Button>}
      </div>
    </Card>
  );
};

RiskComment.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default RiskComment;
