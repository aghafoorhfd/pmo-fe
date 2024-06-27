import { useTranslation } from 'react-i18next';

export const resourceManagerDashboardColumns = () => {
  const { t } = useTranslation();
  return (
    [
      {
        key: 'teamName',
        dataIndex: 'teamName',
        title: t('component.resource.team.table.column.teamName'),
        width: 130
      },
      {
        key: 'description',
        dataIndex: 'description',
        title: t('component.resource.team.table.column.description'),
        width: 140
      },
      {
        align: 'center',
        key: 'assignedResources',
        dataIndex: 'assignedResources',
        title: t('component.resource.team.table.column.assignedResources'),
        width: 90
      },
      {
        key: 'resourceManager',
        dataIndex: 'resourceManager',
        title: t('component.resource.team.table.column.resourceManager'),
        width: 130
      },
      {
        key: 'teamLead',
        dataIndex: 'teamLead',
        title: t('component.resource.team.table.column.teamLead'),
        width: 130
      }
    ]
  );
};
