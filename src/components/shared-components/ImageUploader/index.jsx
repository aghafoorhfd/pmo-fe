import {
  Upload, Select
} from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { noop } from 'lodash';
import './index.css';

function ImageUploader({
  description, name, isTeamSelectable, onTeamSelection, teamList, selectedTeamId
}) {
  const { t } = useTranslation();
  const uploadButton = (
    <div>
      <PlusOutlined />
    </div>
  );

  return (
    <div className="d-flex image-uploader-container">
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        style={{ height: '20px' }}
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76">
        {uploadButton}
      </Upload>
      <div className="d-flex flex-column flex-grow-1">

        {isTeamSelectable
          ? (
            <Select
              value={selectedTeamId}
              size="small"
              showSearch
              allowClear={false}
              className="w-25"
              filterOption={(input, option) => (option?.label ?? '').includes(input)
              || option?.label?.toLowerCase().indexOf(input?.toLowerCase()) >= 0}
              options={teamList}
              onChange={onTeamSelection}
              placeholder={t('component.resource.manager.resource.commitment.team.placeholder')} />
          )
          : name && <span className="text-tertiary font-size-md font-weight-semibold">{name}</span>}

        {description && <span className="text-tertiary font-size-md description mt-1">{description}</span>}
      </div>
    </div>

  );
}

ImageUploader.propTypes = {
  description: PropTypes.string,
  name: PropTypes.string,
  isTeamSelectable: PropTypes.bool,
  onTeamSelection: PropTypes.func,
  teamList: PropTypes.arrayOf(PropTypes.objectOf)
};

ImageUploader.defaultProps = {
  description: '',
  name: '',
  isTeamSelectable: false,
  onTeamSelection: noop,
  teamList: []
};

export default ImageUploader;
