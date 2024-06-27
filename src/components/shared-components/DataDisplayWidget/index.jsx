import React from 'react';
import { Card, Avatar } from 'antd';
import Flex from '../Flex';
import CustomStatistic from '../CustomStatistic';

function DataDisplayWidget(props) {
  const {
    size, value, title, icon, color, avatarSize, vertical
  } = props;
  const customStatisticProps = { size, value, title };
  return (
    <Card>
      <Flex alignItems="center" flexDirection={vertical ? 'column' : 'row'}>
        <Avatar className={`ant-avatar-${color}`} icon={icon} shape="square" size={avatarSize} />
        <div className={vertical ? 'mt-3 text-center' : 'ml-3'}>
          <CustomStatistic {...customStatisticProps} />
        </div>
      </Flex>
    </Card>
  );
}

DataDisplayWidget.defaultProps = {
  avatarSize: 50,
  vertical: false
};

export default DataDisplayWidget;
