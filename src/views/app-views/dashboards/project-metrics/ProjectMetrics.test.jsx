import {
  render
} from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import TestProvider from 'test-utilts/TestProvider';

import UserService from 'services/UserService';
import ProjectService from 'services/ProjectService';
import ProjectMetrics from './ProjectMetrics';

jest.mock('services/UserService');
jest.mock('services/ProjectService');

const props = {
  auth: {
    userProfile: {
      company: 'bc4ba09f-7fde-43c1-979f-8616e1ae0a84'
    }
  }
};

describe('Project Metrics', () => {
  beforeEach(() => {
    UserService.getGlobalConfigurations.mockResolvedValue({
      data: {
        metrics: {
          projectStatus: [
            'Hold'
          ],
          projectStates: [
            'Concept'
          ],
          projectStages: [
            'Go Live'
          ],
          projectCategory: [
            'Growth Priority'
          ],
          projectPriorityLevel: [
            'Low'
          ],
          sponsoringDepartment: [
            'Regulatory'
          ],
          milestones: [
            'Go Live'
          ],
          resourceType: [
            'Growth Priority'
          ],
          roles: [
            'Admin'
          ]
        }
      }
    });
    ProjectService.getProjectConfigurations.mockResolvedValue({
      data: {
        metrics: {
          projectStages: [
            'Testing'
          ],
          sponsoringDepartment: [
            'Sales'
          ],
          milestones: [
            'Architecture Approved'
          ],
          categoryName: [
            'Tech Priority'
          ],
          projectPriorityLevel: [
            'Urgent'
          ],
          resourceType: [
            'Sales'
          ]
        }
      }
    });
    ProjectService.updateProjectMetrics.mockResolvedValue({});
  });

  it('should render project metrics screen correctly', async () => {
    await act(() => {
      render(
        <TestProvider initialState={props}>
          <ProjectMetrics {...props} />
        </TestProvider>
      );
    });
  });
});
