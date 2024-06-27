import { render } from '@testing-library/react';

import { ResolvedConflictDetails } from 'mock/data/conflictDetails';
import RisktHistory from '../conflict-details/RisktHistory';

describe('Conflict Manager Details Impact View', () => {
  it('should render Conflict detail info correctly', () => {
    const container = render(<RisktHistory data={ResolvedConflictDetails.conflictHistory} />);
    expect(container).toMatchSnapshot();
  });
});
