import { Typography, notification } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  hideMessage,
  getProjectCadence
} from 'store/slices/projectDetailsSlice';
import { STATUS } from 'constants/StatusConstant';
import Agile from './agile';
import Sdlc from './sdlc';
import './index.css';

const { Title } = Typography;
const { SUCCESS } = STATUS;

const Cadence = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    message,
    showMessage,
    methodologyType: cadenceType,
    status
  } = useSelector(({ projectDetails }) => projectDetails);

  useEffect(() => {
    if (showMessage) {
      if (status === SUCCESS) {
        dispatch(getProjectCadence(cadenceType));
      }
      notification[status]({ message });
      dispatch(hideMessage());
    }
  }, [showMessage]);

  return (
    <>
      <Title data-i="cadence-title" className="cadence-title" level={2}>
        {t('component.cadence.screen.heading')}
      </Title>
      <Agile />
      <Sdlc />
    </>
  );
};

export default Cadence;
