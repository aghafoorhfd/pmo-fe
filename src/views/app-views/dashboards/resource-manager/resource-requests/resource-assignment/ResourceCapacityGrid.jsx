import PropTypes from 'prop-types';
import { noop } from 'lodash';
import {
  Empty
} from 'antd';
import ResourceCapacityHeader from './ResourceCapacityHeader';
import ResourceCapacityItem from './ResourceCapacityItem';

const ResourceCapacityGrid = ({ headers, resources, assignmentHandler }) => (
  <>
    <div className="resource-capacity-grid d-flex flex-grow-1">
      {headers?.map((header, index) => (
        <div className="grid-item flex-grow-1 border-left" key={header?.name}>
          <ResourceCapacityHeader header={header} key={header?.name} />
          {resources.map((resource) => (
            <ResourceCapacityItem
              index={index}
              key={`${header?.name} ${resource?.email}`}
              sprint={header}
              isNameHeader={index === 0 || index === headers.length - 1}
              resource={resource}
              assignmentHandler={assignmentHandler} />
          ))}
        </div>
      ))}
    </div>
    {!resources?.length && (
      <div className="flex-fill p-4 w-100">
        <Empty />
      </div>
    )}

  </>
);

export default ResourceCapacityGrid;

ResourceCapacityGrid.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    start: PropTypes.string,
    end: PropTypes.string
  })).isRequired,
  resources: PropTypes.arrayOf(PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    teamCapacity: PropTypes.number,
    availableCapacity: PropTypes.number,
    assignedStartDate: PropTypes.string,
    assignedEndDate: PropTypes.string
  })).isRequired,
  assignmentHandler: PropTypes.func
};
ResourceCapacityGrid.defaultProps = {
  assignmentHandler: noop
};
