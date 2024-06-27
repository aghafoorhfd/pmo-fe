import { screen, render } from '@testing-library/react';
import UpgradePackageModal from './UpgradePackageModal';

test('It should display the modal on the screen', () => {
  render(<UpgradePackageModal onCloseModal={() => {}} showModal />);
  const dialog = screen.getByRole('dialog');
  expect(dialog).toBeInTheDocument();
});
