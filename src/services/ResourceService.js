import fetch from 'auth/FetchInterceptor';
import { RESOURCE_TEAM, RESOURCE_REQUEST, RESOURCE_SERVICE } from 'constants/ApiConstant';

const ResourceService = {
  addResourceTeam(data) {
    return fetch({
      url: `${RESOURCE_TEAM}`,
      method: 'post',
      data
    });
  },
  addResourceInTeam(data, teamId) {
    return fetch({
      url: `${RESOURCE_TEAM}/${teamId}/resources`,
      method: 'post',
      data
    });
  },
  updateResourceInTeam(data, teamId) {
    return fetch({
      url: `${RESOURCE_TEAM}/${teamId}/resources`,
      method: 'put',
      data
    });
  },

  getResourceTeamList(pageNumber, pageSize) {
    return fetch({
      url: `${RESOURCE_TEAM}/${pageNumber}/${pageSize}`,
      method: 'get'
    });
  },

  getResourceTeamById(teamId, cadenceType = '') {
    const filters = cadenceType && `?projectCadence=${cadenceType}`;

    return fetch({
      url: `${RESOURCE_TEAM}/${teamId}${filters}`,
      method: 'get'
    });
  },

  editResourceTeam(data) {
    return fetch({
      url: `${RESOURCE_TEAM}/${data?.id}`,
      method: 'put',
      data
    });
  },

  addResource(data) {
    return fetch({
      url: `${RESOURCE_TEAM}/${data?.id}/resource`,
      method: 'put',
      data
    });
  },

  removeResource(teamId, resourceId) {
    return fetch({
      url: `${RESOURCE_TEAM}/${teamId}/resources/${resourceId}`,
      method: 'delete'
    });
  },

  getResourceTeamNames() {
    return fetch({
      url: `${RESOURCE_TEAM}/names`,
      method: 'get'
    });
  },

  addResourceRequest(data) {
    return fetch({
      url: `${RESOURCE_REQUEST}/requests`,
      method: 'post',
      data
    });
  },

  getResourceRequestList(page, pageSize, selectedStatus, projectId, resourceManager) {
    const filters = [];

    if (selectedStatus) {
      filters.push(`status|${selectedStatus}`);
    }

    if (projectId) {
      filters.push(`projectDetail.projectId|${projectId}`);
    }

    if (resourceManager) {
      filters.push(`resourceManagers.id|${resourceManager}`);
    }

    const filterStr = filters.join('&');
    const filterAndParam = filterStr && `?filterAnd=${encodeURIComponent(filterStr)}`;
    return fetch({
      url: `${RESOURCE_REQUEST}/requests/${page}/${pageSize}${filterAndParam}`,
      method: 'get'
    });
  },

  withdrawResourceRequest(resourceRequestId) {
    return fetch({
      url: `${RESOURCE_REQUEST}/requests/withdraw?resourceRequestIds=${resourceRequestId}`,
      method: 'put'
    });
  },

  getResourceStats(projectId) {
    return fetch({
      url: `${RESOURCE_REQUEST}/stats?projectId=${projectId}`,
      method: 'get'
    });
  },
  getResourceCapacity(resourceTeamId, fromDate, toDate) {
    return fetch({
      url: `${RESOURCE_SERVICE}/resource-manager/resource-team/${resourceTeamId}/capacity-detail?fromDate=${fromDate}&toDate=${toDate}`,
      method: 'get'
    });
  },
  assignResourceCapacity(requestId, data) {
    return fetch({
      url: `${RESOURCE_SERVICE}/resource-manager/resource-requests/${requestId}`,
      method: 'put',
      data
    });
  },
  rejectResourceCapacity(requestId, data) {
    return fetch({
      url: `${RESOURCE_SERVICE}/resource-manager/requests/reject?resourceRequestId=${requestId}`,
      method: 'put',
      data
    });
  },

  getAvailableResources() {
    return fetch({
      url: `${RESOURCE_SERVICE}/resource-manager/available-resources`,
      method: 'get'
    });
  },

  projectAvailableCapacity(teamId) {
    return fetch({
      url: `${RESOURCE_TEAM}/available-capacity-stats?teamId=${teamId}`,
      method: 'get'
    });
  },

  projectRequestCapacity(teamId) {
    return fetch({
      url: `${RESOURCE_SERVICE}/resource-manager/capacity-request-stats?teamId=${teamId}`,
      method: 'get'
    });
  },

  sendTeamBulletin(data) {
    return fetch({
      url: `${RESOURCE_SERVICE}/bulletins`,
      method: 'post',
      data
    });
  },
  patchTeamBulletinData(teamBulletinId, seen) {
    return fetch({
      url: `${RESOURCE_SERVICE}/bulletins?seen=${seen}&teamBulletinId=${teamBulletinId}`,
      method: 'PATCH'
    });
  },
  getTeamBulletinData(pageNumber, pageSize, teamId) {
    return fetch({
      url: `${RESOURCE_SERVICE}/bulletins/${pageNumber}/${pageSize}?teamId=${teamId}`,
      method: 'get'
    });
  },
  deleteTeamBulletinMessage(messageId) {
    return fetch({
      url: `${RESOURCE_SERVICE}/bulletins/${messageId}`,
      method: 'delete'
    });
  },

  getResourceDetails(resourceId) {
    return fetch({
      url: `${RESOURCE_SERVICE}/resources/${resourceId}`,
      method: 'get'
    });
  }
};

export default ResourceService;
