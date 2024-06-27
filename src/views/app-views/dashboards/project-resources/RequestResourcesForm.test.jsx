import {
  render, screen
} from '@testing-library/react';
import { noop } from 'lodash';
import RequestResourcesForm from './RequestResourcesForm';

const props = {
  handleSubmit: noop,
  setIsFormTouched: noop
};

describe('Request resources Form', () => {
  it('Check the request resource form is present in the dom', () => {
    render(
      <RequestResourcesForm {...props} />
    );
    const userForm = screen.getByTestId('request-resources-form');
    expect(userForm).toBeInTheDocument();
  });

  test('Check the form fields with the fields project team, type, no of resources, capacity, date range and comment', () => {
    render(
      <RequestResourcesForm {...props} />
    );
    const team = screen.getByTestId('form-item-resource-team');
    const type = screen.getByTestId('form-item-resource-type');
    const noOfResource = screen.getByTestId('form-item-no-of-resource');
    const capacity = screen.getByTestId('form-item-capacity');
    const dateRange = screen.getByTestId('form-item-dateRange');
    const comment = screen.getByTestId('form-item-comment');

    expect(team).toBeInTheDocument();
    expect(type).toBeInTheDocument();
    expect(noOfResource).toBeInTheDocument();
    expect(capacity).toBeInTheDocument();
    expect(dateRange).toBeInTheDocument();
    expect(comment).toBeInTheDocument();
  });
});
