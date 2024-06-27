import { useTranslation } from 'react-i18next';

export const TableColumns = () => {
  const { t } = useTranslation();
  return [
    {
      title: t('component.resource.team.description.label.teamName'),
      dataIndex: 'teamName',
      key: 'teamName'
    },
    {
      title: t('component.admin.billing.dashboard.activeUsers.input.label'),
      dataIndex: 'resources',
      key: 'resources',
      render: (text) => text.length
    }
  ];
};
