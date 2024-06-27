import moment from 'moment';

export const jiraTimelineHeaders = [
  { key: 'stageName', title: 'Stage Name' },
  { key: 'subStageName', title: 'Substage' },
  { key: 'team', title: 'Team' },
  { key: 'jiraEpic', title: 'Jira Epics' }
];

export const ranges = {
  1: {
    startDate: '1/1/2023',
    endDate: '1/15/2023'
  },
  2: {
    startDate: '1/16/2023',
    endDate: '1/30/2023'
  }
};

export const data = [
  {
    start: moment('01-01-2023').toDate(),
    end: moment('01-5-2023').toDate(),
    id: 'erfdf-6630-4e81-82dc-033b7d9072bb',
    type: 'task',
    // progress: 100,
    // styles: { progressColor: '#ed7d31' },
    styles: { backgroundColor: '#ed7d31' },
    stage: 'Planning',
    subStageName: 'Discussion',
    team: 'PMO',
    jiraEpic: 'EP11'
  },
  {
    start: moment('01-11-2023').toDate(),
    end: moment('01-19-2023').toDate(),
    id: 'erfdf-6630-4e81-82dc-033b7d907h',
    type: 'task',
    styles: { backgroundColor: '#ed7d31' },
    stage: 'Discovery',
    subStageName: 'Discussion',
    team: 'Konva',
    jiraEpic: 'EP02'
  }, {
    start: moment('01-04-2023').toDate(),
    end: moment('01-12-2023').toDate(),
    id: 'erfdf-6630-4e81-8233b7d9072bb',
    type: 'task',
    styles: { backgroundColor: '#ed7d31' },
    stage: 'Design',
    subStageName: 'Moduler',
    team: 'Tickets',
    jiraEpic: 'EP04'
  }
];

export const projectDetails = {
  projectName: 'WSI',
  noOfSprints: 3,
  overview: 'WSI frontend',
  projectNumber: '1',
  category: 'Revenue Priority',
  priority: 'High',
  department: 'Finance',
  theme: 'light',
  currentStatus: 'Active',
  projectCadence: 'AGILE',
  outlook: 'green',
  outlookReason: 'Going on Time as per the timeline',
  currentStage: 'Planning',
  currentState: 'Committed',
  projectManager: 'Sohaib Farooqui',
  techLead: {
    firstName: 'TechLead',
    lastName: 'Sohaib',
    email: 'yikit85101@ngopy.com',
    accessType: 'GENERAL_USER',
    phoneNumber: null,
    companyId: null
  },
  productManager: 'Sehel',
  stakeHolders: [
    {
      firstName: 'TechLead',
      lastName: 'Sohaib',
      email: 'yikit85101@ngopy.com',
      accessType: 'GENERAL_USER',
      phoneNumber: null,
      companyId: null
    }
  ]
};
