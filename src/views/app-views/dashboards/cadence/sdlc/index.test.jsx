import { fireEvent, render } from '@testing-library/react';
import TestProvider from 'test-utilts/TestProvider';
import Sdlc from '.';

const props = {
  projectDetails: {
    projectCadence: { sdlc: null },
    sdlcLoading: false
  }
};

describe('Sdlc ', () => {
  it('should render SDLC correctly', () => {
    const { getByTestId } = render(
      <TestProvider initialState={props}>
        <Sdlc {...props} />
      </TestProvider>
    );
    const SdlcCard = getByTestId('sdlc-card');
    expect(SdlcCard).toBeInTheDocument();
  });

  it('should contain SDLC form', async () => {
    const { getByTestId } = render(
      <TestProvider initialState={props}>
        <Sdlc {...props} />
      </TestProvider>
    );
    const sdlcForm = getByTestId('sdlc-cadence-form');
    expect(sdlcForm).toBeInTheDocument();

    const fiscalYearField = getByTestId('fiscalYearStartDateField');
    const fiscalYearNameField = getByTestId('yearNameField');

    expect(fiscalYearField).toBeInTheDocument();
    expect(fiscalYearNameField).toBeInTheDocument();

    fireEvent.click(fiscalYearField);
    fireEvent.change(fiscalYearField, { target: { value: '29 Oct, 2020' } });
    expect(fiscalYearField.value).toBe('29 Oct, 2020');

    const activateBtn = getByTestId('sdlc-activate-btn');
    expect(activateBtn).toBeInTheDocument();
  });
});
