import {
  UserOutlined,
  DollarCircleOutlined,
  UserAddOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import { APP_PREFIX_PATH } from 'configs/AppConfig';
import { ProjectManagerIcon, ResourceManagerIcon } from 'assets/svg/icon';

const dashBoardNavTree = [
  {
    key: 'dashboards',
    path: `${APP_PREFIX_PATH}/dashboards`,
    breadcrumb: false,
    icon: '',
    isGroupTitle: true,
    submenu: [
      {
        key: 'admin/',
        title: 'sidenav.dashboard.admin',
        icon: UserOutlined,
        breadcrumb: false,
        submenu: [
          {
            key: 'admin/dashboard',
            path: `${APP_PREFIX_PATH}/dashboards/admin-dashboard`,
            title: 'Dashboard',
            breadcrumb: false,
            submenu: []
          },
          {
            key: 'admin/cadence',
            path: `${APP_PREFIX_PATH}/dashboards/cadence`,
            title: 'sidenav.dashboard.cadence',
            breadcrumb: false,
            submenu: []
          },
          {
            key: 'admin/projectMetrics',
            path: `${APP_PREFIX_PATH}/dashboards/project-metrics`,
            title: 'sidenav.dashboard.projectMetrics',
            breadcrumb: false,
            submenu: []
          },
          {
            key: 'admin/budget',
            path: `${APP_PREFIX_PATH}/dashboards/budget`,
            title: 'sidenav.dashboard.budget',
            breadcrumb: false,
            submenu: []
          },
          {
            key: 'admin/resourceTeam',
            path: `${APP_PREFIX_PATH}/dashboards/resource-team`,
            title: 'sidenav.dashboard.resourceTeam',
            breadcrumb: false,
            submenu: []
          },
          {
            key: 'admin/user',
            title: 'sidenav.dashboard.user',
            breadcrumb: false,
            submenu: [
              {
                key: 'admin/user/currentUsers',
                path: `${APP_PREFIX_PATH}/dashboards/user`,
                title: 'sidenav.dashboard.currentUsers',
                breadcrumb: false,
                submenu: []
              },
              {
                key: 'admin/user/pendingRequests',
                path: `${APP_PREFIX_PATH}/dashboards/userRequests`,
                title: 'sidenav.dashboard.userPendingRequests',
                breadcrumb: false,
                submenu: []
              }
            ]
          },
          {
            key: 'admin/billing',
            path: `${APP_PREFIX_PATH}/dashboards/billing-cycle`,
            title: 'sidenav.dashboard.billing',
            breadcrumb: false,
            submenu: []
          },
          // {
          //   key: 'admin/paymentOptions',
          //   path: `${APP_PREFIX_PATH}/dashboards/payment-options`,
          //   title: 'sidenav.payment.options',
          //   breadcrumb: false,
          //   submenu: []
          // },
          {
            key: 'admin/pendingInvoice',
            path: `${APP_PREFIX_PATH}/dashboards/pending-invoice`,
            title: 'sidenav.dashboard.pendingInvoice',
            breadcrumb: false,
            submenu: []
          }
        ]
      },
      {
        key: 'projectManager/',
        path: `${APP_PREFIX_PATH}/dashboards/project-manager`,
        title: 'sidenav.dashboard.projectManager',
        icon: ProjectManagerIcon,
        breadcrumb: false,
        submenu: [
          {
            key: 'projectManager/dashboard',
            path: `${APP_PREFIX_PATH}/dashboards/project-manager-dashboard`,
            title: 'sidenav.dashboard',
            breadcrumb: false,
            submenu: []
          },
          {
            key: 'projectManager/projectTimeline',
            path: `${APP_PREFIX_PATH}/dashboards/project-manager/project-timelines`,
            title: 'sidenav.dashboard.projectTimeline',
            breadcrumb: false,
            submenu: []
          },
          {
            key: 'projectManager/jiraTimeline',
            path: `${APP_PREFIX_PATH}/dashboards/project-manager/jira-timelines`,
            title: 'sidenav.dashboard.jiraTimeline',
            breadcrumb: false,
            submenu: []
          },
          {
            key: 'projectManager/projectRisks',
            path: `${APP_PREFIX_PATH}/dashboards/project-risks`,
            title: 'sidenav.dashboard.projectRisks',
            breadcrumb: false,
            submenu: []
          },
          {
            key: 'projectManager/projectResources',
            path: `${APP_PREFIX_PATH}/dashboards/project-manager/project-resources-dashboard`,
            title: 'sidenav.dashboard.projectManager.projectResources',
            breadcrumb: false,
            submenu: []
          },
          {
            key: 'projectManager/projectBudget',
            // we will use this route when we will develop this feature
            path: `${APP_PREFIX_PATH}/dashboards/project-manager/project-budget`,
            title: 'sidenav.dashboard.projectManager.projectBudget',
            breadcrumb: false,
            submenu: []
          },
          {
            key: 'projectManager/OKRS',
            // we will use this route when we will develop this feature
            path: `${APP_PREFIX_PATH}/dashboards/project-manager/project-okrs`,
            title: 'sidenav.dashboard.projectManager.projectOkrs',
            breadcrumb: false,
            submenu: []
          },
          {
            key: 'projectManager/projectHistory',
            path: `${APP_PREFIX_PATH}/dashboards/project-manager/project-history`,
            title: 'sidenav.dashboard.projectHistory',
            breadcrumb: false,
            submenu: []
          }
        ]
      },
      {
        key: 'resourceManager/',
        title: 'sidenav.dashboard.resourceManager',
        icon: ResourceManagerIcon,
        breadcrumb: false,
        submenu: [
          {
            key: 'resourceManager/dashboard',
            path: `${APP_PREFIX_PATH}/dashboards/resource-manager/resource-manager-dashboard`,
            title: 'sidenav.dashboard.resourceManager.dashboard',
            breadcrumb: false,
            submenu: []
          },
          {
            key: 'resourceManager/fullCommitment',
            path: `${APP_PREFIX_PATH}/dashboards/resource-manager/resource-commitment`,
            title: 'sidenav.dashboard.resourceManager.fullCommitment',
            breadcrumb: false,
            submenu: []
          },
          {
            key: 'resourceManager/resourceRequests',
            path: `${APP_PREFIX_PATH}/dashboards/resource-manager/resource-requests`,
            title: 'sidenav.resource.manager.resourceRequests',
            breadcrumb: false,
            submenu: []
          },
          {
            key: 'resourceManager/myRisks',
            path: `${APP_PREFIX_PATH}/dashboards/resource-manager/risks`,
            title: 'sidenav.dashboard.myRisks',
            breadcrumb: false,
            submenu: []
          }
        ]
      },
      {
        key: 'billingDashboard/',
        path: `${APP_PREFIX_PATH}/dashboards/admin-billing-dashboard`,
        title: 'sidenav.dashboard.admin.billing.dashboard',
        icon: DollarCircleOutlined,
        breadcrumb: false,
        submenu: []
      },
      {
        key: 'userDashboard/',
        title: 'sidenav.dashboard.user.dashboard',
        icon: UserAddOutlined,
        breadcrumb: false,
        submenu: [
          {
            key: 'userDashboard/myProjects',
            path: `${APP_PREFIX_PATH}/dashboards/general-user/my-projects`,
            title: 'sidenav.dashboard.user.my-projects',
            breadcrumb: false,
            submenu: []
          },
          {
            key: 'userDashboard/myRisks',
            path: `${APP_PREFIX_PATH}/dashboards/general-user/my-risks`,
            title: 'sidenav.dashboard.myRisks',
            breadcrumb: false,
            submenu: []
          },
          {
            key: 'userDashboard/myWork',
            path: `${APP_PREFIX_PATH}/dashboards/general-user/my-work`,
            title: 'sidenav.dashboard.user.my-work',
            breadcrumb: false,
            submenu: []
          }
        ]
      },
      {
        key: 'executive/',
        title: 'sidenav.dashboard.executive.dashboard',
        icon: UserAddOutlined,
        breadcrumb: false,
        submenu: [
          {
            key: 'executive/dashboard',
            path: `${APP_PREFIX_PATH}/dashboards/executive/dashboard`,
            title: 'sidenav.dashboard.executive.dashboard.title',
            breadcrumb: false,
            submenu: []
          }
        ]
      },
      {
        key: 'analytics/',
        path: `${APP_PREFIX_PATH}/dashboards/product_admin`,
        title: 'sidenav.analytics',
        icon: LineChartOutlined,
        breadcrumb: false,
        submenu: []
      },
      {
        key: 'customerActivation/',
        path: `${APP_PREFIX_PATH}/dashboards/customer-activation`,
        title: 'sidenav.customerActivation',
        icon: LineChartOutlined,
        breadcrumb: false,
        submenu: []
      }
    ]
  }
];

const navigationConfig = [...dashBoardNavTree];

export default navigationConfig;
