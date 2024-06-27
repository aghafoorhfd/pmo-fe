import React, { useEffect, useState } from 'react';
import {
  Button, Col, Form, Row, Popover
} from 'antd';
import useFilter from 'utils/hooks/useFilter';
import { removeUndefinedProperties } from 'utils/utils';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import { useDispatch } from 'react-redux';
import { resetRefreshFlag } from 'store/slices/filterSlice';
import { useTranslation } from 'react-i18next';

import { FilterIcon } from 'assets/svg/icon';

import './filtersStyles.css';

const Filters = ({
  title, name, formItems, onSearch, onClear, placement
}) => {
  const [isFormTouched, setIsFormTouched] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [appliedFilters, setFilters, clearFilters] = useFilter(name);
  const [form] = Form.useForm();

  const setInitial = () => {
    const appliedFilter = appliedFilters?.applied;
    const filterKeys = appliedFilter && Object.keys(appliedFilter);
    if (filterKeys?.length) {
      form.setFieldsValue({
        ...appliedFilter
      });
    }
  };
  useEffect(() => {
    setInitial();
  }, [isPopoverOpen]);

  useEffect(() => {
    if (appliedFilters?.refresh) {
      onSearch(appliedFilters);
      dispatch(resetRefreshFlag({ name }));
      setIsPopoverOpen(false);
    }
  }, [appliedFilters?.refresh]);

  const getFormattedProperties = (values) => {
    const formattedObj = { };
    Object.keys(values).forEach((key) => {
      const itemWithFormatter = formItems.filter(
        (item) => item.name === key && item.formatter && typeof item.formatter === 'function'
      );

      if (itemWithFormatter.length) {
        formattedObj[key] = itemWithFormatter[0].formatter(values[key]);
      }
    });
    return formattedObj;
  };

  const handleSearch = () => {
    form
      .validateFields()
      .then((values) => {
        const valueAbleProperties = removeUndefinedProperties(values) || {};
        if (Object.keys(valueAbleProperties)?.length
        || Object.keys(appliedFilters?.applied || {})?.length) {
          const formattedProperties = getFormattedProperties(valueAbleProperties);
          setFilters(valueAbleProperties, formattedProperties);
        }
      }).catch((info) => {
        throw info;
      });
  };

  const handleClear = () => {
    if (appliedFilters?.applied && Object.keys(appliedFilters?.applied)?.length) {
      clearFilters();
      onClear();
    }
    form.resetFields();
    setIsFormTouched(false);
  };

  const handleOpenChange = (newOpen) => {
    setIsPopoverOpen(newOpen);
  };

  const hasFilterApplied = () => (appliedFilters?.applied
               && Object.keys(appliedFilters?.applied)?.length) || isFormTouched;
  return (
    <Popover
      onOpenChange={handleOpenChange}
      placement={placement}
      trigger="click"
      open={isPopoverOpen}
      content={(
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSearch}
          onFieldsChange={() => {
            setIsFormTouched(true);
          }}>
          <Row gutter={14} className="content-container">
            <Col className="filter-title" span={24}>{title}</Col>
            {formItems?.map((item) => (
              <Col span={item?.colSpan} key={item?.name}>
                <Form.Item
                  name={item?.name}
                  label={item?.label}>
                  {item?.render()}
                </Form.Item>
              </Col>
            ))}
          </Row>

          <Row gutter={[16, 4]} className="mb-2">
            <Col span={12}>
              <Button block onClick={handleClear} disabled={!hasFilterApplied()}>{t('component.common.clear.label')}</Button>
            </Col>
            <Col span={12}>
              <Button block type="primary" htmlType="submit">{t('component.common.apply.label')}</Button>
            </Col>
          </Row>
        </Form>
        )}>
      <Button type="default" icon={<FilterIcon />}>{t('component.project.manager.button.filters')}</Button>
    </Popover>
  );
};

Filters.propTypes = {
  name: PropTypes.string.isRequired,
  formItems: PropTypes.arrayOf(PropTypes.shape(
    {
      name: PropTypes.string.isRequired,
      label: PropTypes.string,
      colSpan: PropTypes.oneOfType(PropTypes.number, PropTypes.string),
      render: PropTypes.func
    }
  )).isRequired,
  onSearch: PropTypes.func,
  onClear: PropTypes.func,
  title: PropTypes.string,
  placement: PropTypes.string
};
Filters.defaultProps = {
  onSearch: noop,
  onClear: noop,
  title: '',
  placement: 'bottom'
};

export default Filters;
