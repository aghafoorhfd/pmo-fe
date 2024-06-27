import { Layout } from 'antd';
import Logo from 'components/layout-components/Logo';
import NavHelp from 'components/layout-components/NavHelp';

const { Header } = Layout;

const AppHeader = () => (
  <Header style={{ backgroundColor: '#fff', padding: '0 20px' }}>
    <div className="d-flex justify-content-between align-items-center ">
      <Logo mobileLogo />
      <div className="d-flex align-items-center justify-content-between">
        <NavHelp />
      </div>

    </div>
  </Header>
);
export default AppHeader;
