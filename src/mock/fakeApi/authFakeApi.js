import { Response } from 'miragejs';
import uniqueId from 'lodash/uniqueId';
import isEmpty from 'lodash/isEmpty';
import { ROLES } from '../../constants/RolesConstant';

export default function authFakeApi(server, apiPrefix) {
  server.post(`${apiPrefix}/auth/login`, (schema, { requestBody }) => {
    const { email, password } = JSON.parse(requestBody);
    const user = schema.db.signInUserData.findBy({ email, password });
    if (user) {
      return {
        data: {
          token: 'wVYrxaeNa9OxdnULvde1Au5m5w63',
          user: { role: ROLES.ADMIN }
        }
      };
    }
    return new Response(
      401,
      { some: 'header' },
      { message: 'email: user1@themenate.net | password: 2005ipo' }
    );
  });

  server.post(`${apiPrefix}/auth/loginInOAuth`, () => ({
    data: {
      token: 'wVYrxaeNa9OxdnULvde1Au5m5w63',
      user: { role: ROLES.ADMIN }
    }
  }));

  server.get(`${apiPrefix}/user/privileges`, () => ({
    Admin: {
      title: 'Admin',
      visibility: true,
      subMenu: [
        {
          ProjectMetrics: {
            title: 'Project Metric',
            visibility: true,
            View: true,
            Edit: true,
            Add: true,
            Delete: true
          }
        },
        {
          Budget: {
            title: 'Budget',
            visibility: true,
            View: true,
            Edit: true,
            Add: true,
            Delete: true
          }
        }
      ]
    },
    ProjectManager: {
      title: 'Project Manager',
      visibility: true,
      subMenu: [
        {
          ProjectDetails: {
            title: 'Project Details',
            visibility: true,
            View: true,
            Edit: true,
            Add: true,
            Delete: true
          }
        },
        {
          ProjectTimeline: {
            title: 'Project Timeline',
            visibility: true,
            View: true,
            Edit: true,
            Add: true,
            Delete: true
          }
        }
      ]
    }
  }));

  server.post(`${apiPrefix}/logout`, () => true);

  server.post(`${apiPrefix}/auth/register`, (schema, { requestBody }) => {
    const { firstName, lastName, email } = JSON.parse(requestBody);
    const emailUsed = schema.db.signInUserData.findBy({ email });
    const userName = `${firstName} ${lastName}`;
    const newUser = {
      userName,
      email
    };

    if (!isEmpty(emailUsed)) {
      const errors = [{ message: '', domain: 'global', reason: 'invalid' }];
      return new Response(400, { some: 'header' }, { errors, message: 'User already used' });
    }

    schema.db.signInUserData.insert({
      ...newUser,
      ...{ id: uniqueId('user_'), accountUserName: userName }
    });
    return {
      data: {
        token: 'wVYrxaeNa9OxdnULvde1Au5m5w63',
        user: { role: ROLES.ADMIN }
      }
    };
  });

  server.post('*', () => {
    const errors = [{ message: '', domain: 'global', reason: 'invalid' }];
    return new Response(404, { some: 'header' }, { errors, message: 'Request Not Found' });
  });
}
