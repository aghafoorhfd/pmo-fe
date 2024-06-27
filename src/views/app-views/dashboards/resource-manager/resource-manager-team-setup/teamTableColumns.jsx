import { Col, Row } from 'antd';
import { EditIcon, RemoveIcon } from 'assets/svg/icon';
import { useTranslation } from 'react-i18next';
import { phoneFormat } from 'utils/utils';
import { DATE_FORMAT_MM_DD_YYYY } from 'constants/DateConstant';
import moment from 'moment';

export const resourceManagerTeamColumns = (editHandler, removeHandler) => {
  const { t } = useTranslation();
  return (
    [
      {
        title: t('component.resource.team.resourceName'),
        dataIndex: 'firstName',
        key: 'firstName',
        width: 120,
        render: (_, record) => {
          const fullName = `${record.firstName || ''} ${record.lastName || ''}`.trim();
          return (
            <span>
              {fullName}
            </span>
          );
        }
      },
      {
        key: 'email',
        dataIndex: 'email',
        title: t('component.resource.team.table.column.emailAddress'),
        width: 150
      },
      {
        key: 'phoneNumber',
        dataIndex: 'phoneNumber',
        title: t('component.resource.team.table.column.phone'),
        width: 120,
        render: (text) => phoneFormat(text)
      },
      {
        key: 'designation',
        dataIndex: 'designation',
        title: t('component.resource.team.resourceDiscipline'),
        width: 120,
        render: (value) => value || t('component.common.notAvailable')
      },
      {
        key: 'resourceCapacity',
        title: t('component.resource.team.resourceCapacity'),
        width: 120,
        render: (_, record) => t('component.resource.team.resourceCapacityHours', { hours: record?.resourceCapacity || 0 })
      },
      {
        key: 'billingRate',
        dataIndex: 'billingRate',
        title: t('component.resource.team.billingRate'),
        width: 120,
        render: (_, record) => record?.billingRate || t('component.common.notAvailable')
      },
      {
        key: 'plannedVacations',
        dataIndex: 'plannedVacations',
        title: t('component.resource.team.plannedVacationTime'),
        width: 200,
        render: (value) => {
          const plannedVacations = value ? value[value.length - 1] : {};
          const { startDate } = plannedVacations;
          const { endDate } = plannedVacations;
          if (startDate && endDate) {
            return (<span>{`${moment(startDate).format(DATE_FORMAT_MM_DD_YYYY)} - ${moment(endDate).format(DATE_FORMAT_MM_DD_YYYY)}`}</span>
            );
          }

          return t('component.common.notAvailable');
        }
      },
      {
        align: 'center',
        dataIndex: 'actions',
        title: t('component.table.column.actions'),
        key: 'actions',
        width: 120,
        render: (_, record, index) => (
          <Row align="middle" justify="center" wrap={false}>
            <Col
              className="mr-4 cursor-pointer"
              onClick={() => removeHandler(record)}
              id={`resource-remove-button-${index + 1}`}>
              <RemoveIcon />
            </Col>
            <Col
              onClick={() => editHandler(record)}
              id={`resource-edit-button-${index + 1}`}
              className="mr-4 cursor-pointer">
              <EditIcon />
            </Col>
          </Row>
        )
      }
    ]
  );
};
