import { Card } from 'components/shared-components/Card';
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Loading from 'components/shared-components/Loading';
import ChartWidget from 'components/shared-components/ChartWidget';
import {
  Empty
} from 'antd';

const UserTrackCharWidget = ({
  totalUsers, usersCount, heading, loading
}) => {
  const { t } = useTranslation();

  const hasData = !loading && usersCount?.totalSum > 0;

  const userTrackChartOptions = {
    plotOptions: {
      bar: {
        borderRadius: 8,
        borderRadiusApplication: 'end',
        columnWidth: '35px',
        horizontal: false
      }
    },
    yaxis: {
      forceNiceScale: true
    }
  };

  return (
    <Card
      heading={heading}
      description={t('component.user.dashboard.widget.description')}
      tagText={`${totalUsers} ${t('component.user.dashboard.label.users')}`}
      showBorder>
      <div className="align-content-lg-center" style={{ height: '360px', display: !hasData ? 'grid' : '' }}>
        {loading && <Loading />}
        {
      hasData && (
        <ChartWidget
          extra
          bodyClass="conflict-overview-chart"
          card={false}
          xAxis={usersCount?.labels}
          series={[{
            name: t('component.user.dashboard.label.users'),
            data: usersCount?.series
          }]}
          customOptions={userTrackChartOptions}
          type="bar"
          data-i="users-bar-chart" />
      )
}

        {!loading && !hasData && <Empty /> }

      </div>
    </Card>
  );
};

export default UserTrackCharWidget;

UserTrackCharWidget.propTypes = {
  totalUsers: PropTypes.number,
  usersCount: PropTypes.shape({
    series: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.number),
      PropTypes.array
    ]).isRequired,
    labels: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.array
    ]).isRequired
  }).isRequired,
  heading: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired
};

UserTrackCharWidget.defaultProps = {
  totalUsers: 0
};
