import {
  Button, Col, Tooltip, Typography
} from 'antd';
import { EditIcon } from 'assets/svg/icon';
import { useTranslation } from 'react-i18next';
import { DESIGNATION_TYPES } from 'constants/MiscConstant';
import '../Styles.css';

export const TableColumns = (setSelectedTeam, showModal, isAdmin) => {
  const { t } = useTranslation();
  const { Paragraph } = Typography;
  const handleEditRow = (e, record) => {
    e.stopPropagation();
    setSelectedTeam(record);
    showModal();
  };
  const columnToolTip = (text) => {
    const charactersThreshold = 57;
    if (text?.length > charactersThreshold) {
      return (
        <Tooltip placement="top" title={text}>
          <Paragraph ellipsis>{text}</Paragraph>
        </Tooltip>
      );
    }
    return (
      <Paragraph>{text}</Paragraph>
    );
  };

  return ([
    {
      title: t('component.resource.team.table.column.teamName'),
      dataIndex: 'teamName',
      key: 'teamName',
      width: 130
    },
    {
      title: t('component.resource.team.table.column.description'),
      dataIndex: 'description',
      key: 'description',
      width: 200,
      render: (text) => columnToolTip(text)
    },
    {
      title: t('component.resource.team.table.column.assignedResources'),
      dataIndex: 'resources',
      key: 'resources',
      width: 130,
      render: (text) => text.length
    },
    {
      title: t('component.resource.team.form.resourceManager1'),
      dataIndex: ['resourceManager', 'resourceManagerEmail'],
      key: 'resources',
      width: 170,
      render: (text, row) => {
        const resourceManager = row.resources.filter(
          (value) => value.designation === DESIGNATION_TYPES.RESOURCE_MANAGER.key
            && value.primaryResourceManager
        )[0];
        return resourceManager ? (
          <span>
            {`${resourceManager?.firstName} ${resourceManager?.lastName}`}
            <br />
            <small>{resourceManager?.email}</small>
          </span>
        ) : t('component.common.notAvailable');
      }
    },
    {
      title: t('component.resource.team.form.resourceManager2'),
      dataIndex: ['resourceManager', 'resourceManagerEmail'],
      key: 'resources',
      width: 170,
      render: (text, row) => {
        const resourceManager = row.resources.filter(
          (value) => value.designation === DESIGNATION_TYPES.RESOURCE_MANAGER.key
            && !value.primaryResourceManager
        )[0];
        return resourceManager ? (
          <span>
            {`${resourceManager?.firstName} ${resourceManager?.lastName}`}
            <br />
            <small>{resourceManager?.email}</small>
          </span>
        ) : t('component.common.notAvailable');
      }
    },
    {
      title: t('component.table.column.action'),
      align: 'center',
      dataIndex: 'edit',
      key: 'edit',
      width: 80,
      render: (text, record, index) => (
        <Col
          id={`resource-team-edit-button-${index + 1}`}
          className="d-flex justify-content-center">
          <Button
            className="p-0"
            disabled={!isAdmin}
            type="link"
            icon={<EditIcon />}
            onClick={(e) => {
              handleEditRow(e, record);
            }} />
        </Col>
      )
    },
    {
      dataIndex: 'empty',
      key: 'empty',
      width: 0.1
    }]
  );
};
