import { Card } from 'components/shared-components/Card';
import { useTranslation } from 'react-i18next';
import { List, Empty } from 'antd';
import '../MyProjects.css';
import { calculateTotalCount } from 'utils/utils';
import { useSelector } from 'react-redux';
import Loading from 'components/shared-components/Loading';

const MyRisksStats = ({ type }) => {
  const { t } = useTranslation();
  const {
    riskManagement: {
      taggedConflicts: { taggedStats },
      monitoredConflicts: { monitoredStats },
      loading
    }
  } = useSelector((state) => ({
    riskManagement: state.riskManagement
  }));

  const totalTaggedCount = calculateTotalCount(taggedStats);
  const totalMonitoredCount = calculateTotalCount(monitoredStats);

  const totalCountOfConflicts = [
    { title: t('component.general.user.tagged.conflicts.title'), count: totalTaggedCount },
    { title: t('component.general.user.monitored.conflicts.title'), count: totalMonitoredCount }
  ];

  return (
    <Card
      heading={t('sidenav.dashboard.myRisks')}
      className={`${type ? 'user-project-stat-bar' : 'conflict-card-height'}`}
      showBorder>
      {loading && <Loading />}
      {(taggedStats.length > 0 || totalMonitoredCount.length > 0)
        ? (
          <List
            style={{ height: '125px' }}
            dataSource={totalCountOfConflicts}
            renderItem={(item) => (
              <List.Item>
                <div className="w-100 d-flex justify-content-between align-items-center">
                  <span className="conflict-text">{item.title}</span>
                  <span>{item.count}</span>
                </div>
              </List.Item>
            )} />
        )
        : <Empty />}
    </Card>
  );
};

export default MyRisksStats;
