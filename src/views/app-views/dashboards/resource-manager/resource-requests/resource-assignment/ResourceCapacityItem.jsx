import {
  Col, Row, Button, Tooltip
} from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import { noop } from 'lodash';
import { DATE_FORMAT_DD_MM_YYYY, DATE_FORMAT_MMM_D_YEAR } from 'constants/DateConstant';
import { useTranslation } from 'react-i18next';

const ResourceCapacityItem = ({
  resource, isNameHeader, sprint, assignmentHandler, index
}) => {
  const { t } = useTranslation();
  const getFormatedDate = (date) => moment(date).format(DATE_FORMAT_DD_MM_YYYY);
  const compareDate = (date, start, end) => {
    const formatedDate = moment(getFormatedDate(date), DATE_FORMAT_DD_MM_YYYY);
    const formatedStart = moment(getFormatedDate(start), DATE_FORMAT_DD_MM_YYYY);
    const formatedEnd = moment(getFormatedDate(end), DATE_FORMAT_DD_MM_YYYY);
    return formatedDate.isBetween(formatedStart, formatedEnd, null, '[]');
  };
  const {
    capacityDetails = [], firstName, lastName, plannedVacations = []
  } = resource;
  let availableCapacity = 100;
  const [{ startDate = '', endDate = '' } = {}] = plannedVacations;

  if (!isNameHeader) {
    const { start, end } = sprint;
    capacityDetails?.forEach((capacity) => {
      const { fromDate: assignedStartDate, toDate: assignedEndDate, assignedCapacity } = capacity;
      const isStartInRange = compareDate(start, assignedStartDate, assignedEndDate);
      const isEndInRange = compareDate(end, assignedStartDate, assignedEndDate);
      if (isStartInRange || isEndInRange) {
        availableCapacity -= assignedCapacity;
      }
    });
  }
  const onAssignHandler = () => {
    assignmentHandler(resource);
  };

  const renderButton = () => {
    if (plannedVacations.length) {
      return (
        <Tooltip title={t('component.resource.request.tooltip', { startDate: moment(startDate).format(DATE_FORMAT_MMM_D_YEAR), endDate: moment(endDate).format(DATE_FORMAT_MMM_D_YEAR) })}>
          <Button
            onClick={onAssignHandler}
            type="link">
            {t('component.resource.request.column.action.assign')}
          </Button>
        </Tooltip>
      );
    }
    return (
      <Button
        onClick={onAssignHandler}
        type="link">
        {t('component.resource.request.column.action.assign')}
      </Button>
    );
  };

  return (
    <Row justify="centre" align="middle" className={`${!isNameHeader && availableCapacity > 0 ? 'capacity-cell ' : ''} flex-column grid-item border-bottom`}>

      { isNameHeader
        ? (
          <Col className="pl-1 pr-1">
            {
          index === 0 ? `${firstName} ${lastName || ''}`
            : (
              renderButton()
            )
}
          </Col>
        )
        : <Col className={availableCapacity > 0 ? 'capacity-cell ' : ''}>{`${availableCapacity}%`}</Col>}
    </Row>
  );
};

export default ResourceCapacityItem;

ResourceCapacityItem.propTypes = {
  resource: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string,
    teamCapacity: PropTypes.number,
    availableCapacity: PropTypes.number,
    assignedStartDate: PropTypes.string,
    assignedEndDate: PropTypes.string
  }).isRequired,
  assignmentHandler: PropTypes.func
};

ResourceCapacityItem.defaultProps = {
  assignmentHandler: noop
};
