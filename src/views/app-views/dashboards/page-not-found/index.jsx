import React from 'react';
import { Button, Row, Col } from 'antd';
import { useSelector } from 'react-redux';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Flex from 'components/shared-components/Flex';
import { useTranslation } from 'react-i18next';

function PageNotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme.currentTheme);

  return (
    <div className="h-100" data-i="main-container">
      <div className={`h-100 ${theme === 'light' ? 'bg-white' : ''}`}>
        <div className="container-fluid d-flex flex-column justify-content-between h-100 px-md-4 pb-md-4 pt-md-1">
          <div>
            <img className="img-fluid" src={`/img/${theme === 'light' ? 'logo.png' : 'logo-white.png'}`} alt="logo" />
          </div>
          <div className="container">
            <Row align="middle">
              <Col xs={24} sm={24} md={8}>
                <h1 className="font-weight-bold mb-4 display-4">{t('component.page.not.found.main.heading')}</h1>
                <p className="font-size-md mb-4">
                  {t('component.page.not.found.subHeading')}
                </p>
                <Button type="primary" icon={<ArrowLeftOutlined />} data-i="go-back" onClick={() => navigate('/')}>
                  {t('component.page.not.found.button.GoBack')}
                </Button>
              </Col>
              <Col xs={24} sm={24} md={{ span: 14, offset: 2 }}>
                <img className="img-fluid mt-md-0 mt-4" src="/img/others/error-404.png" alt="" />
              </Col>
            </Row>
          </div>
          <Flex alignItems="center" mobileFlex justifyContent="between">
            <span>
              {t('component.page.not.found.copyWrite')}
              {' '}
              &copy;
              {new Date().getFullYear()}
            </span>
            <div>
              <span className="text-gray">
                {t('component.page.not.found.term&Conditions')}
              </span>
              <span className="mx-2 text-muted"> | </span>
              <span className="text-gray">
                {t('component.page.not.found.privacy&Policy')}
              </span>
            </div>
          </Flex>
        </div>
      </div>
    </div>
  );
}

export default PageNotFound;
