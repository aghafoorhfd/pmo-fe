import { Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import './index.css';
import PropTypes from 'prop-types';

const EmptyCell = (props = {}) => (
  <td {...props} />
);

const ResourceDetail = ({
  resourceDetail, resourceAndProjectMapping
}) => {
  const { t } = useTranslation();
  const titles = {
    totalResourceAvailableCapacity: t('component.resource.manager.resource.commitment.availableCapacity'),
    totalResourceAvailableHours: t('component.resource.manager.resource.commitment.availableHours')
  };

  const getTooltipElement = (title) => (
    titles[title] || (
      <Tooltip className="d-inline-block w-100 ellipses" placement="top" title={resourceAndProjectMapping[title] || title}>
        {resourceAndProjectMapping[title] || title}
      </Tooltip>
    )
  );
  return (
    resourceDetail.map(([key, value], index) => (
      <tr key={key}>

        {index !== 0 && <EmptyCell className="px-2" />}

        <td className="py-3 px-2">
          {' '}
          {getTooltipElement(key)}
        </td>
        {
          value.map((record, recordIndex) => (
            <td
              className="text-center py-3 px-2"
              key={`${record}-${recordIndex + 1}`}>
              {titles[key] !== titles.totalResourceAvailableHours && record !== '' ? `${record}%` : record}
            </td>
          ))
        }
      </tr>

    ))
  );
};

ResourceDetail.propTypes = {
  resourceDetail: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.arrayOf),
    PropTypes.array
  ]).isRequired,
  ranges: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.objectOf()),
    PropTypes.array
  ]).isRequired,
  resourceAndProjectMapping: PropTypes.shape({}).isRequired
};

export default ResourceDetail;
