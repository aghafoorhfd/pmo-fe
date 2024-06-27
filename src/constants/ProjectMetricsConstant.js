export const PROJECT_STATES = 'Project States';
export const PROJECT_STATUS = 'Project Status';
export const PROJECT_OUTLOOK = 'Project Outlook';

export const tagColors = {
  [PROJECT_STATES]: ['#989898', '#4674ca', '#b0d2a1', '#989898'],
  [PROJECT_STATUS]: ['#b0d2a1', '#FFCCCC']
};

export const initialCompanyConfiguration = {
  projectStages: { selected: [], notSelected: [] },
  sponsoringDepartment: { selected: [], notSelected: [] },
  milestones: { selected: [], notSelected: [] },
  resourceDiscipline: { selected: [], notSelected: [] },
  projectCategory: { selected: [], notSelected: [] },
  projectPriorityLevel: { selected: [], notSelected: [] }
};

export const initialGlobalConfiguration = {
  projectStages: [],
  sponsoringDepartment: [],
  milestones: [],
  projectStatus: [],
  projectStates: [],
  projectCategory: [],
  projectPriorityLevel: []
};

export const methodologyType = {
  AGILE: 'agile',
  SDLC: 'sdlc',
  AGILE_CAPS: 'AGILE',
  SDLC_CAPS: 'SDLC',
  AGILE_SDLC: 'AGILE_SDLC'
};
