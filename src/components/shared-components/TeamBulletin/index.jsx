import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  List, Input, Button, Spin, notification, Row, Col, Avatar, Menu
} from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Card } from 'components/shared-components/Card';
import ResourceService from 'services/ResourceService';
import { DATE_FORMAT_MM_DD_YYYY_WITH_SLASH, DAY_TIME_DD_HH_MM } from 'constants/DateConstant';
import {
  TeamBulletinIcon, plusIcon, recursive, trashBin
} from 'assets/svg/icon';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import InfiniteScroll from 'react-infinite-scroll-component';
import useFirstRender from 'utils/hooks/useFirstRender';
import { UserOutlined } from '@ant-design/icons';
import './index.css';

const { TextArea } = Input;

const TeamBulletin = ({ showMessageComposer, teamId, userId }) => {
  const [showMessageField, setShowMessageField] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [teamBulletinData, setTeamBulletinData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const isFirstRender = useFirstRender();

  const loadInitialRecord = async (page, callback) => {
    const {
      data: { content = [], totalElements } = {}
    } = await ResourceService.getTeamBulletinData(page, 100, teamId);
    const updatedBulletins = [...(page === 0 ? [] : teamBulletinData), ...content];
    setTeamBulletinData(updatedBulletins);
    setHasMore(updatedBulletins.length < totalElements);

    if (callback) {
      callback();
    }
  };

  const patchData = async (id) => {
    try {
      await ResourceService.patchTeamBulletinData(id, true);
      loadInitialRecord(0);
    } catch (e) {
      notification(e.message);
    }
  };

  const seenMessageClickHandler = (teamBulletinsId) => {
    if (!showMessageComposer) {
      patchData(teamBulletinsId);
    }
  };

  useEffect(() => {
    const fetchDataInterval = setInterval(() => setRefresh(true), 6000);
    return () => clearInterval(fetchDataInterval);
  }, []);

  useEffect(() => {
    if (isFirstRender || currentPage > 0) {
      loadInitialRecord(currentPage);
    }
  }, [currentPage]);

  useEffect(() => {
    if (refresh) {
      loadInitialRecord(0, () => {
        setRefresh(false);
        setCurrentPage(0);
      });
    }
  }, [refresh]);

  const onMessageSend = async () => {
    setLoading(true);
    await ResourceService.sendTeamBulletin({ message, teamId });
    setMessage('');
    setShowMessageField(false);
    setLoading(false);
  };

  const setMessagesClass = (seen) => ((!seen) ? 'unseen-message fw-semibold cursor-pointer' : 'seen-message fw-normal');

  const removeBulletinHandler = async (messageId) => {
    await ResourceService.deleteTeamBulletinMessage(messageId);
    loadInitialRecord(currentPage);
  };

  const handleAction = async (id, messageId, messageText, tId) => {
    if (id === 'delete') removeBulletinHandler(messageId);
    else {
      setLoading(true);
      await ResourceService.sendTeamBulletin({ message: messageText, teamId: tId });
      setRefresh(true);
      setMessage('');
      setLoading(false);
    }
  };

  return (
    <Card
      customizedHeader={(
        <div className="d-flex justify-content-between">
          <div className="d-flex">
            <TeamBulletinIcon />
            <div className="team-bulletin-heading">
              {t('component.general.user.project.team.bulletin.title')}
            </div>
          </div>
          {showMessageComposer && (
          <div className="d-flex">
            <Button
              className="add-new-bulleting-btn"
              size="small"
              icon={plusIcon()}
              onClick={() => setShowMessageField(true)}
              type="primary">
              {t('component.resource.team.button.text.addNewBulletin')}
            </Button>
          </div>
          )}
        </div>
      )}
      description={!showMessageComposer ? t('component.general.user.project.status.widget.details') : ''}
      showBorder>
      <div
        id="scrollableDiv"
        className="bulletin-list-scrollable d-flex flex-column">
        <InfiniteScroll
          dataLength={teamBulletinData?.length}
          next={() => setCurrentPage(currentPage + 1)}
          className="infinite-scroll-container"
          style={{
            height: showMessageField ? '235px' : '300px'
          }}
          inverse
          hasMore={hasMore}
          loader={(
            <div className="d-flex justify-content-center align-items-center center-loading">
              <Spin />
            </div>
            )}
          scrollableTarget="scrollableDiv">
          {
              teamBulletinData?.map(({
                id, seen, message: messageText,
                senderName, createDate,
                senderId,
                id: messageId
              }) => (
                <List.Item key={id}>
                  <div role="presentation" className="content-width">
                    <Row gutter={24} className="d-flex justify-content-between">
                      <Col span={21} className={`${setMessagesClass(seen)} d-flex flex-row`} onClick={() => seenMessageClickHandler(id)}>
                        <Col span={2}>
                          <span className={`${setMessagesClass(seen)}`}>
                            <Avatar className="mr-3" icon={<UserOutlined />} />
                          </span>
                        </Col>
                        <Col span={21} className="d-flex flex-column px-3">
                          <span className="date-time-format">
                            {senderName}
                            <span className="px-2">{moment(createDate).format(DAY_TIME_DD_HH_MM)}</span>
                          </span>
                          <span>
                            {messageText}
                          </span>
                        </Col>
                      </Col>
                      <Col span={3}>
                        <div className="d-flex justify-content-between flex-column">
                          <div className="date-time-format">
                            {moment(createDate).format(DATE_FORMAT_MM_DD_YYYY_WITH_SLASH)}
                          </div>
                          <div>
                            {showMessageComposer && userId === senderId && (
                              <EllipsisDropdown
                                color="#3E79F7"
                                menu={(
                                  <Menu
                                    onClick={({ key }) => {
                                      handleAction(key, messageId, messageText, teamId);
                                    }}>
                                    <Menu.Item key="delete" icon={trashBin()}>{t('component.card.details.button.delete')}</Menu.Item>
                                    <Menu.Item key="resend" icon={recursive()}>{t('component.button.resend')}</Menu.Item>
                                  </Menu>
                                )} />
                            )}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </List.Item>
              ))
            }
        </InfiniteScroll>
        {
            (showMessageComposer && showMessageField) && (
              <div className="text-area-field-container">
                <TextArea
                  value={message}
                  placeholder={t('component.billing.textArea.placeholder')}
                  allowClear
                  rows={1}
                  onChange={(e) => setMessage(e.target.value)} />
                <Button disabled={loading || message === ''} onClick={onMessageSend} size="small" className="mt-2 float-right">{t('component.resource.manager.team.bulletin.send')}</Button>
              </div>
            )
          }
      </div>
    </Card>
  );
};

TeamBulletin.defaultProps = {
  showMessageComposer: false,
  teamId: '',
  userId: ''
};

TeamBulletin.propTypes = {
  showMessageComposer: PropTypes.bool,
  teamId: PropTypes.string,
  userId: PropTypes.string
};

export default TeamBulletin;
