import { UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Form, Input, message, Upload
} from 'antd';
import Modal from 'components/shared-components/Modal';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

const uploadProps = (t) => ({
  name: 'file',
  action: '',
  headers: {
    authorization: 'authorization-text',
    accept: '.doc,.docx,.xml,.png,.jpeg'
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      // Implement later upon client approval
    }
    if (info.file.status === 'done') {
      message.success(t('component.project.history.fileUploaded.success', { fileName: info.file.name }));
    } else if (info.file.status === 'error') {
      message.error(t('component.project.history.fileUploaded.failure', { fileName: info.file.name }));
    }
  }
});

const ProjectNotes = ({
  showProjectNotesModal, setShowProjectNotesModal,
  addNewNote
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const formWatch = Form.useWatch('description', form);
  const onCancel = () => {
    setShowProjectNotesModal(false);
  };
  const onOk = () => {
    form
      .validateFields()
      .then((values) => {
        const newNote = {
          ...values,
          date: moment(new Date()).format('MM/DD/YYYY h:mm A')
        };
        addNewNote(newNote);
      });
    setShowProjectNotesModal(false);
  };

  return (
    <Modal
      data-i="project-notes-modal"
      title={t('component.project.manager.ProjectNotes')}
      open={showProjectNotesModal}
      onCancel={onCancel}
      confirmOnCancel={formWatch?.length > 0}
      onOk={onOk}
      okButtonProps={{ disabled: !formWatch?.length }}
      okText={t('component.common.save.label')}>
      <Form
        form={form}
        onFinish={onOk}
        layout="vertical"
        name="project-notes-form"
        data-i="project-notes-form">
        <Form.Item
          data-i="description"
          name="description"
          label={t('component.project.manager.addProjectNotes')}
          rules={[
            {
              required: true,
              message: t('component.project.history.notes.required')
            }
          ]}>
          <Input.TextArea
            data-i="form-item-stageName-inputField"
            allowClear
            placeholder={t('component.project.history.notes.placeholder')} />
        </Form.Item>

      </Form>
      <Upload {...uploadProps(t)}>
        <Button icon={<UploadOutlined />}>
          {t('component.project.manager.attachProjectDocuments')}
        </Button>
      </Upload>
    </Modal>
  );
};

export default ProjectNotes;
