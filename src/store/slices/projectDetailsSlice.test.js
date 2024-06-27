import store from '../index';

describe('Project Details Slice', () => {
  it('should show the initial state for projectDetails', () => {
    const state = store.getState().projectDetails;
    expect(state).toStrictEqual({
      loading: false,
      message: '',
      showMessage: false,
      configurationMetrics: {},
      generalUsers: [],
      status: 'success',
      projectList: [],
      selectedProjectDetails: ''
    });
    expect(state).toMatchSnapshot();
  });
});
