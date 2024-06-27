import {
  Divider
} from 'antd';
import { Card } from 'components/shared-components/Card';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import React, { memo, useMemo } from 'react';
import './index.css';
import { noop } from 'lodash';
import { getName, phoneFormat } from 'utils/utils';
import ImageUploader from '../ImageUploader';

const ProfileDetail = ({
  dataId, id, description, name, resourceManagers, teamLeads, overview,
  isTeamSelectable, onTeamSelection, teamList, selectedTeamId, loading
}) => {
  const { t } = useTranslation();
  const renderResourceManagers = useMemo(() => {
    const { primaryResourceManager = [], secondaryResourceManager = [] } = resourceManagers
      ?.reduce((acc, curr) => ({
        ...acc,
        [curr.primaryResourceManager ? 'primaryResourceManager' : 'secondaryResourceManager']: [curr]
      }), {}) || {};

    return (
      [...primaryResourceManager, ...secondaryResourceManager].map(({
        firstName, lastName, email, phoneNumber
      }, index) => {
        const fName = firstName || '';
        const lName = lastName || '';
        return (
          <div className="mb-2" key={`resource-manager-${email}`}>
            <span className="text-tertiary font-size-md font-weight-semibold mr-2">
              {t(`component.resource.team.form.resourceManager${index + 1}`)}
              :
            </span>
            <span className="text-tertiary font-size-md mr-3 text-styles">{getName(fName, lName)}</span>
            <span className="text-tertiary font-size-md mr-3 text-styles">{email}</span>
            {
              phoneNumber && (
                <span className="text-tertiary font-size-md mr-5">{phoneFormat(phoneNumber)}</span>
              )
            }
          </div>
        );
      })
    );
  }, [resourceManagers]);

  return (
    <Card data-i={dataId} id={id} className="profile-detail-description" loading={loading}>
      <ImageUploader
        name={name}
        description={description}
        isTeamSelectable={isTeamSelectable}
        onTeamSelection={onTeamSelection}
        teamList={teamList}
        selectedTeamId={selectedTeamId} />
      <Divider className="m-0 mt-3" />
      <div className="d-flex flex-column profile-detail-header">

        {overview && (
          <div>
            <span className="text-tertiary font-size-md font-weight-semibold mr-2">
              {t('component.constant.label.overview')}
              :
              {' '}
            </span>
            <span className="text-tertiary font-size-md mr-5">{overview}</span>
          </div>
        )}
        {renderResourceManagers}
        {
          teamLeads.map(({
            firstName, lastName, email, phoneNumber
          }) => {
            const fName = firstName || '';
            const lName = lastName || '';
            return (
              <div key={`team-lead-${email}`} className="mt-2">
                <span className="text-tertiary font-size-md font-weight-semibold mr-2">
                  {t('component.constant.designations.teamLead')}
                  :
                </span>
                <span className="text-tertiary font-size-md mr-3 text-styles">{getName(fName, lName)}</span>
                <span className="text-tertiary font-size-md mr-3 text-styles">{email}</span>
                {
                  phoneNumber && (
                    <span className="text-tertiary font-size-md mr-5">{phoneFormat(phoneNumber)}</span>
                  )
                }
              </div>
            );
          })
        }
      </div>
    </Card>
  );
};

ProfileDetail.propTypes = {
  dataId: PropTypes.string,
  id: PropTypes.string,
  description: PropTypes.string,
  name: PropTypes.string,
  resourceManagers: PropTypes.arrayOf(PropTypes.objectOf),
  teamLeads: PropTypes.arrayOf(PropTypes.objectOf),
  overview: PropTypes.string,
  isTeamSelectable: PropTypes.bool,
  onTeamSelection: PropTypes.func,
  teamList: PropTypes.arrayOf(PropTypes.objectOf)
};

ProfileDetail.defaultProps = {
  dataId: '',
  id: '',
  description: '',
  name: '',
  resourceManagers: [],
  teamLeads: [],
  overview: '',
  isTeamSelectable: false,
  onTeamSelection: noop,
  teamList: []
};

export default memo(ProfileDetail);
