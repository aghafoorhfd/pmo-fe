import {
  useEffect, useState
} from 'react';
import { useTranslation } from 'react-i18next';
import './index.css';
import { Segmented, notification } from 'antd';
import { Card } from 'components/shared-components/Card';
import BasicTabs from 'components/shared-components/Tabs';
import ProfileDetail from 'components/shared-components/ProfileDetail';
import {
  COMMITMENT_ACTIONS, DESIGNATION_TYPES, CADENCE_TABS
} from 'constants/MiscConstant';
import ResourceService from 'services/ResourceService';
import { useSelector } from 'react-redux';
import {
  checkProjectRange, getDefaultSearchParam, getName, fromPercentage
} from 'utils/utils';
import { useSearchParams } from 'react-router-dom';
import { methodologyType } from 'constants/ProjectMetricsConstant';
import ProjectCapacity from './data-widget/ProjectCapacity';
import ResourceCommitmentTable from './ResourceCommitmentTable';

const initialFullCommitmentData = {
  teamAvailableHours: [],
  teamAvailableCapacity: [],
  allResourceDetails: [],
  resourceAndProjectMapping: {}
};

const ResourceCommitment = () => {
  const { t } = useTranslation();
  const { COMMITTED, DESIGNATED, ASSIGNED } = COMMITMENT_ACTIONS;
  const [teamsList, setTeamsList] = useState([]);
  const [team, setTeam] = useState({});
  const [teamDescription, setTeamDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(ASSIGNED);
  const [ranges, setRanges] = useState([]);
  const [fullCommitmentData, setFullCommitmentData] = useState(initialFullCommitmentData);
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    teamAvailableHours, teamAvailableCapacity, allResourceDetails, resourceAndProjectMapping
  } = fullCommitmentData;
  const {
    projectCadence: { agile, sdlc }
  } = useSelector(({ projectDetails }) => projectDetails);

  const cadenceType = searchParams.get('cadenceType') || getDefaultSearchParam(agile, sdlc);

  const teamId = searchParams.get('team');

  const onTabChange = (key) => {
    setSelectedTab(key);
  };
  const getMainTabs = () => [
    {
      label: t('component.resource.manager.resource.commitment.assignedCapacity'),
      key: ASSIGNED
    },
    {
      label: t('component.resource.manager.resource.commitment.committedCapacity'),
      key: COMMITTED
    },
    {
      label: t('component.resource.manager.resource.commitment.designatedCapacity'),
      key: DESIGNATED
    }
  ];

  const fetchResourceTeamData = async (tId) => {
    try {
      const response = await ResourceService.getResourceTeamById(tId, cadenceType);
      const { data: resourceTeamData } = response;
      return resourceTeamData;
    } catch (err) {
      throw err.message || 'Something went wrong';
    }
  };
  const resetTeamData = () => {
    setFullCommitmentData({
      ...initialFullCommitmentData,
      teamAvailableHours: Array.from({ length: ranges?.length }, () => ''),
      teamAvailableCapacity: Array.from({ length: ranges?.length }, () => '')
    });
  };

  const getTeamById = async (tId) => {
    try {
      setLoading(true);
      const resourceTeamData = await fetchResourceTeamData(tId);
      const filteredResourcesData = resourceTeamData?.resources.filter((resource) => (
        resource.designation !== DESIGNATION_TYPES.RESOURCE_MANAGER.key
      ));
      setTeamDescription(resourceTeamData.description);
      setTeam({ teamName: resourceTeamData.teamName, resources: filteredResourcesData });
    } catch (err) {
      notification.error({ message: err });
    } finally {
      setLoading(false);
    }
  };

  const getAllTeams = async () => {
    try {
      const response = await ResourceService.getResourceTeamList(0, 100);
      const { data: { content: resourceTeamData } = {} } = response;
      const teamsOptions = resourceTeamData.map((tm) => ({
        label: tm?.teamName,
        value: tm?.id
      }));

      const defaultTeam = teamId || teamsOptions[0]?.value || '';
      const teamParam = defaultTeam ? { team: defaultTeam } : {};
      const cadenceParam = cadenceType ? { cadenceType } : {};

      setSearchParams({ ...cadenceParam, ...teamParam });
      setTeamsList(teamsOptions);
    } catch (err) {
      notification.error({ message: err });
    } finally {
      setLoading(false);
    }
  };

  const calculateTeamData = (allResourceAvailableHours, allResourceAvailableCapacity) => {
    const availableHours = allResourceAvailableHours.reduce((acc, resourceAvailableHours) => {
      resourceAvailableHours.forEach((value, index) => {
        acc[index] = (acc[index] || 0) + value;
      });
      return acc;
    }, []);
    const availableCapacity = allResourceAvailableCapacity
      .reduce((acc, resourceAvailableCapacity) => {
        resourceAvailableCapacity.forEach((value, index) => {
          acc[index] = (acc[index] || 0) + value;
        });
        return acc;
      }, []).map((value) => Math.floor(value / allResourceAvailableCapacity.length));
    return { availableHours, availableCapacity };
  };

  const ensureNonNegativeAvailableCapacity = (availableCapacityInRange) => (
    availableCapacityInRange
    < 0
      ? 0 : availableCapacityInRange);

  const calculateResourceProjectAllocation = (capacityDetailsData) => {
    const {
      capacityDetails, resourceAvailability: { resourceMap }, projectPayload, range, index
    } = capacityDetailsData;
    let { resourceAvailableCapacityInRange } = capacityDetailsData;
    const { startDate, endDate } = range;
    const resourceProjects = { ...projectPayload };
    capacityDetails.forEach(({
      assignedCapacity, fromDate: assignedStartDate, toDate: assignedEndDate, projectName,
      projectId
    }) => {
      resourceMap[projectId] = projectName;
      let resourceProjectAssignedCapacity = 0;
      const isProjectDateInRange = checkProjectRange(
        startDate,
        endDate,
        assignedStartDate,
        assignedEndDate
      );

      if (isProjectDateInRange) {
        resourceProjectAssignedCapacity = assignedCapacity;
        resourceAvailableCapacityInRange -= resourceProjectAssignedCapacity;
      }

      if (resourceProjects[projectId] && resourceProjects[projectId].length === index + 1) {
        resourceProjects[projectId][index] += resourceProjectAssignedCapacity;
      } else {
        resourceProjects[projectId] = resourceProjects[projectId]
          ? resourceProjects[projectId].concat(resourceProjectAssignedCapacity)
          : [resourceProjectAssignedCapacity];
      }
    });
    return { resourceProjects, resourceAvailableCapacityInRange };
  };

  const calculateResourceAvailability = (resource, resourceAvailability) => {
    const {
      allResourceAvailableHours, allResourceAvailableCapacity, totalEntries, resourceMap
    } = resourceAvailability;
    const {
      firstName, lastName, capacityDetails = [], resourceCapacity, email
    } = resource;

    let resourcePayload = {};
    let projectPayload = {};
    const totalResourceAvailableHours = [];
    const totalResourceAvailableCapacity = [];
    resourceMap[email] = getName(firstName, lastName);
    resourcePayload[email] = Array.from({ length: ranges.length + 1 }, () => '');

    ranges.forEach((range, index) => {
      const resourceAvailableCapacityInRange = 100;

      const capacityDetailsData = {
        capacityDetails,
        resourceAvailability,
        projectPayload,
        resourceAvailableCapacityInRange,
        range,
        index
      };
      const {
        resourceProjects, resourceAvailableCapacityInRange:
         availableCapacityInRange
      } = calculateResourceProjectAllocation(capacityDetailsData);
      projectPayload = { ...resourceProjects };
      const updatedResourceAvailableCapacityInRange = ensureNonNegativeAvailableCapacity(
        availableCapacityInRange
      );
      totalResourceAvailableCapacity.push(updatedResourceAvailableCapacityInRange);
      totalResourceAvailableHours.push(
        fromPercentage(updatedResourceAvailableCapacityInRange, resourceCapacity)
      );
    });
    resourcePayload.totalResourceAvailableCapacity = [...totalResourceAvailableCapacity];
    resourcePayload = { ...resourcePayload, ...projectPayload };
    resourcePayload.totalResourceAvailableHours = [...totalResourceAvailableHours];
    const entries = Object.entries(resourcePayload);
    allResourceAvailableHours.push(totalResourceAvailableHours);
    allResourceAvailableCapacity.push(resourcePayload.totalResourceAvailableCapacity);
    totalEntries.push(entries);
  };

  const getResourcesAvailability = (cadenceBasedResources) => {
    const resourceAvailability = {
      allResourceAvailableHours: [],
      allResourceAvailableCapacity: [],
      totalEntries: [],
      resourceMap: {}
    };

    cadenceBasedResources.forEach((resource) => calculateResourceAvailability(
      resource,
      resourceAvailability
    ));
    return resourceAvailability;
  };

  const getCadenceBasedResources = (resources) => {
    const cadenceBasedResources = resources?.filter((curr) => {
      const { capacityDetails = [] } = curr;
      const cadenceKeySet = new Set(capacityDetails.map(({ projectCadence }) => projectCadence));

      if (!cadenceKeySet.size) {
        return true;
      }

      const hasAgileAndSdlcCaps = cadenceKeySet.has(methodologyType.AGILE)
      && cadenceKeySet.has(methodologyType.SDLC_CAPS);

      const hasRequiredCadenceType = cadenceKeySet.has(cadenceType);

      return hasAgileAndSdlcCaps || hasRequiredCadenceType;
    }) ?? [];
    return cadenceBasedResources;
  };

  const resourceCommitmentMapper = () => {
    const { resources } = team;
    const cadenceBasedResources = getCadenceBasedResources(resources);
    if (team && cadenceBasedResources.length > 0 && ranges?.length > 0) {
      const commitmentData = { ...initialFullCommitmentData };
      const {
        allResourceAvailableHours, allResourceAvailableCapacity,
        totalEntries, resourceMap
      } = getResourcesAvailability(cadenceBasedResources);
      commitmentData.allResourceDetails = totalEntries;

      const { availableHours, availableCapacity } = calculateTeamData(
        allResourceAvailableHours,
        allResourceAvailableCapacity
      );
      commitmentData.teamAvailableHours = availableHours;
      commitmentData.teamAvailableCapacity = availableCapacity;
      commitmentData.resourceAndProjectMapping = resourceMap;

      setFullCommitmentData(commitmentData);
    } else {
      resetTeamData();
    }
  };

  useEffect(() => {
    getAllTeams();
  }, []);

  useEffect(() => {
    resourceCommitmentMapper();
  }, [team, ranges]);

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

      if (teamId) {
        getTeamById(teamId);
      }
    }
  }, [cadenceType, teamId]);

  const handleCadenceToggle = (cadence) => {
    setSearchParams({ cadenceType: cadence, team: teamId });
  };

  const handleTeamSelection = (tId) => {
    setSearchParams({ cadenceType, team: tId });
  };
  return (
    <>
      <ProfileDetail
        dataId="profileDescription"
        id="profileDescription"
        description={teamDescription}
        onTeamSelection={handleTeamSelection}
        isTeamSelectable
        selectedTeamId={teamId}
        teamList={teamsList}
        loading={loading} />
      <ProjectCapacity teamId={teamId} />
      <Card
        heading={t('component.resource.manager.resource.commitment.teamCapacity')}
        bordered={false}
        actionBtn={(
          <Segmented
            className="project-segments"
            size="large"
            options={[CADENCE_TABS.AGILE, CADENCE_TABS.SDLC]}
            onChange={handleCadenceToggle}
            value={cadenceType}
            id="team-capacity-segment"
            disabled={loading || !teamId} />
        )}
        tagText={`${team?.resources?.length || 0} ${t('component.resource.manager.resource.commitment.resources')}`}
        showBorder>
        <BasicTabs
          pillShaped
          items={getMainTabs()}
          onTabChange={onTabChange}
          selectedTab={selectedTab} />
        <ResourceCommitmentTable
          team={team}
          teamAvailableHours={teamAvailableHours}
          teamAvailableCapacity={teamAvailableCapacity}
          allResourceDetails={allResourceDetails}
          resourceAndProjectMapping={resourceAndProjectMapping}
          loading={loading}
          ranges={ranges} />
      </Card>
    </>
  );
};

export default ResourceCommitment;
