import { Typography } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DATE_FORMAT_MMM_DD_WITH_SPACE } from 'constants/DateConstant';

const { Text } = Typography;

const ResourceCapacityHeader = ({ header }) => (
  <div className="resource-capacity-timeline-header d-flex flex-column align-items-center justify-content-center">
    <Text strong>{header.name}</Text>
    { header?.start && header?.end && (
    <Text>
      {`${moment(header.start).format(DATE_FORMAT_MMM_DD_WITH_SPACE)} - ${moment(header.end).format(DATE_FORMAT_MMM_DD_WITH_SPACE)}`}
    </Text>
    )}
  </div>
);
export default ResourceCapacityHeader;

ResourceCapacityHeader.propTypes = {
  header: PropTypes.shape({
    name: PropTypes.string.isRequired,
    start: PropTypes.string,
    end: PropTypes.string
  }).isRequired
};
