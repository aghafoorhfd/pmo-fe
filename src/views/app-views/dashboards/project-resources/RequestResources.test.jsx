import {
  render, screen, waitFor
} from '@testing-library/react';
import { noop } from 'lodash';
import RequestResources from './RequestResources';

const props = {
  isOpen: true,
  onClose: noop,
  list: [],
  handleSendRequest: noop
};
describe('Request resources screen', () => {
  it('should render modal with heading Request Resources also with Cancel button', async () => {
    const { getByText } = render(
      <RequestResources {...props} />
    );
    waitFor(() => {
      expect(getByText('component.project.manager.resources.modal.title')).toBeInTheDocument();
      expect(getByText('Cancel')).toBeInTheDocument();
    });
  });
  it('should render resource request table', () => {
    render(
      <RequestResources {...props} />
    );
    const userForm = screen.getByTestId('request-resources-table');
    expect(userForm).toBeInTheDocument();
  });
  it('should render resource request form', () => {
    render(
      <RequestResources {...props} />
    );
    const userForm = screen.getByTestId('request-resources-form');
    expect(userForm).toBeInTheDocument();
  });
});
