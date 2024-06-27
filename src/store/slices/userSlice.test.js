import store from '../index';
import { setInitialData, showLoading } from './userSlice';

describe('User Slice', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show the initial state for user', () => {
    const state = store.getState().user;
    expect(state).toStrictEqual({
      loading: false,
      users: [],
      privileges: {},
      message: '',
      showMessage: false,
      status: '',
      isFormVisible: false,
      filter: {
        pageNumber: 1,
        pageSize: 10
      }
    });
    expect(state).toMatchSnapshot();
  });

  it('should set the initial data for user after login', () => {
    store.dispatch(
      setInitialData({
        user: {
          email: 'test@gmail.com'
        }
      })
    );
    const state = store.getState().user;

    expect(state).toStrictEqual({
      loading: false,
      users: [],
      privileges: {},
      message: '',
      showMessage: false,
      status: '',
      user: {
        email: 'test@gmail.com'
      },
      isFormVisible: false,
      filter: {
        pageNumber: 1,
        pageSize: 10
      }
    });
    expect(state).toMatchSnapshot();
  });

  it('should call show loading action', () => {
    store.dispatch(
      showLoading({
        loading: true
      })
    );

    const state = store.getState().user;
    expect(state.loading).toBe(true);
    expect(state).toMatchSnapshot();
  });
});
