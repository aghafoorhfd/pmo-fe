import i18n from 'i18next';

const { t } = i18n;

export const USER_FORM_ACCESSTYPE = [
  {
    value: 'ADMIN',
    label: t('component.constant.dropDownOptions.admin')
  },
  {
    value: 'PROJECT_MANAGER',
    label: t('component.constant.dropDownOptions.projectManager')
  },
  {
    value: 'RESOURCE_MANAGER',
    label: t('component.constant.dropDownOptions.resourceManager')
  },
  {
    value: 'GENERAL_USER',
    label: t('component.constant.dropDownOptions.generalUser')
  }
  // Commenting the EXECUTIVE role for now It will be visible in future
  // {
  //   value: 'EXECUTIVE',
  //   label: t('component.constant.dropDownOptions.executive')
  // }
];

export const RESOURCE_CAPACITY_OPTIONS = [
  {
    value: 100,
    label: '100%'
  },
  {
    value: 50,
    label: '50%'
  }
];

export const TABLE_ROWS = ['10', '20', '50', '100'];

export const BILLING_CYCLE_OPTIONS = [
  { label: t('component.product.admin.monthly'), value: 'Monthly' },
  { label: t('component.product.admin.yearly'), value: 'Yearly' },
  { label: t('component.pricing.package.type.freemium'), value: 'Free' }
];

export const PLAN_TYPE_OPTIONS = [
  { label: t('component.analytics.dropDown.web'), value: 'WEB' },
  { label: t('component.analytics.dropDown.b2b'), value: 'B2B' }
];

export const STATUS_OPTIONS = [
  { label: t('component.analytics.dropDown.active'), value: 'ACTIVE' },
  { label: t('component.analytics.dropDown.inActive'), value: 'IN_ACTIVE' }
];

export const JIRA_WORK_TYPE = [
  { label: t('component.jira.dropDown.userStory'), value: 'USER_STORY' },
  { label: t('component.jira.dropDown.epic'), value: 'EPIC' },
  { label: t('component.jira.dropDown.initiative'), value: 'INITIATIVE' }

];
