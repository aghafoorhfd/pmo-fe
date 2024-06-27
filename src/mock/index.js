import { createServer } from 'miragejs';
import { AUTH_SERVICE_BASE_URL } from '../constants/ApiConstant';

import { signInUserData } from './data/authData';

import { authFakeApi } from './fakeApi';

export default function mockServer({ environment = 'test' }) {
  return createServer({
    environment,
    seeds(server) {
      server.db.loadData({
        signInUserData
      });
    },
    routes() {
      this.urlPrefix = '';
      this.namespace = '';
      this.passthrough((request) => {
        const isExternal = request.url.startsWith('http');
        return isExternal;
      });
      this.passthrough();

      authFakeApi(this, AUTH_SERVICE_BASE_URL);
    }
  });
}
