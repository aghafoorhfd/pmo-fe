import moment from 'moment';

export const ranges = {
  'Sprint 1': {
    startDate: '1/1/2023',
    endDate: '1/15/2023'
  },
  'Sprint 2': {
    startDate: '01/16/2023',
    endDate: '01/30/2023'
  },
  'Sprint 3': {
    startDate: '02/1/2023',
    endDate: '02/15/2023'
  },
  'Sprint 4': {
    startDate: '02/16/2023',
    endDate: '02/30/2023'
  }
};

export const headers = [
  { key: 'projectName', title: 'Project Name' }
];

export const myWorkData = [
  {
    start: moment('01-01-2023').toDate(),
    end: moment('01-14-2023').toDate(),
    id: 'Task 0',
    type: 'task',
    stageName: '75%',
    progress: 75,
    subStageName: '',
    projectName: 'Project 1',
    styles: { backgroundColor: '#4573c4', progressColor: '#ed7d31' }
  },
  {
    start: moment('1-01-2023').toDate(),
    end: moment('1-15-2023').toDate(),
    id: 'Task 11',
    type: 'task',
    stageName: '50%',
    progress: 50,
    subStageName: 'Planning',
    projectName: 'Boxers',
    styles: { backgroundColor: '#4573c4', progressColor: '#ed7d31' }
  },
  {
    start: moment('1-01-2023').toDate(),
    end: moment('1-10-2023').toDate(),
    id: 'Task 22',
    type: 'task',
    stageName: '100%',
    progress: 100,
    projectName: 'Project 2',
    styles: { backgroundColor: '#4573c4', progressColor: '#ed7d31' }
  },
  {
    start: moment('1-01-2023').toDate(),
    end: moment('1-15-2023').toDate(),
    id: 'Task 1',
    type: 'task',
    stageName: '10%',
    progress: 10,
    subStageName: 'Development',
    projectName: 'Boxers',
    styles: { backgroundColor: '#4573c4', progressColor: '#ed7d31' }
  },
  {
    start: moment('1-01-2023').toDate(),
    end: moment('2-01-2023').toDate(),
    id: 'Task 2',
    type: 'task',
    stageName: '25%',
    progress: 25,
    projectName: 'Project 3',
    styles: { backgroundColor: '#4573c4', progressColor: '#ed7d31' }
  },
  {
    start: moment('1-01-2023').toDate(),
    end: moment('1-15-2023').toDate(),
    id: 'Task 3',
    type: 'task',
    stageName: '50%',
    progress: 50,
    projectName: 'Project 4',
    styles: { backgroundColor: '#4573c4', progressColor: '#ed7d31' }
  }
];
