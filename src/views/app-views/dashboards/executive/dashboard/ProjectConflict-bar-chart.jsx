import React from 'react';

import { Card } from 'components/shared-components/Card';
import { useTranslation } from 'react-i18next';
import ChartWidget from 'components/shared-components/ChartWidget';

export const ProjectConflictChart = () => {
  const { t } = useTranslation();

  const mockData = [
    {
      projectName: 'Science 37',
      conflictsStats: [
        {
          open: 20,
          resolved: 82,
          cancelled: 10
        }
      ]

    },
    {
      projectName: 'Back country',
      conflictsStats: [
        {
          open: 80,
          resolved: 20,
          cancelled: 78
        }
      ]
    },
    {
      projectName: 'Pmo Tracket',
      conflictsStats: [
        {
          open: 200,
          resolved: 25
        }
      ]
    },
    {
      projectName: 'Gap',
      conflictsStats: [
        {
          open: 100,
          cancelled: 5
        }
      ]
    },
    {
      projectName: 'HayNiddle',
      conflictsStats: [
        {
          open: 100,
          resolved: 25
        }
      ]
    }
  ];

  const categories = [];
  const openConflicts = [];
  const resolvedConflicts = [];
  const cancelledConflicts = [];

  mockData.forEach((data) => {
    categories.push(data.projectName);
    openConflicts.push(data.conflictsStats[0].open || 0);
    resolvedConflicts.push(data.conflictsStats[0].resolved || 0);
    cancelledConflicts.push(data?.conflictsStats[0]?.cancelled || 0);
  });

  const series = [
    {
      name: 'Open',
      data: openConflicts
    },
    {
      name: 'Resolved',
      data: resolvedConflicts
    },
    {
      name: 'Cancelled',
      data: cancelledConflicts
    }
  ];

  const options = {
    toolbar: {
      show: false
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        borderRadiusApplication: 'end',
        distributed: false,
        columnWidth: '35px',
        horizontal: false
      }
    },
    colors: [function ({ seriesIndex }) {
      if (seriesIndex === 0) return '#59595A';
      if (seriesIndex === 1) return '#039855';
      if (seriesIndex === 2) return '#F62D2D';
    }
    ],
    legend: {
      show: true,
      showForSingleSeries: false
    },
    dataLabels: {
      position: 'top',
      maxItems: true
    },
    yaxis: {
      labels: {
        show: true
      },
      tickAmount: 10
    }
  };

  return (
    <Card
      heading={t('component.executive.dashboard.heading.projectRiskOverview')}
      showBorder>
      <div className="h-auto" style={{ minHeight: '320px' }}>
        <ChartWidget
          extra
          bodyClass="conflict-overview-chart"
          card={false}
          customOptions={options}
          xAxis={categories}
          series={series}
          type="bar"
          height={330} />
      </div>
    </Card>
  );
};
