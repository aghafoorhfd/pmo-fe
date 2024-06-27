import React from 'react';
import { useSelector } from 'react-redux';
import {
  Card, Row, Col, Image
} from 'antd';
import { useTranslation } from 'react-i18next';
import { STATUS } from 'constants/StatusConstant';
import RegisterForm from '../../components/RegisterForm';
import './index.css';

function RegisterOne(props) {
  const { t } = useTranslation();
  const {
    auth: {
      loading, status
    }
  } = useSelector((state) => ({
    auth: state.auth
  }));
  const isSuccess = status === STATUS.SUCCESS;
  return (
    <div className="h-100 register-container" data-i="register-container">
      {loading && (
        <div className="register-loading">
          <div className="lds-dual-ring" />
          <h3 className="text-center text-animation">
            {t('component.loading.message')}
          </h3>
        </div>
      )}
      <div className="container d-flex flex-column justify-content-center h-100">
        <Row justify="center">
          <Col lg={isSuccess ? 8 : 7} md={20} sm={20} xs={20}>
            <Card>
              <div className="my-2">
                <div className="text-center">
                  <Image
                    preview={false}
                    src="/img/pmo-logo.png"
                    width={170} />
                  {!isSuccess && <p className="text-muted">{t('component.create.account')}</p>}
                </div>
                <Row justify="center" className={`${loading ? 'form-opacity' : 'background-opacity'}`}>
                  <Col lg={22} md={20} sm={24} xs={24}>
                    <RegisterForm
                      {...props} />
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default RegisterOne;
