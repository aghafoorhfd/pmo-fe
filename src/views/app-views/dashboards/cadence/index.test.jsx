import { render } from '@testing-library/react';
import TestProvider from 'test-utilts/TestProvider';
import { STATUS } from 'constants/StatusConstant';
import Cadence from '.';

const { SUCCESS, ERROR } = STATUS;

describe('ProjectCadence ', () => {
  it('should contain title of the Cadence Screen ', () => {
    const props = {
      projectDetails: {
        message: '',
        showMessage: true,
        methodologyType: 'AGILE',
        status: SUCCESS,
        projectCadence: { agile: {}, sdlc: {} },
        agileLoading: false,
        sdlcLoading: false
      }
    };
    const { getByTestId } = render(
      <TestProvider initialState={props}>
        <Cadence {...props} />
      </TestProvider>
    );
    const cadenceTitle = getByTestId('cadence-title');
    expect(cadenceTitle).toBeInTheDocument();
  });
  it('should contain title of the Cadence Screen ', () => {
    const props = {
      projectDetails: {
        message: '',
        showMessage: true,
        methodologyType: 'AGILE',
        status: ERROR,
        projectCadence: { agile: {}, sdlc: {} },
        agileLoading: false,
        sdlcLoading: false
      }
    };
    const { getByTestId } = render(
      <TestProvider initialState={props}>
        <Cadence {...props} />
      </TestProvider>
    );
    const cadenceTitle = getByTestId('cadence-title');
    expect(cadenceTitle).toBeInTheDocument();
  });
});
