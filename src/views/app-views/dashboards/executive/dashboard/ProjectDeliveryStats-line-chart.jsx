import React from 'react';

import { Card } from 'components/shared-components/Card';
import { useTranslation } from 'react-i18next';
import ChartWidget from 'components/shared-components/ChartWidget';

export const ProjectDeliveryStats = () => {
  const { t } = useTranslation();
  const data = [
    { deliveryDate: '10-01-2024', name: 'Project 1-Haka' },
    { deliveryDate: '1-02-2024', name: 'Project 2-Ninja' },
    { deliveryDate: '20-03-2024', name: 'Project 3-PMO ' },
    { deliveryDate: '30-07-2025', name: 'Project 4-PMO ' },
    { deliveryDate: '14-03-2028', name: 'Project 6-PMO ' },
    { deliveryDate: '14-03-2029', name: 'Project 57-PMO ' },
    { deliveryDate: '14-03-2030', name: 'Project 32-PMO ' },
    { deliveryDate: '14-03-2040', name: 'Project xyz' },
    { deliveryDate: '14-03-2041', name: 'Project Hellow' }
  ];

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const state = {
    options: {
      chart: {
        type: 'line',
        height: 250,
        stacked: false,
        background: '#FFFFFF'
      },
      xaxis: {
        type: 'name',
        labels: {
          rotate: -45,
          formatter(value) {
            return value;
          },
          style: {
            colors: '#FF7A33'
          }
        }
      },
      yaxis: {
        type: 'datetime',
        labels: {
          formatter(value) {
            return new Date(value).toDateString();
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        colors: ['#000'],
        show: true,
        curve: 'straight',
        width: 10
      },
      markers: {
        size: 10,
        shape: 'square',
        colors: 'red'
      },
      grid: {
        show: true,
        borderColor: '#E4E7EC',
        strokeDashArray: 0,
        position: 'back',
        xaxis: {
          lines: {
            show: true
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        }
      }
    },
    series: [
      {
        name: 'Project Deadline',
        data: data.map((project) => ({
          x: project.name,
          y: parseDate(project.deliveryDate).getTime()
        }))
      }
    ]
  };

  return (
    <Card heading={t('component.executive.dashboard.heading.projectDeliveryDate')} showBorder>
      <div style={{ minHeight: '300px' }}>
        <ChartWidget
          extra
          bodyClass="conflict-overview-chart"
          card={false}
          customOptions={state.options}
          series={state?.series}
          type="line"
          height={330}
          width={650} />
      </div>
    </Card>
  );
};
