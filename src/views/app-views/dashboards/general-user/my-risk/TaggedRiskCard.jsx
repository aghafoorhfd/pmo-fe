import React, { useEffect } from 'react';
import BasicTabs from 'components/shared-components/Tabs';
import { CONFLICT_ACTIONS } from 'constants/MiscConstant';
import DataTable from 'components/shared-components/DataTable';
import IntlMessage from 'components/util-components/IntlMessage';
import { Card } from 'components/shared-components/Card';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  getTaggedRiskList, resetPagination
} from 'store/slices/riskManagementSlice';
import { getConflictColumns } from './data-table-config/risk-columns';

const TaggedConflictCard = ({
  id,
  onTabChange,
  handleConflictDetails,
  selectedTab,
  content,
  totalElements,
  loading,
  pageNumber,
  pageSize
}) => {
  const impactedMemberIdEncoded = encodeURIComponent(`impactedMemberIds|${id}`);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { OPENED, RESOLVED, CANCELLED } = CONFLICT_ACTIONS;

  useEffect(() => {
    if (selectedTab) {
      dispatch(getTaggedRiskList({
        pageNumber, pageSize, selectedTab, filterOr: impactedMemberIdEncoded
      }));
    }
    return () => {
      dispatch(resetPagination());
    };
  }, [selectedTab]);

  const handleChange = (pagination) => {
    const { current, pageSize: size } = pagination;
    dispatch(getTaggedRiskList({
      pageNumber: current,
      pageSize: size,
      selectedTab,
      filterOr: impactedMemberIdEncoded
    }));
  };

  const getDataTable = () => (
    <DataTable
      id="projectId"
      data={content}
      handleChange={handleChange}
      showPagination
      loading={loading}
      currentPage={pageNumber}
      pageSize={pageSize}
      totalElements={totalElements}
      columns={getConflictColumns(handleConflictDetails, selectedTab)} />
  );

  const mainTabs = [
    {
      label: <IntlMessage id="component.general.user.tab.openRisks" />,
      key: OPENED,
      children: getDataTable()
    },
    {
      label: <IntlMessage id="component.general.user.tab.resolvedRisks" />,
      key: RESOLVED,
      children: getDataTable()
    },
    {
      label: <IntlMessage id="component.general.user.tab.cancelledRisks" />,
      key: CANCELLED,
      children: getDataTable()
    }
  ];

  return (
    <div data-i="conflict-manager-dashboard-screen">
      <Card
        heading={t('component.general.user.tagged.conflicts.title')}
        description={t('component.general.user.conflicts.details')}
        tagText={`${totalElements} ${t('component.general.user.conflicts.label')}`}
        showBorder>
        <BasicTabs
          pillShaped
          items={mainTabs}
          onTabChange={onTabChange}
          selectedTab={selectedTab} />
      </Card>
    </div>
  );
};
export default TaggedConflictCard;
