import { render } from '@testing-library/react';
import MetricsWidget from './MetriceWidget';

describe('Project Metrics Widget', () => {
  it('should render project metrics widget correctly', () => {
    const { container } = render(<MetricsWidget metricsName="Project States" />);
    expect(
      container
    ).toHaveTextContent('Project States');
  });
});
