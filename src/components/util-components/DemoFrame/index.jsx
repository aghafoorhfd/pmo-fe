import React from 'react';
import Frame from 'react-frame-component';

function DemoFrame({ height, className, children }) {
  return (
    <Frame
      head={<link href="/css/light-theme.css" rel="stylesheet" type="text/css" />}
      style={{ height: `${height || '200px'}` }}>
      <div className={className}>{children}</div>
    </Frame>
  );
}

export default DemoFrame;
