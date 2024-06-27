import {
  Tag,
  Divider
} from 'antd';
import PropTypes from 'prop-types';
import './CardStyles.css';

const CardHeader = (props) => {
  const {
    customizedHeader, heading, actionBtn, description, tagText, showBorder
  } = props;
  return (
    <>
      {
      customizedHeader && (
        <div>{customizedHeader}</div>
      )
    }
      <div className="card-header d-flex justify-content-between align-items-center">
        <div>
          <div className="d-flex align-items-center">
            <span className="text-tertiary font-size-xl font-weight-semibold mr-2">{heading}</span>
            {tagText && (
            <Tag
              className="py-1 px-2 border-0 font-weight-semibold"
              style={{ borderRadius: '1.2rem', color: '#3E79F7', lineHeight: '15px' }}
              color="#EFF8FF">
              {tagText}
            </Tag>
            )}
          </div>
          {description && (<div className="text-gray-light mt-1 font-size-base font-weight-normal">{description}</div>)}
        </div>
        <div className="d-flex justify-content-between button-container">{actionBtn}</div>
      </div>
      {showBorder && <Divider />}
    </>
  );
};

CardHeader.propTypes = {
  customizedHeader: PropTypes.element,
  heading: PropTypes.string,
  actionBtn: PropTypes.node,
  description: PropTypes.string,
  tagText: PropTypes.string,
  showBorder: PropTypes.bool
};

CardHeader.defaultProps = {
  customizedHeader: null,
  heading: '',
  actionBtn: '',
  description: '',
  tagText: '',
  showBorder: false
};

export default CardHeader;
