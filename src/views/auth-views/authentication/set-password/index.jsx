import {
  Card, Col, notification, Row, Image
} from 'antd';
import { AUTH_PREFIX_PATH } from 'configs/AppConfig';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import UserService from 'services/UserService';
import { useTranslation } from 'react-i18next';
import { TOKEN_EXPIRE_ERROR_CODE } from 'constants/MiscConstant';
import { STATUS } from 'constants/StatusConstant';
import { hideAuthMessage } from 'store/slices/authSlice';
import SetPasswordForm from '../../components/SetPasswordForm';
import '../register/index.css';

const backgroundStyle = {
  backgroundImage: 'url(/img/others/img-17.jpg)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover'
};
export default function SetPassword({ newUser }) {
  const {
    auth: {
      loading, status
    }
  } = useSelector((state) => ({
    auth: state.auth
  }));
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [userId, setUserId] = useState(null);
  const { tenantId, token } = useParams();
  const navigate = useNavigate();
  const isSuccess = status === STATUS.SUCCESS;

  const handleVerificationSuccess = (data) => {
    setUserId(data?.iamId ? data?.iamId : data?.userId);
  };

  const handleVerificationError = (err) => {
    const { code } = err;
    let { message } = err;
    const isTokenExpired = TOKEN_EXPIRE_ERROR_CODE.includes(code);

    if (newUser) {
      navigate(`${AUTH_PREFIX_PATH}/register`);
      if (isTokenExpired) message = t('component.auth.setPassword.expired.error');
    } else {
      navigate(`${AUTH_PREFIX_PATH}/forgot-password`);
      if (isTokenExpired) message = t('component.auth.resetPassword.expired.error');
    }

    notification.error({ message });
  };

  const verifySetPasswordToken = async (authToken, verifyToken) => {
    try {
      const { data } = await UserService.verifySetPasswordToken(tenantId, authToken);
      if (verifyToken) handleVerificationSuccess(data);
    } catch (err) {
      handleVerificationError(err);
    }
  };

  useEffect(() => {
    let verifyToken = true;

    if (token && tenantId) {
      verifySetPasswordToken(token, verifyToken);
    }

    return () => {
      verifyToken = false;
    };
  }, [token]);

  return (
    userId && (
      <div className="h-100" style={backgroundStyle}>
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
                    { !isSuccess && (
                    <div className="text-muted">
                      {t('component.auth.setPassword')}
                    </div>
                    )}
                  </div>
                  <Row justify="center">
                    <Col lg={20} md={20} sm={24} xs={24}>
                      <SetPasswordForm userId={userId} newUser={newUser} tenantId={tenantId} />
                      { isSuccess && (
                      <Link to="/auth/login" onClick={() => dispatch(hideAuthMessage())}>
                        { t('component.button.signIn')}
                      </Link>
                      )}
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    )
  );
}
