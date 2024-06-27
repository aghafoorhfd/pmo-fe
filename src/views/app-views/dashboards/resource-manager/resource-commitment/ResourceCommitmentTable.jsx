import './index.css';
import { Empty, Tooltip } from 'antd';
import moment from 'moment';
import Loading from 'components/shared-components/Loading';
import { DATE_FORMAT_MMM_DD_WITH_SPACE } from 'constants/DateConstant';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import ResourceDetail from './ResourceDetail';

const EmptyCell = (props = {}) => (
  <td {...props} />
);

const EmptyRow = () => (
  <tr>
    <td colSpan={1000} className="range-cell py-3 w-100" aria-label="empty-row" />
  </tr>
);
const getFormatedDate = (date) => moment(date).format(DATE_FORMAT_MMM_DD_WITH_SPACE);

const Ranges = ({ ranges }) => {
  const { t } = useTranslation();
  return (
    ranges.map((range, index) => {
      const startDate = getFormatedDate(range.startDate);
      const endDate = getFormatedDate(range.endDate);
      const { name } = range;
      const rangeName = name?.includes(t('component.cadence.quarter.title')) ? name.split(' ').slice(1).join(' ') : name || '';
      return (
        <td className="team-capacity-data-heading text-center range-cell py-2 px-2" key={`${rangeName}-${index + 1}`}>
          <div className="font-weight-bold">{rangeName}</div>
          <div className="font-weight-semibold font-size-sm">
            {`${startDate} - ${endDate}`}
          </div>
        </td>
      );
    })
  );
};

const ResourceCommitmentTable = ({
  team, teamAvailableHours, teamAvailableCapacity, loading, resourceAndProjectMapping,
  ranges, allResourceDetails
}) => {
  const { t } = useTranslation();
  const checkIfRangeExists = () => !!ranges?.length;
  const checkIfTeamExists = () => !!Object.keys(team).length;

  const getTooltipElement = (title) => (
    <Tooltip placement="top" className="d-inline-block w-100 ellipses" title={title}>
      {title}
    </Tooltip>
  );
  return (
    <div className="resource-commitment-container mt-2">
      {loading && (
        <div className="resource-commitment-loading d-flex justify-content-center align-items-center">
          <Loading />
        </div>
      )}
      {!loading && (
        <table className="resource-commitment-data-table" data-i="resource-commitment-data-table">
          <thead>
            {checkIfRangeExists() && (
              <tr className="font-weight-bold">
                {checkIfTeamExists()
                  && (
                    <>
                      <EmptyCell className="range-cell px-2" />
                      <EmptyCell className="range-cell px-2" />
                    </>
                  )}
                <Ranges ranges={ranges} />
              </tr>
            )}
          </thead>
          <tbody>
            {checkIfRangeExists() && checkIfTeamExists() ? (
              <>
                <tr>
                  <td className="py-3 px-2 team-capacity-data-heading font-weight-semibold ellipses">
                    {getTooltipElement(team.teamName)}
                  </td>
                  <td className="py-3 px-2 sticky-column-background team-capacity-data-heading font-weight-semibold">{t('component.resource.manager.resource.commitment.teamAvailableHours')}</td>
                  {
                    teamAvailableHours.map((record, index) => (
                      <td
                        className="text-center py-3 px-2 team-available-cell"
                        key={`${record}-${index + 1}`}>
                        {record}
                      </td>
                    ))
                  }
                </tr>
                <tr>
                  <EmptyCell className="px-2" />
                  <td className="py-3 px-2 sticky-column-background team-capacity-data-heading font-weight-semibold">
                    {t('component.resource.manager.resource.commitment.availableCapacity')}
                  </td>

                  {
                    teamAvailableCapacity.map((record, index) => (
                      <td
                        className="text-center py-3 px-2 team-available-cell"
                        key={`${record}-${index + 1}`}>
                        {record ? `${record}%` : record}
                      </td>
                    ))
                  }
                </tr>
                {

                  allResourceDetails.map((resource, index) => {
                    const [[recordKey]] = resource;
                    return (
                      <Fragment key={`${recordKey}-${index + 1}`}>
                        <ResourceDetail
                          resourceAndProjectMapping={resourceAndProjectMapping}
                          resourceDetail={resource}
                          ranges={ranges} />

                        {index !== allResourceDetails.length - 1 && <EmptyRow />}
                      </Fragment>

                    );
                  })
                }
              </>
            ) : <Empty />}
          </tbody>
        </table>
      )}
    </div>
  );
};

ResourceCommitmentTable.propTypes = {
  team: PropTypes.shape({}).isRequired,
  teamAvailableHours: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.array
  ]).isRequired,
  teamAvailableCapacity: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.array
  ]).isRequired,
  loading: PropTypes.bool.isRequired,
  ranges: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.objectOf()),
    PropTypes.array
  ]).isRequired,
  resourceAndProjectMapping: PropTypes.shape({}).isRequired
};

export default ResourceCommitmentTable;
