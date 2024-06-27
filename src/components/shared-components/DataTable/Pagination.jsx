import { ArrowLeftOutlined, ArrowRightOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Pagination = ({
  pagination, onChange
}) => {
  const { t } = useTranslation();
  const { current, pageSize, total } = pagination;

  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 0) {
    return null; // Hide pagination
  }

  const handlePageChange = (page) => {
    if (page === current || page < 1 || page > totalPages) {
      return;
    }
    onChange({
      ...pagination,
      current: page
    });
  };

  const calculateFirstAndLastPage = () => {
    const visiblePages = 5; // Number of visible page buttons
    const halfVisible = Math.floor(visiblePages / 2);
    let firstPage;
    let lastPage;

    if (totalPages <= visiblePages) {
      firstPage = 1;
      lastPage = totalPages;
    } else if (current <= halfVisible) {
      firstPage = 1;
      lastPage = visiblePages;
    } else if (current >= totalPages - halfVisible) {
      firstPage = totalPages - visiblePages + 1;
      lastPage = totalPages;
    } else {
      firstPage = current - halfVisible;
      lastPage = current + halfVisible;
    }

    return [firstPage, lastPage];
  };

  const renderPageNumbers = () => {
    const [firstPage, lastPage] = calculateFirstAndLastPage();

    const pageNumbers = [];

    // Append page 1 and left ellipsis ...
    if (firstPage > 1) {
      pageNumbers.push(
        <Button
          key={1}
          className={`pagination-item ${current === 1 ? 'active' : ''}`}
          onClick={() => handlePageChange(1)}>
          1
        </Button>
      );

      if (firstPage > 2) {
        pageNumbers.push(
          <span key="ellipsis-left" className="pagination-ellipsis">
            <EllipsisOutlined />
          </span>
        );
      }
    }

    for (let i = firstPage; i <= lastPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          className={`pagination-item ${i === current ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}>
          {i}
        </Button>
      );
    }

    // Append right ellipsis ... and last page
    if (lastPage < totalPages) {
      if (lastPage < totalPages - 1) {
        pageNumbers.push(
          <span key="ellipsis-right" className="pagination-ellipsis">
            <EllipsisOutlined />
          </span>
        );
      }

      pageNumbers.push(
        <Button
          key={totalPages}
          className={`pagination-item ${totalPages === current ? 'active' : ''}`}
          onClick={() => handlePageChange(totalPages)}>
          {totalPages}
        </Button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="pagination">
      <Button
        className="pagination-prev-item"
        onClick={() => handlePageChange(current - 1)}
        disabled={current === 1}
        icon={<ArrowLeftOutlined />}>
        {t('component.common.pagination.previous.label')}
      </Button>
      <div className="pagination-pages">
        {renderPageNumbers()}
      </div>
      <Button
        className="pagination-next-item"
        onClick={() => handlePageChange(current + 1)}
        disabled={current === totalPages}>
        {t('component.common.pagination.next.label')}
        <ArrowRightOutlined />
      </Button>
    </div>
  );
};

export default Pagination;
