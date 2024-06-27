import {
  Modal as AntModal, Row, Col, Typography, Button
} from 'antd';
import PropTypes from 'prop-types';
import './index.css';
import { noop } from 'lodash';
import { ExclamationCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import IntlMessage from 'components/util-components/IntlMessage';

/* secondaryActionsButtons is the config of customize buttons,
   to use it you need to define the footer null where you are imporing this component.
 * secondaryActionsButtons confing contains the all attributes of buttons.
 * Action " close " logic will perform your modal close action also it will display the
   confirmation message if confirmOnCancel gets true.
*/
const Modal = ({
  customWidth, customHeight, destroyOnClose, description,
  title, isOpen, onCancel, isFullScreen, children, wrapClassName, confirmOnCancel,
  secondaryActionsButtons, bodyStyle, ...props
}) => {
  const { Text, Title } = Typography;
  const { confirm } = AntModal;
  const showConfirm = () => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: <h5><IntlMessage id="component.message.unsavedChanges" /></h5>,
      onOk() {
        onCancel();
      }
    });
  };

  const cancelHandler = () => {
    if (confirmOnCancel) {
      showConfirm();
    } else {
      onCancel();
    }
  };
  const actionButtons = () => (
    <Row gutter={14} justify="end">
      {
        secondaryActionsButtons?.map((items, index) => (
          <Col key={items?.label} span={items?.colSpan}>
            <Button
              block={items?.block}
              disabled={items.disable}
              icon={items.icon}
              loading={items.loading}
              onClick={items?.action === 'close' ? cancelHandler : items?.action}
              ghost={items.ghost || false}
              shape={items.shape || 'default'}
              size={items.size || 'middle'}
              type={items.type || 'primary'}
              id={`secondary-button-${index + 1}`}>
              {items?.label}
            </Button>
          </Col>
        ))
      }
    </Row>
  );

  return (
    <AntModal
      bodyStyle={{ height: customHeight, ...bodyStyle }}
      closeIcon={<CloseCircleOutlined style={{ fontSize: '22px' }} />}
      width={`${customWidth}px`}
      destroyOnClose={destroyOnClose}
      open={isOpen}
      wrapClassName={(isFullScreen ? 'modal-full-screen' : '') + wrapClassName}
      onCancel={cancelHandler}
      {...props}>
      <Row className="title">
        <Col span={24}>
          <Title level={4}>{title}</Title>
        </Col>
        <Col span={24}>
          <Text className="description-text">{description}</Text>
        </Col>
      </Row>
      {children}
      <Col className={isFullScreen ? 'fixed-bottom p-3' : ''}>{secondaryActionsButtons?.length > 0 ? actionButtons() : null}</Col>
    </AntModal>
  );
};

Modal.propTypes = {
  customHeight: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  secondaryActionsButtons: PropTypes.arrayOf(PropTypes.shape({
    action: PropTypes.PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func
    ]),
    block: PropTypes.bool,
    colSpan: PropTypes.number,
    disable: PropTypes.bool,
    loading: PropTypes.bool,
    label: PropTypes.string,
    type: PropTypes.string
  })),
  customWidth: PropTypes.number,
  title: PropTypes.string,
  description: PropTypes.string,
  destroyOnClose: PropTypes.bool,
  isOpen: PropTypes.bool,
  onCancel: PropTypes.func,
  isFullScreen: PropTypes.bool,
  children: PropTypes.node.isRequired,
  wrapClassName: PropTypes.string,
  confirmOnCancel: PropTypes.bool
};
Modal.defaultProps = {
  secondaryActionsButtons: [],
  customWidth: 408,
  customHeight: 'auto',
  title: '',
  description: '',
  destroyOnClose: false,
  isOpen: false,
  onCancel: noop,
  isFullScreen: false,
  wrapClassName: '',
  confirmOnCancel: false
};

export default Modal;
