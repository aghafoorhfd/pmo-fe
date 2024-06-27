import fetch from 'auth/FetchInterceptor';
import ProjectService from 'services/ProjectService';
import {
  PROJECT_SERVICE,
  ADD_PROJECT,
  INVITE_STAKEHOLDERS,
  COMPANY_METHODOLOGY
} from 'constants/ApiConstant';
import { ProjectDetails } from 'mock/data/projectDetailsData';
import { methodologyType } from 'constants/ProjectMetricsConstant';

jest.mock('auth/FetchInterceptor');
jest.mock('utils/utils');

describe('Auth Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const metric = 'PROJECT_STAGES';
  const agileData = { methodologyType: methodologyType.AGILE_SDLC };
  const metricsData = { metric: ['stages'] };

  it('should call get Project details handler ', () => {
    const projectId = 'ProjectID';
    ProjectService.getProjectDetails(projectId);

    expect(fetch).toBeCalledWith({
      method: 'get',
      url: `${PROJECT_SERVICE}/projects/${projectId}`
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });

  it('should call add Project details handler ', () => {
    ProjectService.addProject(ProjectDetails);

    expect(fetch).toBeCalledWith({
      method: 'post',
      url: ADD_PROJECT,
      data: ProjectDetails
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });
  it('should call update Project details handler ', () => {
    const projectId = '123';
    ProjectService.updateProject({
      projectId,
      data: ProjectDetails
    });

    expect(fetch).toBeCalledWith({
      method: 'put',
      url: `${PROJECT_SERVICE}/projects/${projectId}`,
      data: ProjectDetails
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });
  it('should call invite stake holders handler ', () => {
    const projectName = 'abc';
    ProjectService.inviteStakeHolders({
      projectName,
      stakeHolders: ProjectDetails.stakeHolders
    });

    expect(fetch).toBeCalledWith({
      method: 'post',
      url: INVITE_STAKEHOLDERS,
      data: {
        projectName,
        stakeHolders: ProjectDetails.stakeHolders
      }
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });

  it('should call get Project Timeline handler ', () => {
    const projectId = 'ProjectID';
    ProjectService.getProjectTimeLine(projectId);

    expect(fetch).toBeCalledWith({
      method: 'get',
      url: `${PROJECT_SERVICE}/timelines/projects/${projectId}/metrics`
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });

  it('should call get Project ranges handler ', () => {
    const projectId = 'ProjectID';
    ProjectService.getProjectRanges(projectId);

    expect(fetch).toBeCalledWith({
      method: 'get',
      url: `${PROJECT_SERVICE}/timelines/projects/${projectId}/sprint`
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });

  it('should call get Project Quarter Ranges', () => {
    const projectId = 'ProjectID';
    ProjectService.getProjectQuarters(projectId);

    expect(fetch).toBeCalledWith({
      method: 'get',
      url: `${PROJECT_SERVICE}/timelines/projects/${projectId}/`
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });

  it('should call getProjectAgileDetails with the get method', () => {
    ProjectService.getProjectAgileDetails();
    expect(fetch).toBeCalledWith({
      method: 'get',
      url: COMPANY_METHODOLOGY
    });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });
  it('should call saveProjectAgileDetails with the post method', () => {
    ProjectService.saveProjectAgileDetails(agileData);
    expect(fetch).toBeCalledWith({
      method: 'post',
      url: COMPANY_METHODOLOGY,
      data: agileData
    });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });
  it('should call updateProjectAgileDetails with the put method', () => {
    ProjectService.updateProjectAgileDetails(agileData);
    expect(fetch).toBeCalledWith({
      method: 'put',
      url: COMPANY_METHODOLOGY,
      data: agileData
    });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });
  it('should call getProjectConfigurations endpoint ', () => {
    ProjectService.getProjectConfigurations();
    expect(fetch).toBeCalledWith({
      method: 'get',
      url: `${PROJECT_SERVICE}/company/metrics`
    });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });

  it('should call updateProjectMetrics endpoint with put http method', () => {
    ProjectService.updateProjectMetrics(metricsData, 'put', metric);

    expect(fetch).toBeCalledWith({
      method: 'put',
      url: `${PROJECT_SERVICE}/company/metrics/${metric}`,
      data: metricsData
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });
  it('should call updateProjectMetrics endpoint with Post http method', () => {
    ProjectService.updateProjectMetrics(metricsData, 'post', metric);

    expect(fetch).toBeCalledWith({
      method: 'post',
      url: `${PROJECT_SERVICE}/company/metrics?metric=${metric}`,
      data: metricsData
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toMatchSnapshot();
  });
});
