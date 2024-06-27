export const headers = [
  { key: 'projectName', title: 'Project Name' },
  { key: 'outlook', title: 'Outlook', bullet: true },
  { key: 'priority', title: 'Priority' },
  { key: 'stage', title: 'Stage' },
  { key: 'status', title: 'Status' },
  { key: 'nextMilestone', title: 'Next Milestone' }];
export const ranges = {
  data: {
    sprints: [
      {
        startDate: '2023-07-02T00:00:00.000+00:00',
        endDate: '2023-07-21T00:00:00.000+00:00',
        duration: 20,
        name: 'Sprint 10'
      },
      {
        startDate: '2023-07-22T00:00:00.000+00:00',
        endDate: '2023-08-10T00:00:00.000+00:00',
        duration: 20,
        name: 'Sprint 11'
      },
      {
        startDate: '2023-08-11T00:00:00.000+00:00',
        endDate: '2023-08-30T00:00:00.000+00:00',
        duration: 20,
        name: 'Sprint 12'
      },
      {
        startDate: '2023-08-31T00:00:00.000+00:00',
        endDate: '2023-09-19T00:00:00.000+00:00',
        duration: 20,
        name: 'Sprint 13'
      },
      {
        startDate: '2023-09-20T00:00:00.000+00:00',
        endDate: '2023-10-09T00:00:00.000+00:00',
        duration: 20,
        name: 'Sprint 14'
      },
      {
        startDate: '2023-10-10T00:00:00.000+00:00',
        endDate: '2023-10-29T00:00:00.000+00:00',
        duration: 20,
        name: 'Sprint 15'
      },
      {
        startDate: '2023-10-30T00:00:00.000+00:00',
        endDate: '2023-11-18T00:00:00.000+00:00',
        duration: 20,
        name: 'Sprint 16'
      },
      {
        startDate: '2023-11-19T00:00:00.000+00:00',
        endDate: '2023-12-08T00:00:00.000+00:00',
        duration: 20,
        name: 'Sprint 17'
      },
      {
        startDate: '2023-12-09T00:00:00.000+00:00',
        endDate: '2023-12-28T00:00:00.000+00:00',
        duration: 20,
        name: 'Sprint 18'
      },
      {
        startDate: '2023-12-29T00:00:00.000+00:00',
        endDate: '2024-01-17T00:00:00.000+00:00',
        duration: 20,
        name: 'Sprint 19'
      }
    ]
  }
};

export const ganttData = {
  data: {
    content: [
      {
        projectId: '2c421e3e-07d8-488b-988e-1fa5bfdeb6cc',
        startDate: '04-07-2023',
        endDate: '22-08-2023',
        projectName: 'Progolis',
        outlook: 'Green',
        outlookCode: '#32CD32',
        department: 'IT',
        stage: 'Discovery',
        status: 'Active',
        theme: 'white',
        priority: 'Medium',
        category: 'Growth Priority',
        createdBy: 'adanish@yopmail.com',
        allConflicts: 'Conflict-13',
        taggedConflicts: 'Conflict-1'
      },
      {
        projectId: '338efc55-499b-407e-ab49-3bb1701cf133',
        startDate: '11-07-2023',
        endDate: '21-08-2023',
        projectName: 'PMO',
        outlook: 'Brown',
        outlookCode: '#964B00',
        department: 'Product',
        stage: 'Development',
        status: 'Active',
        theme: 'green',
        priority: 'High',
        category: 'Business Priority',
        createdBy: 'adanish@yopmail.com',
        allConflicts: 'Conflict-15',
        taggedConflicts: 'Conflict-4'
      }
    ],
    totalElements: 2
  }
};

export const SprintBulletinData = [{
  message: 'Message about environments',
  date: '11/12/2023 23:24:22'
},
{
  message: 'Message about environments',
  date: '11/12/2023 23:24:22'
},
{
  message: 'Message about environments',
  date: '11/12/2023 23:24:22'
},
{
  message: 'Message about hours',
  date: '11/12/2023 23:24:22'
},
{
  message: 'Message about hours',
  date: '11/12/2023 23:24:22'
},
{
  message: 'Message about hours',
  date: '11/12/2023 23:24:22'
},
{
  message: 'Message about hours',
  date: '11/12/2023 23:24:22'
},
{
  message: 'Message about hours',
  date: '11/12/2023 23:24:22'
}
];

export const MyConflictsData = [
  { category: 'Tagged Conflicts', count: 4 },
  { category: 'New Conflicts', count: 1 },
  { category: 'Monitored Conflicts', count: 3 }
];

export const AllocationSprintStatusData = {
  series: [
    {
      name: 'Shopping Cart Design',
      data: [43, 12]
    },
    {
      name: 'Kroger Shipping Integrration',
      data: [31, 44, 12, 42]
    },
    {
      name: 'Gap Sales',
      data: [43, 52, 38, 24, 33, 26]
    },
    {
      name: 'PMO Tracker',
      data: [35, 41, 62, 42, 13, 18, 29, 25, 31]
    }
  ],
  categories: [
    'Sprint 1',
    'Sprint 2',
    'Sprint 3',
    'Sprint 4',
    'Sprint 5',
    'Sprint 6',
    'Sprint 7',
    'Sprint 8',
    'Sprint 9',
    'Sprint 10'
  ]
};

export const JiraStoriesData = {
  series: [
    {
      data: [43, 12, 50, 19, 50]
    }
  ],
  categories: [
    'Backlog',
    'Sprint 2',
    'Sprint 3',
    'Sprint 4',
    'Sprint 5'
  ]
};
