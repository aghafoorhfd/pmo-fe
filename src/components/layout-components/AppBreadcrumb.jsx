import React, { PureComponent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import navigationConfig from 'configs/NavigationConfig';
import IntlMessage from 'components/util-components/IntlMessage';

const breadcrumbData = {
  '/app': <IntlMessage id="home" />
};

navigationConfig.forEach((elm) => {
  // eslint-disable-next-line no-return-assign
  const assignBreadcrumb = (obj) => (breadcrumbData[obj.path] = <IntlMessage id={obj.title} />);
  assignBreadcrumb(elm);
  if (elm.submenu) {
    elm.submenu.forEach((elmParam) => {
      assignBreadcrumb(elmParam);
      if (elmParam.submenu) {
        elm.submenu.forEach((element) => {
          assignBreadcrumb(element);
        });
      }
    });
  }
});

function BreadcrumbRoute() {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter((i) => i);
  const buildBreadcrumb = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>{breadcrumbData[url]}</Link>
      </Breadcrumb.Item>
    );
  });

  return <Breadcrumb>{buildBreadcrumb}</Breadcrumb>;
}

export class AppBreadcrumb extends PureComponent {
  render() {
    return <BreadcrumbRoute />;
  }
}

export default AppBreadcrumb;
