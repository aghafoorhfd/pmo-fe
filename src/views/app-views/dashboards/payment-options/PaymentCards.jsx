import React from 'react';
import { Radio, Card, Menu } from 'antd';
import { DeleteFilled, CheckCircleOutlined } from '@ant-design/icons';
import { capitalize, sortBy } from 'lodash';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  getCardIcon
} from 'utils/utils';

const PaymentCards = ({
  cards,
  loading,
  setDeleteModal,
  setAsDefault
}) => {
  const { t } = useTranslation();
  return (
    <div>
      {sortBy(cards, (item) => !item.defaultCard)?.map((card, index) => (
        <Card key={card.cardId} bordered={card.defaultCard}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <Radio name="cards" value={card.cardId} />
              <img width={50} height={50} src={getCardIcon(card.cardType)} alt={`${card.cardType} Logo`} className="mr-2" />
              <div className="d-flex flex-column">
                <div className="d-flex">
                  <span className="font-weight-bold">
                    {capitalize(card.cardType)}
                  </span>
                  <span className="mx-1">
                    {t('component.common.asteriks')}
                  </span>
                  <span>
                    {card.cardLastFourDigit}
                  </span>
                  <span
                    className={`ml-2 ${card.defaultCard ? 'default-card' : ''}`}>
                    {card.defaultCard && t('component.card.details.default.label')}
                  </span>
                </div>
                <div>
                  <span className="mr-2">{t('component.card.details.expires.label')}</span>
                  {card.expiryMonth}
                  /
                  {card.expiryYear}
                </div>
              </div>
            </div>
            <div>
              <EllipsisDropdown
                menu={(
                  <Menu disabled={loading}>
                    <Menu.Item
                      key="delete"
                      icon={<DeleteFilled />}
                      onClick={() => setDeleteModal({ cardId: card.cardId, show: true })}
                      id={`card-delete-button-${index + 1}`}>
                      {t('component.card.details.button.delete')}
                    </Menu.Item>
                    <Menu.Item
                      key="setAsDefault"
                      icon={(
                        <CheckCircleOutlined
                          className={card.defaultCard ? 'set-as-default-icon' : ''} />
                          )}
                      onClick={() => setAsDefault({ cardId: card.cardId })}
                      disabled={card.defaultCard}
                      id={`card-default-button-${index + 1}`}>
                      {t('component.card.details.button.setAsDefault')}
                    </Menu.Item>
                  </Menu>
        )} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
PaymentCards.propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      cardId: PropTypes.string,
      cardType: PropTypes.string,
      cardLastFourDigit: PropTypes.string,
      defaultCard: PropTypes.bool,
      expiryMonth: PropTypes.number,
      expiryYear: PropTypes.number
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  setDeleteModal: PropTypes.func.isRequired,
  setAsDefault: PropTypes.func.isRequired
};

export default PaymentCards;
