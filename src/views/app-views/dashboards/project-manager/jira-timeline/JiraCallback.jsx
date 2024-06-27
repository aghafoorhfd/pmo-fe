import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { jiraCallback, setAuthCode } from 'store/slices/jiraSlice';
import Loading from 'components/shared-components/Loading';
import { CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import ROUTES from 'constants/RouteConstants';
import { ROLES } from 'constants/RolesConstant';
import './index.css';

const JiraCallback = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    jira: {
      authCode = {}, loading, callbackStatus, projectId
    } = {},
    auth: { token, user }
  } = useSelector(({ jira, projectDetails, auth }) => ({ jira, projectDetails, auth }));

  const isGeneralUser = ROLES.GENERAL_USER === user;
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const hasSearchParams = searchParams.toString().length > 0;

  useEffect(() => {
    const handleQueryParams = () => {
      const queryParamState = searchParams.get('state')?.split('_')[0];
      const queryParamCode = searchParams.get('code');
      const queryErrorMsg = searchParams.get('error');
      dispatch(
        setAuthCode({
          code: queryParamCode,
          state: queryParamState,
          error: queryErrorMsg
        })
      );
    };

    const modifyUrlHostname = (subdomain) => {
      const currentUrl = window.location.href;
      const url = new URL(currentUrl);
      url.hostname = `${subdomain}.${url.hostname}`;
      return url.toString();
    };

    const redirectToModifiedUrl = (modifiedUrl) => {
      window.location.href = modifiedUrl;
    };

    const handleSubdomainRedirect = () => {
      const stateQueryParam = searchParams.get('state');
      const subdomain = stateQueryParam?.split('_')[1];
      const modifiedUrl = modifyUrlHostname(subdomain);
      redirectToModifiedUrl(modifiedUrl);
    };

    if (hasSearchParams) {
      if (token) {
        handleQueryParams();
      } else {
        setTimeout(() => {
          handleSubdomainRedirect();
        }, 3000);
      }
    }
  }, [token, hasSearchParams]);

  useEffect(() => {
    if (authCode?.code) {
      dispatch(jiraCallback({ authCode: authCode.code, state: authCode.state }));
    }
  }, [authCode.code]);

  useEffect(() => {
    if (token && (callbackStatus !== undefined || authCode?.error)) {
      setTimeout(() => {
        const projectIdParam = projectId ? `?projectId=${projectId}` : '';
        const navigateUrl = `${isGeneralUser ? ROUTES.GENERAL_USER_MY_PROJECTS.path : ROUTES.JIRA_TIMELINE.path}${projectIdParam}`;
        navigate(navigateUrl);
      }, 4000);
    }
  }, [callbackStatus, authCode, token]);

  if (loading || !token) return <Loading />;

  return (
    <div className="d-flex flex-column align-items-center mt-4">

      {callbackStatus
        ? <CheckCircleOutlined style={{ fontSize: '3rem', color: 'green' }} />
        : <WarningOutlined style={{ fontSize: '3rem', color: 'orange' }} />}

      <h5 className="text-center m-4 font-size-md">
        {callbackStatus
          ? t('component.jira.link.authorize.success')
          : t('component.jira.link.authorize.error')}
      </h5>

      <p className="jira-authorize-description">
        { t('component.jira.link.authorize.close.description')}
      </p>

    </div>
  );
};

export default JiraCallback;
