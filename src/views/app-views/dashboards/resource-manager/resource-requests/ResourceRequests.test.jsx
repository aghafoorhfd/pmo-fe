import {
  render, screen
} from '@testing-library/react';
import { availableResources } from 'mock/data/resourceRequests';
import ResourceRequests from './ResourceRequests';
import ResourceAssignmentModal from './resource-assignment/ResourceAssignmentModal';
import ResourceCapacityGrid from './resource-assignment/ResourceCapacityGrid';

jest.mock('services/UserService');

describe('Resource Request dashboard', () => {
  it('should render resource requests table with assign action button', () => {
    render(<ResourceRequests />);
    expect(screen.getByTestId('resource-request-data-table')).toBeInTheDocument();
    const assign = screen.getAllByTestId('assign-btn');
    assign.forEach((element) => {
      expect(element).toBeInTheDocument();
    });
  });

  it('should display add resource team modal with heading and cancel button', () => {
    const { getByText } = render(
      <ResourceAssignmentModal isVisible />
    );
    expect(getByText('component.resource.request.modal.heading')).toBeInTheDocument();
    expect(getByText('Cancel')).toBeInTheDocument();
  });

  it('should display project name and resource type in resource team modal', () => {
    const { getByText } = render(
      <ResourceAssignmentModal isVisible />
    );
    expect(getByText('component.project.manager.project.details.label.projectName')).toBeInTheDocument();
    expect(getByText('component.project.manager.resources.form.label.resourceType')).toBeInTheDocument();
  });

  it('should display availability capacity by resource', () => {
    render(
      <ResourceAssignmentModal isVisible />
    );
    expect(screen.getByTestId('resource-capacity-availability')).toBeInTheDocument();
  });

  it('should display resource capacity grid', () => {
    const timeline = [
      {
        name: 'Sprint 1',
        start: '1/1/2023',
        end: '1/2/2023'
      }];
    const { getByText } = render(
      <ResourceCapacityGrid
        timeline={timeline}
        resources={availableResources} />
    );
    expect(getByText(timeline[0].name)).toBeInTheDocument();
    expect(getByText(`${timeline[0].start} - ${timeline[0].end}`)).toBeInTheDocument();
    availableResources.forEach((element) => {
      expect(getByText(element.name)).toBeInTheDocument();
    });
  });
});
