import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NAV_TYPE_TOP } from 'constants/ThemeConstant';

export function PageHeaderAlt({
  children, background, className, overlap, navType
}) {
  const [widthOffset, setWidthOffset] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (navType === NAV_TYPE_TOP) {
      const windowSize = window.innerWidth;
      const pageHeaderSize = ref.current.offsetWidth;
      setWidthOffset((windowSize - pageHeaderSize) / 2);
    }
  }, [navType]);

  const getStyle = () => {
    const style = { backgroundImage: background ? `url(${background})` : 'none' };
    if (navType === NAV_TYPE_TOP) {
      style.marginRight = -widthOffset;
      style.marginLeft = -widthOffset;
      style.paddingLeft = 0;
      style.paddingRight = 0;
    }
    return style;
  };

  return (
    <div
      ref={ref}
      className={`page-header-alt ${className || ''} ${overlap && 'overlap'}`}
      style={getStyle()}>
      {navType === NAV_TYPE_TOP ? <div className="container">{children}</div> : { children }}
    </div>
  );
}

PageHeaderAlt.propTypes = {
  children: PropTypes.node.isRequired,
  background: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  overlap: PropTypes.bool.isRequired
};

const mapStateToProps = ({ theme }) => {
  const { navType } = theme;
  return { navType };
};

export default connect(mapStateToProps, {})(PageHeaderAlt);
