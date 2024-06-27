import { Col, Row, notification } from 'antd';
// import Loading from 'components/shared-components/Loading';
// import {
//   projectNotes as projectNotesData
// } from 'mock/data/projectHistory';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Card } from 'components/shared-components/Card';
import { getProjectHistoryDetail, hideMessage } from 'store/slices/riskManagementSlice';
import { initialPaginationConfiguration } from 'constants/MiscConstant';
import DataTable from 'components/shared-components/DataTable';
import { useSearchParams } from 'react-router-dom';
import ProjectStatisticWidget from '../ProjectStatisticsWidget';
import { projectHistoryColumnConfig } from './ProjectHistoryColumnConfig';
import './index.css';

/*
  TODOS:
  * Commenting out the porject notes feature.
  * Will be un-commenting it once we get the API's from the backend, and gets the
    S3 bucket form Client, then we will be able to Upload the documents on S3.
*/

// const AddProjectNotes = React.lazy(() =>
// import('views/app-views/dashboards/project-manager/project-history/ProjectNotes/index')
// );

// const NoteItem = ({ item: { name, description, date } }) => (
//   <Comment
//     author={name}
//     content={(
//       <p>{description}</p>
//     )}
//     datetime={(
//       <Tooltip title={date}>
//         <span>{date}</span>
//       </Tooltip>
//     )} />
// );

const ProjectHistory = () => {
  const {
    riskManagement: {
      projectHistory: { content = [], totalElements = 0 },
      loading,
      showMessage,
      message,
      status
    },
    projectDetails: {
      selectedProjectDetails: {
        id: pID
      }
    }
    // auth: {
    //   userProfile: { firstName, lastName }
    // }
  } = useSelector(({ riskManagement, auth, projectDetails }) => ({
    riskManagement,
    auth,
    projectDetails
  }));
  const [pagination, setPagination] = useState(initialPaginationConfiguration);
  const dispatch = useDispatch();
  // const [showProjectNotesModal, setShowProjectNotesModal] = useState(false);
  // const [projectNotes, setProjectNotes] = useState(projectNotesData);
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');

  useEffect(() => {
    if (showMessage) {
      notification[status]({ message });
      dispatch(hideMessage());
    }
  }, [showMessage]);

  // const addNewNote = (note) => {
  //   setProjectNotes((pre) => ([...pre,
  //     { ...note, name: `${firstName} ${lastName}`, id: pre.length + 1 }]));
  // };

  const getProjectHistory = () => {
    const { page, pageSize } = initialPaginationConfiguration;
    setPagination({ page, pageSize });
    dispatch(getProjectHistoryDetail({ projectId, page: page - 1, pageSize }));
  };

  useEffect(() => {
    if (pID === projectId) {
      getProjectHistory();
    }
  }, [pID, projectId]);

  const onProjectChange = (pId) => {
    setSearchParams({ projectId: pId });
  };

  const handlePaginationChange = (pageOptions) => {
    const { current: page, pageSize } = pageOptions;
    setPagination({ page, pageSize });
    dispatch(getProjectHistoryDetail({
      projectId,
      page: page - 1,
      pageSize
    }));
  };

  return (
    <>
      <ProjectStatisticWidget
        projectId={projectId}
        isProjectSelectable
        onProjectSelection={onProjectChange} />
      {/* {projectId
        ? (
          <Row gutter={[16, 16]}>
            <Col lg={24} md={24} xs={24}>
              <Card title={t('component.project.manager.ProjectNotes')} data-i="projectNotesCard">
                {projectNotes?.map((note) => <NoteItem key={note?.id} item={note} />)}
              </Card>
              <Row justify="end">
                <Button onClick={() => setShowProjectNotesModal(true)} data-i="addNotesButton">
                  {t('component.project.manager.addProjectNotes')}
                </Button>
              </Row>
            </Col>
          </Row>
        ) : <Empty />} */}
      <Row gutter={[16, 16]}>
        <Col lg={24} md={24} xs={24} className="mt-4">
          <Card title={t('component.project.manager.project.change.history')}>
            <DataTable
              id="projectId"
              className="table-border-equal"
              data={content}
              handleChange={handlePaginationChange}
              bordered
              loading={loading}
              currentPage={pagination.page}
              pageSize={pagination.pageSize}
              totalElements={totalElements}
              showPagination
              columns={projectHistoryColumnConfig()} />
          </Card>
        </Col>
      </Row>
      {/* {showProjectNotesModal && (
        <Suspense fallback={<Loading cover="content" />}>
          <AddProjectNotes
            setShowProjectNotesModal={setShowProjectNotesModal}
            showProjectNotesModal={showProjectNotesModal}
            addNewNote={addNewNote} />
        </Suspense>
      )} */}
    </>
  );
};

export default ProjectHistory;
