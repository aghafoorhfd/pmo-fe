import React from 'react';
import { useTranslation } from 'react-i18next';

function IntlMessage({ id, fallback, inline = false }) {
  const { t } = useTranslation();

  const translate = t(id, fallback);

  return <div style={{ display: inline ? 'inline' : 'block' }}>{translate}</div>;
}

export default IntlMessage;
