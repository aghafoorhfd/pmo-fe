import IntlMessage from 'components/util-components/IntlMessage';

export const USER_REGISTRATION_STATUS = {
  ACTIVE: {
    key: 'ACTIVE',
    label: 'component.user.dashboard.activeUsers',
    tagColor: '#ECFDF3',
    textColor: '#027A48'
  },
  REVOKED: {
    key: 'REVOKED',
    label: 'component.user.dashboard.revokedUsers',
    tagColor: '#FEF3F2',
    textColor: '#B42318'
  },
  PENDING: {
    key: 'PENDING',
    label: 'component.user.dashboard.pending',
    tagColor: '#FFF6ED',
    textColor: '#C4320A'
  },
  REJECTED: {
    key: 'REJECTED',
    label: 'component.user.dashboard.rejected',
    tagColor: '#FEF3F2',
    textColor: '#B42318'
  }
};
export const USER_DASHBOARD_TABS = {
  CURRENT_USERS: 'current-users',
  ACTIVE: 'active',
  REVOKED: 'revoked',
  USER_REQUESTS: 'user-requests',
  PENDING: 'pending',
  REJECTED: 'rejected'
};

export const USER_DASHBOARD_ACTIONS = {
  SEND_INVITE: 'send-invite',
  EDIT_USER: 'edit',
  GRANT_ACCESS: 'grant-access',
  REVOKE_ACCESS: 'revoke-access',
  DELETE: 'delete',
  REQUEST_APPROVE: 'approve',
  REQUEST_REJECT: 'reject'

};

export const REGISTRATION_STATUS = {
  PENDING: <IntlMessage id="component.user.dashboard.pending" />,
  ACTIVE: <IntlMessage id="component.user.dashboard.active" />,
  IN_ACTIVE: <IntlMessage id="component.user.dashboard.inActive" />
};

export const PLAN_STATUS = {
  ACTIVE: <IntlMessage id="component.customer.activation.status.active" />,
  IN_ACTIVE: <IntlMessage id="component.customer.activation.status.inActive" />
};

export const INVITATION_STATUS = {
  SEND_INVITATION: <IntlMessage id="component.user.dashboard.sendInvite" />,
  INVITATION_SENT: <IntlMessage id="component.user.dashboard.resendInvite" />,
  INVITATION_VERIFIED: <IntlMessage id="component.user.dashboard.verifiedInvite" />,
  INVITATION_EXPIRED: <IntlMessage id="component.user.dashboard.resendInvite" />
};

export const ROLES_ACCESS_TYPES = {
  ADMIN: { key: 'ADMIN', value: 'component.user.dashboard.role.admin' },
  CONFLICT_MANAGER: { key: 'CONFLICT_MANAGER', value: 'component.user.dashboard.role.conflictManager' },
  GENERAL_USER: { key: 'GENERAL_USER', value: 'component.user.dashboard.role.generalUser' },
  PROJECT_MANAGER: { key: 'PROJECT_MANAGER', value: 'component.user.dashboard.role.projectManager' },
  RESOURCE_MANAGER: { key: 'RESOURCE_MANAGER', value: 'component.user.dashboard.role.resourceManager' },
  SUPER_ADMIN: { key: 'SUPER_ADMIN', value: 'component.user.dashboard.role.superAdmin' },
  EXECUTIVE: { key: 'EXECUTIVE', value: 'component.constant.dropDownOptions.executive' }
};

export const DESIGNATION_TYPES = {
  DEVELOPER: { key: 'DEVELOPER', value: <IntlMessage id="component.constant.designations.developer" /> },
  QA: { key: 'QA', value: <IntlMessage id="component.constant.designations.qa" /> },
  DEVOPS: { key: 'DEVOPS', value: <IntlMessage id="component.constant.designations.devOps" /> },
  UX_DESIGNER: { key: 'UX_DESIGNER', value: <IntlMessage id="component.constant.designations.ux.designer" /> },
  UI_DESIGNER: { key: 'UI_DESIGNER', value: <IntlMessage id="component.constant.designations.ui.designer" /> },
  UI_UX: { key: 'UI_UX', value: <IntlMessage id="component.constant.designations.uiux" /> },
  RESOURCE_MANAGER: { key: 'RESOURCE_MANAGER', value: <IntlMessage id="component.constant.designations.resourceManager" /> },
  TEAM_LEAD: { key: 'TEAM_LEAD', value: <IntlMessage id="component.constant.designations.teamLead" /> }
};

export const OUTLOOK_CLASSNAME = {
  Red: 'outlook-reason-red',
  Green: 'outlook-reason-green',
  Orange: 'outlook-reason-orange'
};
export const OutlookOptions = [
  { label: 'Red', value: 'red' },
  { label: 'Green', value: 'green' },
  { label: 'Orange', value: 'orange' }
];
export const ERROR_CODE = '9999';

export const METRICS = {
  STAGES: 'STAGES',
  MILESTONES: 'MILESTONES',
  CATEGORY: 'CATEGORY',
  RESOURCE: 'RESOURCE',
  DEPARTMENT: 'DEPARTMENT',
  PRIORITY: 'PRIORITY'
};

