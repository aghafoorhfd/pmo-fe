import React from 'react';
import {
  Card, Row, Col, Image
} from 'antd';
import { Link } from 'react-router-dom';
import IntlMessage from 'components/util-components/IntlMessage';
import LoginForm from '../../components/LoginForm';

const backgroundStyle = {
  backgroundImage: 'url(/img/others/img-17.jpg)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover'
};

function Login(props) {
  return (
    <div className="h-100" style={backgroundStyle} data-i="main-container">
      <div className="container d-flex flex-column justify-content-center h-100">
        <Row justify="center">
          <Col lg={7} md={20} sm={20} xs={20}>
            <Card>
              <div className="my-4">
                <div className="text-center">
                  <Image
                    preview={false}
                    src="/img/pmo-logo.png"
                    width={170} />
                </div>
                <Row justify="center">
                  <Col lg={20} md={20} sm={24} xs={24}>
                    <LoginForm {...props} />
                    <Link to="/auth/forgot-password">
                      <IntlMessage id="component.auth.forgotPassword" />
                    </Link>
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

export default Login;
