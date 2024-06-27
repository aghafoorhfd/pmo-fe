export const packageConfigMap = {
  Free: {
    color: '#3e79f7',
    shortInfo: 'component.pricing.package.info.freemium',
    description: 'component.pricing.package.description.freemium',
    trialButton: 'component.pricing.package.button.freemium',
    startButton: 'component.pricing.package.button.common'
  },
  Standard: {
    color: '#04d182',
    shortInfo: 'component.pricing.package.info.premium',
    description: 'component.pricing.package.description.month.common',
    yearlyDescription: 'component.pricing.package.description.year.common',
    trialButton: 'component.pricing.package.button.freemium',
    startButton: 'component.pricing.package.button.common'
  },
  Premium: {
    yearlyDescription: 'component.pricing.package.description.year.common',
    color: '#a0d911',
    shortInfo: 'component.pricing.package.info.executive',
    description: 'component.pricing.package.description.month.common',
    trialButton: 'component.pricing.package.button.freemium',
    startButton: 'component.pricing.package.button.common'
  },
  Gold: {
    yearlyDescription: 'component.pricing.package.description.year.common',
    color: '#ff6b72',
    shortInfo: 'component.pricing.package.info.business',
    description: 'component.pricing.package.description.month.common',
    trialButton: 'component.pricing.package.button.freemium',
    startButton: 'component.pricing.package.button.common'
  },
  Enterprise: {
    color: '#eb2f96',
    shortInfo: 'component.pricing.package.info.enterprise',
    description: 'component.pricing.package.description.month.common',
    trialButton: 'component.pricing.package.button.enterprise',
    startButton: 'component.pricing.package.button.enterprise',
    yearlyDescription: 'component.pricing.package.description.year.common'
  }
};

export const enterprisePackage = {
  id: '527e38c3-e320-4232-bb57-d7a8fdacxzas',
  name: 'Enterprise',
  currency: 'USD',
  isEnterprise: true,
  features: [{ name: 'component.analytics.table.column.features.budgetManager' }, { name: 'component.analytics.table.column.features.quarterlyPlanner' }, { name: 'component.analytics.table.column.features.corporateProfileManager' }, { name: 'component.pricing.package.benefits.okrm' }, { name: 'component.analytics.table.column.features.projectManager' }, { name: 'component.analytics.table.column.features.confluenceIntegration' }, { name: 'component.analytics.table.column.features.rallyIntegration' }, { name: 'component.analytics.table.column.features.conflictManager' }, { name: 'component.analytics.table.column.features.executiveDashboard' }, { name: 'component.analytics.table.column.features.resourceManager' }, { name: 'component.analytics.table.column.features.jiraIntegration' }]
};

export const PlanType = {
  FREE: 'free',
  ENTERPRISE: 'enterprise',
  GOLD: 'gold',
  PREMIUM: 'premium',
  STANDARD: 'standard'
};

export const B2BProductId = 'c0639b6f-1677-4b7f-b021-49a0590e3ff1';

export const B2BMonthlyPackage = {
  'f42a9433-d097-4e72-801f-38968d72a662': [
    {
      minUsers: '1',
      maxUsers: '20',
      discountPerc: '0'
    }
  ]
};

export const B2BYearlyPackage = {
  'f42a9433-d097-4e72-801f-38968d72a663': [
    {
      minUsers: '1',
      maxUsers: '20',
      discountPerc: '0'
    }
  ]
};
