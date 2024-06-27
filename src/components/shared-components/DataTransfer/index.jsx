import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
  Badge, Row, Tooltip, Transfer
} from 'antd';
import { noop } from 'lodash';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import './index.css';
import { textAbstract } from 'utils/utils';

const DataTransfer = ({
  data,
  keys,
  handleChange,
  titles,
  handleDelete,
  handleEdit,
  isStages
}) => {
  const [state, setState] = useState({
    targetKeys: [],
    selectedKeys: []
  });

  useEffect(() => {
    setState({ ...state, targetKeys: keys });
  }, [data, keys]);

  const handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setState({
      ...state,
      selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys]
    });
  };

  const filterFromSelected = ({ key }) => {
    const filteredKeys = state.selectedKeys?.filter((item) => item !== key);
    setState({ ...state, selectedKeys: [...filteredKeys] });
  };
  const onDelete = (e, item) => {
    e.stopPropagation();
    filterFromSelected(item);
    handleDelete(item);
  };
  const onEdit = (event, selectedItem) => {
    event.stopPropagation();
    handleEdit(selectedItem);
  };

  const showSubStages = (subStages) => (subStages.length
    ? subStages.map(({ name }) => <div key={name}>{name}</div>)
    : '');

  const renderTitle = (title, resourceCapacity) => {
    const tooltipContent = resourceCapacity ? `${title} (${resourceCapacity} hours)` : title;
    const truncatedContent = textAbstract(tooltipContent, 14);
    return (
      <Tooltip title={tooltipContent} placement="bottom">
        <span>{truncatedContent}</span>
      </Tooltip>
    );
  };

  return (
    <Transfer
      showSelectAll
      dataSource={data}
      titles={titles}
      targetKeys={state.targetKeys}
      selectedKeys={state.selectedKeys}
      onChange={handleChange}
      rowKey={(record) => record.key}
      onSelectChange={handleSelectChange}
      render={(item) => {
        const {
          title, disabled, subStages = [], key, resourceCapacity,
          seedResourceDiscipline
        } = item;
        return (
          <Row justify="space-between" align="middle">
            {isStages ? (
              <div>
                {renderTitle(title)}
                <Tooltip key={title} title={showSubStages(subStages)}>
                  <Badge
                    overflowCount={10}
                    title=""
                    size="small"
                    count={subStages.length}
                    offset={[0, 0]}
                    className="ml-1 data-transfer-badge" />
                </Tooltip>
              </div>
            ) : (
              renderTitle(title, resourceCapacity)
            )}
            {(!disabled || seedResourceDiscipline) && (
              <span>
                <EditOutlined
                  style={{ color: '#667085' }}
                  className="mr-2"
                  id={`stage-item-edit-button-${key}`}
                  onClick={(e) => onEdit(e, item)} />
                {!disabled && (
                  <DeleteOutlined id={`stage-item-delete-button-${key}`} onClick={(e) => onDelete(e, item)} />
                )}
              </span>
            )}
          </Row>
        );
      }} />
  );
};

DataTransfer.propTypes = {
  titles: PropTypes.arrayOf(PropTypes.string),
  handleChange: PropTypes.func,
  handleDelete: PropTypes.func,
  handleEdit: PropTypes.func,
  isStages: PropTypes.bool
};

DataTransfer.defaultProps = {
  titles: [],
  handleDelete: noop,
  handleEdit: noop,
  handleChange: noop,
  isStages: false
};

export default DataTransfer;
