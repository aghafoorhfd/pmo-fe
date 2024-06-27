import React from 'react';
import {
  Drawer, Empty, Timeline
} from 'antd';
import { useTranslation } from 'react-i18next';
import './index.css';

const SubStagesDrawer = ({ open, onClose, subStages }) => {
  const { t } = useTranslation();

  return (
    <Drawer
      title={subStages?.length > 0 ? t('component.project.manager.timelines.numberOfSubStages', { count: subStages?.length }) : t('component.project.manager.timelines.noSubStage')}
      placement="right"
      onClose={onClose}
      open={open}>
      {subStages?.length > 0 ? (
        <Timeline className="sub-stage-tooltip">
          {subStages.map(({
            outlook, subStageName, startDate, endDate
          }) => (
            <Timeline.Item color={outlook} key={subStageName}>
              {subStageName}
              <p>
                {t('component.project.manager.timelines.stage.startDate')}
                :
                {' '}
                {startDate}
                <br />
                {t('component.project.manager.timelines.stage.endDate')}
                :
                {' '}
                {endDate}
              </p>
            </Timeline.Item>
          ))}
        </Timeline>
      )
        : <Empty />}
    </Drawer>
  );
};

export default SubStagesDrawer;
