import { startCase } from 'lodash';

export const chartDataMapper = (data) => {
  const series = [];
  const label = [];
  if (Object.keys(data)?.length) {
    Object.keys(data).forEach((key) => {
      series.push(data[key]);
      label.push(startCase(key));
    });
  }
  return { series, label };
};

export const resourceCommitmentRawData = {
  ranges: {
    244: {
      startDate: '13 Feb',
      endDate: '3 Mar'
    },
    245: {
      startDate: '4 Mar',
      endDate: '12 Mar'
    },
    246: {
      startDate: '13 Feb',
      endDate: '3 Mar'
    },
    247: {
      startDate: '4 Mar',
      endDate: '12 Mar'
    },
    248: {
      startDate: '13 Feb',
      endDate: '3 Mar'
    },
    249: {
      startDate: '4 Mar',
      endDate: '12 Mar'
    },
    250: {
      startDate: '13 Feb',
      endDate: '3 Mar'
    },
    251: {
      startDate: '4 Mar',
      endDate: '12 Mar'
    },
    252: {
      startDate: '13 Feb',
      endDate: '3 Mar'
    },
    253: {
      startDate: '4 Mar',
      endDate: '12 Mar'
    },
    254: {
      startDate: '13 Feb',
      endDate: '3 Mar'
    },
    255: {
      startDate: '4 Mar',
      endDate: '12 Mar'
    }
  },
  teamList: [{ label: 'Ninja Warrior', value: 1 }, { label: 'Fahad Ali', value: 2 }, { label: 'Muhazzib Ali', value: 3 }],
  teams: [{
    teamName: 'Ninja Warrior',
    teamAvailableHours: {
      244: 60,
      245: 80
    },
    availableCapacity: {
      244: '0%',
      245: '40%'
    },
    teamResources: [
      {
        name: 'Joseph Smith',
        availableCapacity: {
          244: '0%',
          245: '80%'
        },
        availableHours: {
          244: '0',
          245: '40'
        },
        projects: {
          'New Website Page Project': {
            244: '20',
            245: '40'
          },
          'Data Migration Project': {
            244: '20',
            245: null
          },
          'Financial Planner': {
            244: '20',
            245: '40'
          },
          'Triangular Market': {
            244: '20',
            245: '40'
          }
        }
      },
      {
        name: 'John',
        availableCapacity: {
          244: '0%',
          245: '80%'
        },
        availableHours: {
          244: '0',
          245: '40'
        },
        projects: {
          'New Website Page Project': {
            244: '20',
            245: '40'
          },
          'Data Migration Project': {
            244: '20',
            245: null
          },
          'Financial Planner': {
            244: '20',
            245: '40'
          },
          'Triangular Market': {
            244: '20',
            245: '40'
          }
        }
      }
    ]

  }
  ]
};
