import fetch from 'auth/FetchInterceptor';
import {
  PROJECT_SERVICE, ADD_PROJECT, INVITE_STAKEHOLDERS,
  PROJECT_RESOURCES, PROJECT_CONFLICTS, COMPANY_METHODOLOGY
} from 'constants/ApiConstant';
import { initialPaginationConfiguration, PROJECT_METRICS } from 'constants/MiscConstant';

const { page: initialPage, pageSize: initialPageSize } = initialPaginationConfiguration;

const ProjectService = {

  getProjectDetails(projectId) {
    return fetch({
      url: `${PROJECT_SERVICE}/projects/${projectId}`,
      method: 'get'
    });
  },

  addProject(data) {
    return fetch({
      url: ADD_PROJECT,
      method: 'post',
      data
    });
  },

  updateProject({ projectId, data }) {
    return fetch({
      url: `${PROJECT_SERVICE}/projects/${projectId}`,
      method: 'put',
      data
    });
  },

  inviteStakeHolders(data) {
    return fetch({
      url: INVITE_STAKEHOLDERS,
      method: 'post',
      data
    });
  },

  getProjectResources() {
    return fetch({
      url: PROJECT_RESOURCES,
      method: 'get'
    });
  },

  getProjectConflicts() {
    return fetch({
      url: PROJECT_CONFLICTS,
      method: 'get'
    });
  },

  getProjectList({
    page = initialPage, pageSize = initialPageSize, filterAnd = '', excludeProjectManagerIds = null, filterOr = ''
  }) {
    const filters = [filterOr ? `filterOr=${filterOr}` : '', filterAnd ? `filterAnd=${filterAnd}` : '', excludeProjectManagerIds ? `excludeProjectManagerIds=${excludeProjectManagerIds}` : ''].filter((query) => query);

    return fetch({
      url: `${PROJECT_SERVICE}/projects/${page}/${pageSize}?${filters.join('&')}`,
      method: 'get'
    });
  },

  getProjectTimeLine(projectId) {
    return fetch({
      url: `${PROJECT_SERVICE}/timelines/projects/${projectId}/metrics`,
      method: 'get'
    });
  },

  getProjectRanges(range) {
    return fetch({
      url: `${COMPANY_METHODOLOGY}/sprints?${range}`,
      method: 'get'
    });
  },

  getProjectQuarters(range) {
    return fetch({
      url: `${COMPANY_METHODOLOGY}/quarters?${range}`,
      method: 'get'
    });
  },

  getRisks(riskStatus, pageNumber, pageSize) {
    return fetch({
      url: `${PROJECT_SERVICE}/risks/${pageNumber}/${pageSize}`,
      method: 'get',
      params: { riskStatus }
    });
  },

  getAllRisks(selectedTab, pageNumber, pageSize, searchTerm) {
    let filterAndParam = '';
    if (searchTerm) {
      const searchTermUri = encodeURIComponent(`conflictName|${searchTerm}`);
      filterAndParam = `&filterAnd=${searchTermUri}`;
    }
    const filterOrParam = encodeURIComponent(`conflictStatus|${selectedTab}`);
    return fetch({
      url: `${PROJECT_SERVICE}/risks/search/${pageNumber}/${pageSize}?filterOr=${filterOrParam}${filterAndParam}`,
      method: 'get'
    });
  },

  getMyRisks(
    pageNumber,
    pageSize,
    selectedTab,
    filterOr = ''
  ) {
    const filterAndParam = encodeURIComponent(`conflictStatus|${selectedTab}`);
    return fetch({
      url: `${PROJECT_SERVICE}/risks/search/${pageNumber}/${pageSize}?filterAnd=${filterAndParam}&filterOr=${filterOr}`,
      method: 'get'
    });
  },

  getGraphStats(conflictStatus, allConflicts = false) {
    return fetch({
      url: `${PROJECT_SERVICE}/risks/stats?conflictStatType=${conflictStatus}&allConflicts=${allConflicts}`,
      method: 'get'
    });
  },

  addNewRisk(data) {
    return fetch({
      url: `${PROJECT_SERVICE}/risks`,
      method: 'post',
      data
    });
  },

  updateRiskDetails(data) {
    return fetch({
      url: `${PROJECT_SERVICE}/risks/${data?.conflictId}`,
      method: 'put',
      data
    });
  },

  getProjectNames() {
    return fetch({
      url: `${PROJECT_SERVICE}/projects/names`,
      method: 'get'
    });
  },

  getRiskDetails(conflictId) {
    return fetch({
      url: `${PROJECT_SERVICE}/risks/${conflictId}`,
      method: 'get'
    });
  },

  getRiskHistoryDetails(conflictId) {
    return fetch({
      url: `${PROJECT_SERVICE}/audit/risks/${conflictId}/history`,
      method: 'get'
    });
  },

  getProjectHistoryDetail({ projectId, page, pageSize }) {
    return fetch({
      url: `${PROJECT_SERVICE}/audit/projects/${projectId}/history/${page}/${pageSize}`,
      method: 'get'
    });
  },

  getOtherImpactedProjects() {
    return fetch({
      url: `${PROJECT_SERVICE}/projects`,
      method: 'get'
    });
  },

  addStages(projectId, body) {
    const data = { metricType: PROJECT_METRICS.STAGES, ...body };
    return fetch({
      url: `${PROJECT_SERVICE}/timelines/projects/${projectId}/metrics`,
      method: 'post',
      data
    });
  },

  getStageDetails(projectId, stageName) {
    return fetch({
      url: `${PROJECT_SERVICE}/timelines/projects/${projectId}/metrics/${stageName}`,
      method: 'get'
    });
  },

  updateStage(projectId, body) {
    const data = { ...body };

    return fetch({
      url: `${PROJECT_SERVICE}/timelines/projects/${projectId}/metrics`,
      method: 'put',
      data
    });
  },
  updateSubStage(projectId, body) {
    const data = { ...body };

    return fetch({
      url: `${PROJECT_SERVICE}/timelines/projects/${projectId}/sub-stages/dependency`,
      method: 'put',
      data
    });
  },

  addMilestones(projectId, body) {
    const data = { metricType: PROJECT_METRICS.MILESTONES, ...body };
    return fetch({
      url: `${PROJECT_SERVICE}/timelines/projects/${projectId}/metrics`,
      method: 'post',
      data
    });
  },

  updateMilestone(projectId, data) {
    return fetch({
      url: `${PROJECT_SERVICE}/timelines/projects/${projectId}/metrics`,
      method: 'put',
      data
    });
  },

  deleteMetric(projectId, metricType, metricName) {
    return fetch({
      url: `${PROJECT_SERVICE}/timelines/projects/${projectId}/metrics/${metricType}/${metricName}`,
      method: 'delete'
    });
  },

  addDependency(projectId, data) {
    return fetch({
      url: `${PROJECT_SERVICE}/timelines/projects/${projectId}/stages/dependency`,
      method: 'put',
      data
    });
  },

  getProjectAgileDetails() {
    return fetch({
      url: COMPANY_METHODOLOGY,
      method: 'get'
    });
  },

  saveProjectAgileDetails(data) {
    return fetch({
      url: COMPANY_METHODOLOGY,
      method: 'post',
      data
    });
  },

  updateProjectAgileDetails(data) {
    return fetch({
      url: COMPANY_METHODOLOGY,
      method: 'put',
      data
    });
  },

  getProjectConfigurations() {
    return fetch({
      url: `${PROJECT_SERVICE}/company/metrics`,
      method: 'get'
    });
  },

  updateProjectMetrics(data, method, metric = 'PROJECT_STAGES') {
    const metricParam = `/${metric}`;
    const metricQueryParam = `?metric=${metric}`;
    const url = `${PROJECT_SERVICE}/company/metrics${(method === 'put') ? metricParam : metricQueryParam}`;
    return fetch({
      url,
      method,
      data
    });
  },
  jiraLinkAccount(projectId) {
    return fetch({
      url: `${PROJECT_SERVICE}/jira/${projectId}/link-account`,
      method: 'get'
    });
  },

  jiraCallback(data) {
    return fetch({
      url: `${PROJECT_SERVICE}/jira/callback`,
      method: 'post',
      data
    });
  },
  getUserPendingWorkStatistics(projectId, projectKey) {
    return fetch({
      url: `${PROJECT_SERVICE}/projects/${projectId}/jira/users/pending-work-stats?projectKey=${projectKey}`,
      method: 'get'
    });
  },
  addJiraItem(projectId, data) {
    return fetch({
      url: `${PROJECT_SERVICE}/projects/${projectId}/jira-sync/work-item`,
      method: 'put',
      data
    });
  },
  getMyWorkAllocation() {
    return fetch({
      url: `${PROJECT_SERVICE}/projects/work-allocations`,
      method: 'get'
    });
  },
  syncJira(projectId, projectKey) {
    return fetch({
      url: `${PROJECT_SERVICE}/projects/${projectId}/jira-sync/statistics?projectKey=${projectKey}`,
      method: 'put'
    });
  },

  getJiraIssues(projectId, projectKey) {
    return fetch({
      url: `${PROJECT_SERVICE}/projects/${projectId}/jira/issues?projectKey=${projectKey}`,
      method: 'get'
    });
  },

  getProjectAssignedResources(projectId) {
    return fetch({
      url: `${PROJECT_SERVICE}/projects/${projectId}/stage-resources`,
      method: 'get'
    });
  },

  getStatsForSprintAndProjects() {
    return fetch({
      url: `${PROJECT_SERVICE}/projects/work-allocations`
    });
  },

  getProjectNo() {
    return fetch({
      url: `${PROJECT_SERVICE}/projects/project-number`,
      method: 'get'
    });
  },
  removeMetricDependency(projectId, data) {
    return fetch({
      url: `${PROJECT_SERVICE}/timelines/projects/${projectId}/metrics/dependency`,
      method: 'delete',
      data
    });
  }
};
export default ProjectService;