export const PROJECT_METRICS = {
  STAGES: 'PROJECT_STAGES',
  MILESTONES: 'MILESTONES',
  RESOURCE: 'RESOURCE_DISCIPLINE',
  CATEGORY: 'PROJECT_CATEGORY',
  DEPARTMENT: 'SPONSORING_DEPARTMENT',
  PRIORITY: 'PROJECT_PRIORITY_LEVEL'
};

export const METRICS_COMPONENTS_PROPS_KEY = {
  STAGES: 'projectStages',
  MILESTONES: 'milestones',
  CATEGORY: 'projectCategory',
  RESOURCE: 'resourceDiscipline',
  DEPARTMENT: 'sponsoringDepartment',
  PRIORITY: 'projectPriorityLevel'
};

export const metricKeyMapping = {
  STAGES: 'stages',
  MILESTONES: 'milestones',
  CATEGORY: 'projectCategories',
  RESOURCE: 'resourceDisciplines',
  DEPARTMENT: 'sponsoringDepartments',
  PRIORITY: 'priority'
};

export const PROJECT_MANAGER_TABS = {
  MY_PROJECTS: 'Your Projects',
  OTHER_PROJECTS: 'Other Projects'
};

export const CADENCE_TABS = {
  SDLC: { label: <IntlMessage id="component.projectMetrics.form.sdlc" />, value: 'SDLC' },
  AGILE: { label: <IntlMessage id="component.projectMetrics.form.agile" />, value: 'AGILE' }
};

export const PROJECT_METRICS_KEYS_MAPPING = {
  PROJECT_STAGES: 'projectStages',
  MILESTONES: 'milestones',
  PROJECT_CATEGORY: 'projectCategory',
  RESOURCE_DISCIPLINE: 'resourceDiscipline',
  SPONSORING_DEPARTMENT: 'sponsoringDepartment',
  PROJECT_PRIORITY_LEVEL: 'projectPriorityLevel'
};
export const CONFLICT_ACTIONS = {
  OPENED: 'OPENED',
  RESOLVED: 'RESOLVED',
  CANCELLED: 'CANCELLED'
};

export const initialPaginationConfiguration = { page: 1, pageSize: 10 };

export const TOKEN_EXPIRE_ERROR_CODE = ['1002', '9999'];

export const SELECTED_PACKAGE_KEY = 'selected_package';

export const SEVERITY_OPTIONS = [
  { label: 'High', value: 'HIGH' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'Low', value: 'LOW' }
];

export const BILLING_OPTIONS = {
  MONTHLY: 'Monthly',
  YEARLY: 'Yearly',
  FREE: 'Free'
};
// STRIPE CONSTANTS
export const STRIPE_CURRENCY_USD = 'usd';

export const STRIPE_WEBHOOK_EVENTS = {
  succeeded: 'succeeded',
  processing: 'processing',
  requiresPaymentMethod: 'requires_payment_method'
};

export const FEATURES = {
  jiraIntegration: 'Jira Integration',
  rallyIntegration: 'Rally Integration',
  corporateProfileManager: 'Corporate Profile Manager',
  resourceManager: 'Resource Manager',
  okrManager: 'OKR Manager',
  conflictManager: 'Conflict Manager',
  executiveDashboard: 'Executive Dashboard',
  projectManager: 'Project Manager',
  budgetManager: 'Budget Manager',
  quarterlyPlanner: 'Quarterly Planner',
  confluenceIntegration: 'Confluence Integration'
};

export const PROJECT_TIMELINES_METRICS = {
  STAGES: 'stages',
  SUB_STAGES: 'subStages',
  MILESTONES: 'milestones',
  DEPENDENCY: 'dependency',
  SUB_STAGES_DEPENDENCY: 'subStagesDependency'
};

export const CONFLICT_STATUS = {
  OPENED: {
    label: 'component.conflict.manager.status.open',
    tagColor: '#FFF6ED',
    textColor: '#C4320A'
  },
  RESOLVED: {
    label: 'component.conflict.manager.status.resolved',
    tagColor: '#ECFDF3',
    textColor: '#027A48'
  },
  CANCELLED: {
    label: 'component.conflict.manager.status.cancelled',
    tagColor: '#E4E7EC',
    textColor: '#1D2939'
  }
};

export const MILESTONES_STATUS = {
  DONE: { value: <IntlMessage id="component.project.manager.timelines.milestone.status.done" />, key: 'DONE' },
  IMPACTED: { value: <IntlMessage id="component.project.manager.timelines.milestone.status.impacted" />, key: 'IMPACTED' },
  IN_PROGRESS: { value: <IntlMessage id="component.project.manager.timelines.milestone.status.inProgress" />, key: 'IN_PROGRESS' }
};

export const JIRA_WORK_PROGRESS_CHART_COLORS = {
  BACKLOG: '#f74c09',
  IN_PROGRESS: '#578cff',
  CLOSED: '#039855',
  TODO: '#98A2B3'
};

