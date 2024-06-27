import React from 'react';
import { SIDE_NAV_WIDTH, SIDE_NAV_COLLAPSED_WIDTH, NAV_TYPE_TOP } from 'constants/ThemeConstant';
import { useSelector } from 'react-redux';
import utils from 'utils';
import { Grid } from 'antd';
import { PMOCollapsedIcon, PMOTrackerIcon } from 'assets/svg/icon';
import { Link } from 'react-router-dom';

const { useBreakpoint } = Grid;

export function Logo({ mobileLogo, logoType }) {
  const isMobile = !utils.getBreakPoint(useBreakpoint()).includes('lg');

  const navCollapsed = useSelector((state) => state.theme.navCollapsed);
  const navType = useSelector((state) => state.theme.navType);

  const getLogoWidthGutter = () => {
    const isNavTop = navType === NAV_TYPE_TOP;
    if (isMobile && !mobileLogo) {
      return '0';
    }
    if (isNavTop) {
      return 'auto';
    }
    if (navCollapsed) {
      return `${SIDE_NAV_COLLAPSED_WIDTH}px`;
    }
    return `${SIDE_NAV_WIDTH}px`;
  };

  const getLogo = () => {
    if (logoType === 'light') {
      return navCollapsed ? <PMOCollapsedIcon /> : <PMOTrackerIcon />;
    }
    return navCollapsed ? <PMOCollapsedIcon /> : <PMOTrackerIcon />;
  };

  const getLogoDisplay = () => {
    if (isMobile && !mobileLogo) {
      return 'd-none';
    }
    return 'logo';
  };

  return (
    <div className={getLogoDisplay()} style={{ width: `${getLogoWidthGutter()}`, lineHeight: '1px' }}>
      <Link to="https://pmotracker.com/">
        {getLogo()}
      </Link>
    </div>
  );
}

export default Logo;
