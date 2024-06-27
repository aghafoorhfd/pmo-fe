import React from 'react';
import { CheckOutlined, GlobalOutlined, DownOutlined } from '@ant-design/icons';
import { Menu, Dropdown } from 'antd';
import lang from 'assets/data/language.data.json';
import { useSelector, useDispatch } from 'react-redux';
import { onLocaleChange } from 'store/slices/themeSlice';
import i18n from 'i18next';

function getLanguageDetail(locale) {
  const data = lang.filter((elm) => elm.langId === locale);
  return data[0];
}

function SelectedLanguage() {
  const locale = useSelector((state) => state.theme.locale);

  const language = getLanguageDetail(locale);
  const { langName, icon } = language;

  return (
    <div className="d-flex align-items-center">
      <img alt={langName} src={`/img/flags/${icon}.png`} style={{ maxWidth: '20px' }} />
      <span className="font-weight-semibold ml-2">
        {langName}
        {' '}
        <DownOutlined className="font-size-xs" />
      </span>
    </div>
  );
}

function MenuItem(props) {
  const locale = useSelector((state) => state.theme.locale);

  const dispatch = useDispatch();

  const handleLocaleChange = (langId) => {
    dispatch(onLocaleChange(langId));
    i18n.changeLanguage(langId);
  };

  return (
    <span
      className="d-flex justify-content-between align-items-center"
      onClick={() => handleLocaleChange(props.langId)}
      role="presentation">
      <div>
        <img
          alt={props.langName}
          src={`/img/flags/${props.icon}.png`}
          style={{ maxWidth: '20px' }} />
        <span className="font-weight-normal ml-2">{props.langName}</span>
      </div>
      {locale === props.langId ? <CheckOutlined className="text-success" /> : null}
    </span>
  );
}

const menu = (
  <Menu
    items={[
      {
        key: 'En',
        label: <MenuItem icon="us" langId="en" langName="English" />
      },
      {
        key: 'Ch',
        label: <MenuItem icon="cn" langId="zh" langName="Chinese" />
      },
      {
        key: 'Fr',
        label: <MenuItem icon="fr" langId="fr" langName="French" />
      },
      {
        key: 'Jp',
        label: <MenuItem icon="jp" langId="ja" langName="Janpanese" />
      }
    ]} />
);

export function NavLanguage({ configDisplay }) {
  return (
    <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
      {configDisplay ? (
        <a className="text-gray" href="#/" aria-label="language-selection" onClick={(e) => e.preventDefault()}>
          <SelectedLanguage />
        </a>
      ) : (
        <div className="nav-item">
          <GlobalOutlined className="nav-icon mr-0" />
        </div>
      )}
    </Dropdown>
  );
}

export default NavLanguage;
