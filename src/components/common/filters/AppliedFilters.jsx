import {
  Card, Col, Row, Tag
} from 'antd';
import React from 'react';
import useFilter from 'utils/hooks/useFilter';
import PropTypes from 'prop-types';

const spaceAround = (str) => (str ? ` ${str} ` : null);

const FilterBiscuit = ({
  appliedFilters, filterKey, color, options
}) => (
  <Tag color={color}>
    <span className="text-uppercase font-weight-bold mr-1">
      {options?.name || filterKey}
      :
    </span>
    {Array.isArray(appliedFilters[filterKey]) ? appliedFilters[filterKey].join(spaceAround(options?.separator) || ', ') : appliedFilters[filterKey]}

  </Tag>
);

const AppliedFilters = ({ name, tagColor, options }) => {
  const [appliedFilters] = useFilter(name);
  const formFilters = appliedFilters?.applied || {};
  const formattedFilters = appliedFilters?.formatted || {};

  const applied = { ...formFilters, ...formattedFilters };
  return (
    Object.keys(applied)?.length
      ? (
        <Card>
          <Row gutter={[4, 4]} justify="end">
            { Object.keys(applied).map((key) => (
              <Col key={`col-${key}`}>
                <FilterBiscuit
                  key={key}
                  appliedFilters={applied}
                  filterKey={key}
                  color={tagColor}
                  options={options[key]} />
              </Col>
            ))}
          </Row>
        </Card>
      )
      : null
  );
};
AppliedFilters.propTypes = {
  name: PropTypes.string.isRequired,
  tagColor: PropTypes.string,
  options: PropTypes.objectOf(PropTypes.shape(
    {
      name: PropTypes.string,
      separator: PropTypes.string
    }
  ))
};
AppliedFilters.defaultProps = {
  tagColor: 'green',
  options: {}
};

export default AppliedFilters;
