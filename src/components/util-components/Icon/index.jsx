import React, { PureComponent } from 'react';

export class Icon extends PureComponent {
  render() {
    const { type, className } = this.props;
    return <>{React.createElement(type, { className })}</>;
  }
}

export default Icon;
