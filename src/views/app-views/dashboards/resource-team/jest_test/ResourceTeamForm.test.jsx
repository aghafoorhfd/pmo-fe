import React from 'react';
import {
  fireEvent, render, screen, waitFor
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as resourceTeamActions from 'store/slices/resourceTeamSlice';
import TestProvider from 'test-utilts/TestProvider';
import { Form } from 'antd';
import ResourceTeamForm from '../ResourceTeamForm';

const ResourceTeamFormWrapper = (props) => {
  const [form] = Form.useForm();
  return <ResourceTeamForm form={form} {...props} />;
};

const localProps = {
  isModalOpen: true,
  setIsModalOpen: jest.fn(),
  selectedTeam: {},
  setSelectedTeam: jest.fn(),
  resourceManagerList: [
    { value: 'option1', label: 'option1' },
    { value: 'option2', label: 'option1' }
  ]
};

const props = {
  user: { userProfile: { companyId: '123' } },
  resourceTeam: { usersList: [] }

};

describe('Resource team form', () => {
  test('Check the form is present in the dom', () => {
    render(
      <TestProvider initialState={props}>
        <ResourceTeamFormWrapper {...localProps} />
      </TestProvider>
    );

    const form = screen.getByTestId('resource-team-form');
    expect(form).toBeInTheDocument();
  });
  test('Check the form fields with the fields teamName, teamDescripton, resourceManager, teamLead', () => {
    render(
      <TestProvider initialState={props}>
        <ResourceTeamFormWrapper {...localProps} />
      </TestProvider>
    );
    const teamName = screen.getByTestId('form-item-teamName');
    const teamDescripton = screen.getByTestId('form-item-teamDescription');
    const resourceManager = screen.getByTestId('form-item-resourceManager');
    const teamLead = screen.getByTestId('form-item-teamLead');

    expect(teamName).toBeInTheDocument();
    expect(teamDescripton).toBeInTheDocument();
    expect(resourceManager).toBeInTheDocument();
    expect(teamLead).toBeInTheDocument();
  });

  test('It Should render modal with heading Add User also with two buttons Cancel and Ok', async () => {
    const { getByText } = render(
      <TestProvider initialState={props}>
        <ResourceTeamFormWrapper {...localProps} />
      </TestProvider>
    );
    waitFor(() => {
      expect(getByText('component.resource.team.addResourceTeam')).toBeInTheDocument();
      expect(getByText('Add Team')).toBeInTheDocument();
      expect(getByText('Cancel')).toBeInTheDocument();
    });
  });

  test('change the values', async () => {
    jest.spyOn(resourceTeamActions, 'getUsersList').mockImplementationOnce(() => ([
      { value: 'option1', label: 'option1' },
      { value: 'option2', label: 'option1' }
    ]));

    const { getByText, container } = render(
      <TestProvider initialState={props}>
        <ResourceTeamFormWrapper {...localProps} />
      </TestProvider>
    );
    const form = screen.getByTestId('resource-team-form');
    expect(form).toBeInTheDocument();

    expect(getByText('component.resource.team.addResourceTeam')).toBeInTheDocument();

    fireEvent.change(screen.getByTestId('form-input-teamName'), {
      target: { value: 'Sohaib' }
    });

    fireEvent.change(screen.getByTestId('form-input-teamDescription'), {
      target: { value: 'Some description' }
    });

    const resourceManagerComboBox = await screen.findByTestId('form-option-resourceManager');
    userEvent.click(resourceManagerComboBox);

    const resourceManagerOptionOne = container.querySelector('.ant-select-item .ant-select-item-option .ant-select-item-option-active');
    userEvent.click(resourceManagerOptionOne);

    const teamLeadComboBox = await screen.findByTestId('form-option-teamLead');
    userEvent.click(teamLeadComboBox);

    const teamLeadOptionOne = container.querySelector('.ant-empty-description');
    userEvent.click(teamLeadOptionOne);

    fireEvent.click(getByText('component.resource.team.addTeam'));
  });
});
