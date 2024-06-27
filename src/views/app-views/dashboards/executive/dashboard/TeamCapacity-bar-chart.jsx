import React from 'react';
import { useTranslation } from 'react-i18next';

import { Card } from 'components/shared-components/Card';
import ChartWidget from 'components/shared-components/ChartWidget';

export const TeamCapacity = () => {
  const { t } = useTranslation();

  const mockData = [
    {
      sprintName: 'Sprint 20',
      teams: [
        {
          name: 'Team DT-1',
          data: 29
        },
        {
          name: 'Team DT-2',
          data: 40
        },
        {
          name: 'Team DT-4',
          data: 77
        },
        {
          name: 'Fire Fighters',
          data: 33
        },
        {
          name: 'Envirmenntal Team',
          data: 70
        },
        {
          name: 'Team Financce',
          data: 34
        }
      ]
    },
    {
      sprintName: 'Sprint 21',
      teams: [
        {
          name: 'Team DT-1',
          data: 29
        },
        {
          name: 'Team DT-2',
          data: 40
        },
        {
          name: 'Team DT-4',
          data: 77
        }
      ]
    },
    {
      sprintName: 'Sprint 22',
      teams: [
        {
          name: 'Fire Fighters',
          data: 33
        },
        {
          name: 'Envirmenntal Team',
          data: 70
        },
        {
          name: 'Team Financce',
          data: 5
        }
      ]
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
  const categories = mockData.map((sprint) => sprint.sprintName);
  const teams = mockData.reduce((accumulator, sprint) => {
    sprint.teams.forEach((team) => {
      const existingTeam = accumulator.find((checkTeam) => checkTeam.name === team.name);
      if (!existingTeam) {
        accumulator.push({ name: team.name, data: [] });
      }
    });
    return accumulator;
  }, []);

  mockData.forEach((sprint) => {
    teams.forEach((team) => {
      const sprintTeam = sprint.teams.find((existingTeam) => existingTeam.name === team.name);
      team.data.push(sprintTeam ? sprintTeam.data : 0);
    });
  });

  const series = teams.map((team) => ({
    name: team.name,
    data: team.data
  }));

  return (
    <Card
      heading={t('component.executive.dashboard.heading.teamCapacity')}
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
