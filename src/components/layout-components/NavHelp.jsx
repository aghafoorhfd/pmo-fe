import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Menu, Dropdown, Button } from 'antd';
import { WechatOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import Modal from 'components/shared-components/Modal/index';
import { HELP_TYPE } from 'constants/MiscConstant';
import { contactSupportEmail } from 'mock/data/faqAndSupportData';
import { useNavigate } from 'react-router-dom';
import ROUTES from 'constants/RouteConstants';

export function NavHelp() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isUserLoggedIn = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleClick = ({ key }) => {
    switch (key) {
      case HELP_TYPE.FAQ.key:
        navigate(ROUTES.FAQ.path);
        break;
      case HELP_TYPE.CONTACT_SUPPORT.key:
        setIsModalOpen(true);
        break;
      default:
        break;
    }
  };

  const menu = (
    <Menu
      items={[
        ...isUserLoggedIn ? [{
          key: HELP_TYPE.FAQ.key,
          label: t('component.faq.heading'),
          icon: <WechatOutlined className="font-size-md" />
        }] : [],
        {
          key: HELP_TYPE.CONTACT_SUPPORT.key,
          label: t('component.contact.support.help.label'),
          icon: <CustomerServiceOutlined className="font-size-md" />
        }
      ]}
      onClick={handleClick} />
  );
  const handleOnCancel = () => {
    setIsModalOpen(false);
  };

  const gradientButtonStyle = {
    background: 'linear-gradient(to right, #6253E1, #04BEFE)',
    border: 'none',
    color: 'white'
  };

  return (
    <>
      <Dropdown overlay={menu} placement="bottomRight" trigger={['click']} getPopupContainer={(trigger) => trigger.parentNode}>
        <div className="nav-item cursor-pointer pr-1">
          <Button style={gradientButtonStyle}>{t('component.contact.support.button.label')}</Button>
        </div>
      </Dropdown>
      <Modal
        footer={[
          <Button key="ok" className="w-25" type="primary" onClick={handleOnCancel}>
            {t('component.contact.support.modal.ok.title')}
          </Button>
        ]}
        title={t('component.contact.support.modal.heading')}
        isOpen={isModalOpen}
        onCancel={handleOnCancel}>
        <div className="d-flex flex-column align-items-center">
          <p>{t('component.contact.support.modal.detail')}</p>
          <a href={`mailto:${contactSupportEmail}`}>{contactSupportEmail}</a>
        </div>
      </Modal>
    </>
  );
}

export default NavHelp;
