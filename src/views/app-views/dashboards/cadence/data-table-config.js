import i18n from 'i18next';

const { t } = i18n;

export const getQuartersDataTableColumns = (quartersNames = []) => {
  const sdlcColumns = [];
  for (let i = 0; i < 4; i++) {
    sdlcColumns.push({
      title: `${quartersNames[i]?.split(' ')[1] || ''} ${quartersNames[i]?.split(' ')[2] || ''}`,
      dataIndex: `quarter${i}`,
      key: `quarter${i}`,
      align: 'center'
    });
  }
  return sdlcColumns;
};

export const getSprintDataTableColumns = (sprints) => {
  const agileColumns = [];
  const sprintsLength = sprints?.length;

  if (sprintsLength) {
    const { name } = sprints[0] || {};
    const startSprint = Number(name?.split(' ')[1]);
    const sprintsToShow = Math.min(5, sprintsLength);
    for (let i = startSprint; i < (startSprint + sprintsToShow); i++) {
      agileColumns.push({
        title: `${t('component.cadence.sprint.title')} ${i}`,
        dataIndex: `sprint${i}`,
        key: `sprint${i}`,
        align: 'center'
      });
    }
  }
  return agileColumns;
};
