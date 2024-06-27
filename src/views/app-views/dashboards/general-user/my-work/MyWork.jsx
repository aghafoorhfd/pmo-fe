import {
  Empty, notification
} from 'antd';
import React, { useEffect, useState } from 'react';
import 'gantt-task-react/dist/index.css';
import '../../project-manager/ProjectManagerDashboard.css';
import DataTable from 'components/shared-components/DataTable';
import ProjectService from 'services/ProjectService';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { methodologyType } from 'constants/ProjectMetricsConstant';
import { Card } from 'components/shared-components/Card';
import { CADENCE_TABS } from 'constants/MiscConstant';
import { Segments } from 'components/shared-components/Segment';
import { getDefaultSearchParam } from 'utils/utils';
import { getMyWorkColumns } from './my-work-columns';
import './index.css';

const MyWork = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [ranges, setRanges] = useState([]);
  const [myWorkDetails, setMyWorkDetails] = useState([]);
  const [cadenceBasedWorkData, setCadenceBasedWorkData] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    projectCadence: { agile, sdlc }
  } = useSelector(({ projectDetails }) => projectDetails);
  const cadenceType = searchParams.get('cadenceType') || getDefaultSearchParam(agile, sdlc);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const { data } = await ProjectService.getMyWorkAllocation();
      setMyWorkDetails(data);
    } catch (error) {
      notification.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (agile || sdlc) {
      const { currentHalfSprints } = agile || {};
      const { quarters } = sdlc || {};
      const methodologyRanges = {
        [methodologyType.AGILE_CAPS]: currentHalfSprints,
        [methodologyType.SDLC_CAPS]: quarters
      };

      if ((currentHalfSprints || quarters)) {
        setRanges(methodologyRanges[cadenceType]);
      }
    }
    fetchDetails();
  }, [cadenceType]);

  useEffect(() => {
    if (myWorkDetails?.length > 0) {
      const filteredData = myWorkDetails.filter(
        ({ projectCadence }) => projectCadence === cadenceType
      );
      setCadenceBasedWorkData(filteredData);
    }
  }, [cadenceType, myWorkDetails]);

  const handleCadenceToggle = (cadence) => {
    setSearchParams({ cadenceType: cadence });
  };

  return (
    <Card
      heading={t('component.user.dashboard.myWork.allocation')}
      showBorder
      actionBtn={(
        <Segments
          options={[CADENCE_TABS.AGILE, CADENCE_TABS.SDLC]}
          onChange={handleCadenceToggle}
          value={cadenceType}
          disabled={loading} />
    )}>
      {ranges?.length > 0 ? (
        <DataTable
          id="companyId"
          border={false}
          bordered
          className="mt-4 my-work-table"
          data={cadenceBasedWorkData}
          loading={loading}
          columns={getMyWorkColumns(ranges)}
          rowKey="projectId" />
      )
        : <Empty />}

    </Card>
  );
};

export default MyWork;