export const REQUEST_STATUS = {
  IN_PROGRESS: 'IN_PROGRESS', ASSIGNED: 'ASSIGNED', REJECTED: 'REJECTED', WITHDRAW: 'WITHDRAW'
};

export const stagesColors = ['#4D4D4D', '#999999', '#F44E3B', '#FE9200', '#FCDC00', '#DBDF00', '#A4DD00', '#68CCCA', '#73D8FF', '#AEA1FF', '#FDA1FF', '#333333', '#808080', '#cccccc', '#D33115', '#E27300', '#FCC400', '#B0BC00', '#68BC00', '#16A5A5', '#009CE0', '#7B64FF', '#FA28FF', '#000000', '#666666', '#B3B3B3', '#9F0500', '#C45100', '#FB9E00', '#808900', '#194D33', '#0C797D', '#0062B1', '#653294', '#AB149E'];

export const shortDesignations = {
  Backend: 'BE',
  DevOps: 'Dev Ops',
  QA: 'QA',
  'Business Developer': 'BD',
  'Front-End': 'FE',
  UX_DESIGNER: 'UX',
  UI_DESIGNER: 'UI'
};

export const COMMITMENT_ACTIONS = {
  COMMITTED: 'COMMITTED',
  DESIGNATED: 'DESIGNATED',
  ASSIGNED: 'ASSIGNED'
};

export const USER_STATS_TYPES = {
  USER_STATS: 'USER_STATS',
  PENDING_REQUEST_STATS: ' PENDING_REQUEST_STATS',
  USER_PIE_CHART_STATS: 'USER_PIE_CHART_STATS'
};

export const USER_GRAPH_STATUS = {
  ACTIVE: { key: 'ACTIVE', value: 'component.common.used', color: '#039855' },
  REVOKED: { key: 'REVOKED', value: 'component.customer.activation.status.inActive', color: '#F79009' },
  UNUSED_LICENSES: { key: 'UNUSED_LICENSES', value: 'component.user.dashboard.remainingLicense', color: '#509CF5' },
  PENDING: { key: 'PENDING', value: 'component.user.dashboard.pending', color: '#FEC840' },
  REJECTED: { key: 'REJECTED', value: 'component.user.dashboard.rejected', color: '#98A2B3' }
};

export const PHONE_NUMBER_ERRORS = {
  INVALID_COUNTRY: 'component.userForm.number.invalid.country',
  TOO_SHORT: 'component.userForm.number.too.short',
  NOT_A_NUMBER: 'component.userForm.number.not.number'
};
export const CONFLICTS_TABS = {
  OPEN_CONFLICTS: 'open-conflicts',
  RESOLVED_CONFLICTS: 'resolved-conflicts',
  CANCELLED_CONFLICTS: 'cancelled-conflicts'
};

export const CONFLICTS_STATUS = {
  OPEN: {
    key: 'OPEN',
    label: 'component.general.user.conflict.status.open',
    tagColor: '#ECFDF3',
    textColor: '#027A48'
  },
  RESOLVED: {
    key: 'RESOLVED',
    label: 'component.general.user.conflict.status.resolved',
    tagColor: '#FEF3F2',
    textColor: '#F79009'
  },
  CANCELLED: {
    key: 'CANCELLED',
    label: 'component.general.user.conflict.status.cancelled',
    tagColor: '#FFF6ED',
    textColor: '#C4320A'
  }
};

export const MY_CONFLICT_STATUS = {
  IMPACTED: 'IMPACTED',
  PINNED: 'PINNED',
  UNPINNED: 'UNPINNED'
};

export const CONFLICTS_VALUES = {
  OPENED: { label: <IntlMessage id="component.conflict.manager.tab.openRisk" />, value: 0 },
  RESOLVED: { label: <IntlMessage id="component.conflict.manager.tab.resolvedRisk" />, value: 0 },
  CANCELLED: { label: <IntlMessage id="component.conflict.manager.tab.cancelledRisk" />, value: 0 }
};

export const BILLING_STATUS_COLOURS = {
  RED: '#D92D20',
  MUSTARD: '#F79009',
  BLUE_BASE: '#3e79f7'
};
export const DEPENDENCY_TYPE = {
  STAGE: { key: 'STAGE', value: 'stage' },
  SUB_STAGE: { key: 'SUB_STAGE', value: 'substage' }
};

export const PROJECT_SUBSTAGE_KEYS = {
  subStageName: 'subStageName',
  subStageOutlook: 'subStageOutlook',
  subStageRange: 'subStageRange'
};

export const PROJECT_STAGE_KEYS = {
  outlook: 'outlook'
};

export const HELP_TYPE = {
  FAQ: { key: 'FAQ' },
  CONTACT_SUPPORT: { key: 'CONTACT_SUPPORT' }
};

export const PROJECT_ID_KEY = 'projectId';

export const PROJECT_TIMELINE_TYPE = {
  task: 'task',
  project: 'project'
};
