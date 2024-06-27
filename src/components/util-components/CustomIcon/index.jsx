import React from 'react';
import Icon from '@ant-design/icons';

const CustomIcon = React.forwardRef((props) => (
  <Icon className={props.className} component={props.svg} />
));

export default CustomIcon;
