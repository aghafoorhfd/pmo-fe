import { render, screen } from '@testing-library/react';
import TestProvider from 'test-utilts/TestProvider';
import { act } from 'react-dom/test-utils';

import RisktInfo from '../conflict-details/RisktInfo';

const conflictInfoProps = {
  riskManagement: {
    optionsLoading: false,
    projectOptions: { data: [] },
    conflictsDetails: {}
  }
};

const props = {
  conflictDetailId: '',
  setCheckForm: jest.fn(),
  handleSubmit: jest.fn(),
  isDetailsPageOpened: false,
  selectedTab: 'OPENED'
};

describe('Conflict Manager Details info View', () => {
  it('Should render Conflict detail info form', () => {
    render(
      <TestProvider initialState={conflictInfoProps}>
        <RisktInfo {...props} />
      </TestProvider>
    );
    const conflictInfoForm = screen.getByTestId('conflict-info-form');
    expect(conflictInfoForm).toBeInTheDocument();
  });

  it('Should render Conflict detail info form with four input fields', () => {
    const { container } = render(
      <TestProvider initialState={conflictInfoProps}>
        <RisktInfo {...props} />
      </TestProvider>
    );
    const cells = container.querySelectorAll('.ant-col .ant-form-item-label');
    act(() => {});
    const inputFieldsName = [
      'table.component.column.project',
      'component.conflict.manager.details.riskName',
      'component.conflict.manager.details.descriptionImpact',
      'component.conflict.manager.details.suggestedResolution'
    ];
    inputFieldsName.forEach((fieldsName, index) => {
      expect(fieldsName).toBe(cells[index].textContent);
    });
  });
});
