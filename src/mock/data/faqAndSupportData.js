import { ROLES_ACCESS_TYPES } from 'constants/MiscConstant';

export const faqData = {
  [ROLES_ACCESS_TYPES.SUPER_ADMIN.key]: [
    {
      key: 1,
      question: 'Who is the Super Admin of PMO Tracker application?',
      answer: 'The person who first initiates the PMO Tracker relationship and creates the PMO Tracker Account.'
    },
    {
      key: 2,
      question: 'Who should ideally be a Super Admin while using the PMO Tracker application?',
      answer: 'The user who overlooks entire projects and ensures its (optimal functionality / optimal performance) should ideally be the super admin.'
    },
    {
      key: 3,
      question: 'What are the steps to log in as Super Admin?',
      answer: 'Click on the log in Page of PMO Tracker.\nUser will see the Email Id and Password Section, Fill out the required details with the credentials provided.\nAfter clicking on Sign In, User will be able to access the Super Admin Dashboard in the PMO Tracker.'
    },
    {
      key: 4,
      question: 'Who can add a new user?',
      answer: 'Super Admin and Admin can add new users.'
    },
    {
      key: 5,
      question: 'How to add a new user?',
      answer: 'Click on Admin.\nClick on User.\nClick on Current User.\nClick on Add New User.\nFill out the required details like, First Name, Last Name, Access Type, Email ID (All these are Mandatory) annd Phone Number (Optional)\nClick on Add..\nSteps to Verify as a New User.\nUser will get an Email notification.\nClick on Verify Email.\nUser will have to set up a new password.\nOnce the new password is set.\nUser can Sign in with the Email id and Password.\nUser will be able to access the user Dashboard in PMO Tracker.'
    },
    {
      key: 6,
      question: 'Who can request for licenses and additional licenses?',
      answer: 'Super Admin / Admin can request for licenses.\nOn Super Admin / Admin Section.\nClick on Admin.\nClick on Dashboard.\nIn the billing Details User will see Request Additional Licenses.\nClick on Request Additional Licenses.\nSelect the payment mode to renew the subscription and request additional licenses.'
    },
    {
      key: 7,
      question: 'How can users determine the optimal Project Cadence? OR What factors are considered when selecting a Project Cadence?',
      answer: 'Click on Admin.\nGo to Cadence.\nThere User can see the Agile and SDLC Cadence.\nUser can edit by clicking on edit in Agile and change the Sprint Duration and click on Save.\nUser can edit by clicking on edit in SDLC and change the year and click on Save.'
    },
    {
      key: 8,
      question: 'Which methodologies are available in PMO Tracker to create a new project?',
      answer: 'The methodologies used in PMO Tracker are Agile and SDLC.'
    },
    {
      key: 9,
      question: 'Can we have multiple Admins under one Super Admin?',
      answer: 'Yes! Super Admin can add more than one Admin in PMO Tracker application.'
    },
    {
      key: 10,
      question: 'Who can create a New Resource Team?',
      answer: 'Resource team can be created by Super Admin / Admin.'
    },
    {
      key: 11,
      question: 'How to add a new Resource team?',
      answer: 'Click on Admin.\nOption 01: Click on Dashboard.\nOption 02: Click on Resource Team.\nClick on New Resource Team.\nEnter the Team Name, Team Description, Select Resource Manager 1 from the drop down menu (Mandatory Field), Resource Manager 2 is optional.\nClick on Save.\nOnce Resource Team is created Super Admin/Admin under a particular Resource Manager, that Resource Manager can add resources into his / her teams.'
    },
    {
      key: 12,
      question: 'Who can and how to start with a new project in PMO Tracker?',
      answer: 'Super Admin and Project Manager can Start the New Project from Project Manager Dashboard.\nOption 1: Sign in as Project Manager.\nOption 2: Click on Project Manager Dashboard (When signed in as Super Admin).\nClick on Start New Project.\nEnter all the required project details.\nThen Click Save.\nNew Project is created.'
    },
    {
      key: 13,
      question: 'Who can, where and how to check the Project Status on PMO Tracker?',
      answer: 'Super Admin and Project Manager can check Project status by going to Project Manager Dashboard and clicking on Show details button. Additionally, Resource Managers and other executives and users can also check the project status however they cannot make any changes to it.'
    },
    {
      key: 14,
      question: 'How do User add Stage in the Project Timeline?',
      answer: 'Click on Project Manager.\nClick on Project Timeline.\nSelect User Project name.\nClick on Add Stage.\nFill in the details of Stage name, the start and end date and select the color shade\nWithout adding Stage User cannot add the substage.\nSelect the stage with default options from the drop down menu and if any specific stage needs to be added, Project Manager can request the Super Admin to add new stage.\nSuper Admin can add new stage from the Project Metrics section by clicking on Add new stage.'
    },
    {
      key: 15,
      question: 'Who can assign Resources in Resource Teams?',
      answer: 'Super Admin / Admin and Resource Manager.'
    },
    {
      key: 16,
      question: 'Once the Resource Request is created by Project Manager who gets the request for assigning resource?',
      answer: 'Super Admin / Admin and Resource Manager can see that request and they can assign the resource to the specific team.'
    },
    {
      key: 17,
      question: 'When do a risk show Open Risk , Resolved Risk and Canceled Risk?',
      answer: 'When a Project  manager/Super Admin  opens a Risk, it is shown in the open risk section.\nClick on Details of the Open Risk by scrolling to the extreme right.\nUser can see the details of the open Risk.\nUser has the provision to edit the suggested resolution.\nOnce the User has updated the suggested resolution, User can update / resolve or Cancel the risk depending on the specific situation.\nOnce the Risk has been Resolved or Canceled, no changes can be made to it.\nThis will be visible under Canceled and Resolved.\nDetails can be seen in the Risk history.'
    },
    {
      key: 18,
      question: 'When we mention the impacted members in Project Risks, do they get notified regarding the same?',
      answer: 'Yes, the impacted members receive an email notification that they are tagged in a project "risk name".  and that they can provide resolution.'
    }

  ],
  [ROLES_ACCESS_TYPES.ADMIN.key]: [
    {
      key: 19,
      question: 'What are the steps to log in as Admin?',
      answer: 'Click on the log in Page of PMO Tracker.\nUser will see the Email Id and Password Section, Fill out the required details with the credentials provided.\nAfter clicking on Sign In, User will be able to access the Admin Dashboard in the PMO Tracker.'
    },
    {
      key: 20,
      question: 'Who can add a new user?',
      answer: 'Super Admin and Admin can add new users.'
    },
    {
      key: 21,
      question: 'How to add a new user?',
      answer: 'Click on User.\nClick on Current User.\nClick on Add New User.\nFill out the required details like, First Name, Last Name, Access Type, Email ID (All these are Mandatory) and Phone Number (Optional)\nClick on Add..\nSteps to Verify as a New User.\nUser will get an Email notification.\nClick on Verify Email.\nUser will have to set up a new password.\nOnce the new password is set.\nUser can Sign in with the Email id and Password.\nUser will be able to access the user Dashboard in PMO Tracker.'
    },
    {
      key: 22,
      question: 'How to request for licenses and additional licenses?',
      answer: 'Click on Dashboard.\nIn the billing Details User will see Request Additional Licenses.\nClick on Request Additional Licenses.\nSelect the payment mode to renew the subscription and request additional licenses.'
    },
    {
      key: 23,
      question: 'How can users determine the optimal Project Cadence? OR What factors are considered when selecting a Project Cadence?',
      answer: 'Go to Cadence.\nThere User can see the Agile and SDLC Cadence.\nUser can edit by clicking on edit in Agile and change the Sprint Duration and click on Save.\nUser can edit by clicking on edit in SDLC and change the year and click on Save.'
    },
    {
      key: 24,
      question: 'Which methodologies are available in PMO Tracker to create a new project?',
      answer: 'The methodologies used in PMO Tracker are Agile and SDLC.'
    },
    {
      key: 25,
      question: 'Who can create a New Resource Team?',
      answer: 'Resource team can be created by Super Admin / Admin.'
    },
    {
      key: 26,
      question: 'How to add a new Resource team?',
      answer: 'Option 01: Click on Dashboard.\nOption 02: Click on Resource Team.\nClick on New Resource Team.\nEnter the Team Name, Team Description, Select Resource Manager 1 from the drop down menu (Mandatory Field), Resource Manager 2 is optional.\nClick on Save.\nOnce Resource Team is created Super Admin/Admin under a particular Resource Manager, that Resource Manager can add resources into his / her teams.'
    },
    {
      key: 27,
      question: 'Who can assign Resources in Resource Teams?',
      answer: 'Super Admin / Admin and Resource Manager.'
    },
    {
      key: 28,
      question: 'Once the Resource Request is created by Project Manager who gets the request for assigning resource?',
      answer: 'Super Admin / Admin and Resource Manager can see that request and they can assign the resource to the specific team.'
    }

  ],
  [ROLES_ACCESS_TYPES.PROJECT_MANAGER.key]: [
    {
      key: 29,
      question: 'What are the steps to log in as Project Manager?',
      answer: 'Click on the log in Page of PMO Tracker.\nUser will see the Email Id and Password Section, Fill out the required details with the credentials provided.\nAfter clicking on Sign In, User will be able to access the Project Manager Dashboard in the PMO Tracker.'
    },
    {
      key: 30,
      question: 'How to start with a new project in PMO Tracker?',
      answer: 'Click on Dashboard.\nClick on Start New Project.\nEnter all the required project details.\nThen Click Save.\nNew Project is created.'
    },
    {
      key: 31,
      question: 'Who are Stakeholders and Is it mandatory to add stakeholders in a project?',
      answer: 'When User adds a new project there is a Project Lead and User can add the Stakeholders by Clicking on Invite Stakeholders by\nOption 1: click on the existing User just select the name.\nOption 2: Add new User by clicking on Add New User and fill the required details mentioned in the window. Click on Add.\nAn Invitation Email will be sent to the selected Users, inviting them asking them to login to the system to access details.'
    },
    {
      key: 32,
      question: 'Apart from his own projects, why a Project Manager is seeing "Other Projects" on his dashboard? OR how is it helpful for a Project Manager to see "Other Projects" on his dashboard?',
      answer: 'It helps Project Manager with a birds eye view of other Projects progress / status which may or may not be dependent on his/her project or vice versa. Also if Project Manager needs a particular specialized resource which is busy on some other project then keeping a track would help him/her request for that resource accordingly.'
    },
    {
      key: 33,
      question: 'How to check the Project Status on PMO Tracker?',
      answer: 'Project Manager can check Project status by going to Project Manager Dashboard and clicking on Show details button. Additionally, Resource Managers and other executives and users can also check the project status however they cannot make any changes to it.'
    },
    {
      key: 34,
      question: 'How do User add Stage in the Project Timeline?',
      answer: 'Click on Project Timeline.\nSelect User Project name.\nClick on Add Stage.\nFill in the details of Stage name, the start and end date and select the color shade\nWithout adding Stage User cannot add the substage.\nSelect the stage with default options from the drop down menu and if any specific stage needs to be added, Project Manager can request the Super Admin to add new stage.'
    },
    {
      key: 35,
      question: 'How do User add Sub stages in the Project Timeline?',
      answer: 'Once User have added the stage.\nFor adding the substage click on the Add Sub Stages and Stage name, the start and end date and select the color shade.\nUser can add multiple Sub Stages.'
    },
    {
      key: 36,
      question: 'How to add the Stage Dependency and what is the purpose of adding stage Dependency in Project Timeline?',
      answer: 'Click on Stage Dependency.\nClick on stage.\nClick on which stage it is Dependent on\nThen select the timeline (Start Date and End Date).\nThe purpose is that User understands that the next stage is dependent on the previous stage and only after completion of the previous stage, the next stage begins.'
    },
    {
      key: 37,
      question: 'What happens when one Stage of the project does not complete within its assigned sprint time?',
      answer: 'Some stages are dependent on completion of previous stages; upon completion a new stage can begin. However, it is not necessary that all stages are dependent.\nUnfinished stages can lead to delays in project milestones or overall project completion.\nThe teams capacity may need to be adjusted to accommodate the unfinished work.\nStakeholders and end users may be affected if deliverables are delayed.\nIf work is rushed to meet sprint deadlines, quality may suffer.'
    },
    {
      key: 38,
      question: 'How to add the Sub Stage Dependency and what is the purpose of adding stage Sub Stage Dependency in Project Timeline?',
      answer: 'Click on Sub Stage Dependency.\nClick on Stage.\nClick on Substage.\nClick on which Sub stage it is Dependent on.\nThen select the timeline (Start Date and End Date)\nThe purpose is that User understands that the next Sub stage is dependent on the previous Sub stage and only after completion of the previous Sub stage, the next Sub Stage begins.'
    },
    {
      key: 39,
      question: 'Can Project Stage have multiple Sub Stage Dependencies?',
      answer: 'Project can have multiple Substage Dependencies.\nSub Stage can be independent and not all substages are inter dependent on each other.'
    },
    {
      key: 40,
      question: 'What is a milestone and purpose of adding milestone in Project Timeline?',
      answer: 'A Project milestone is a significant point in a project timeline that marks a major achievement or development phase. Project managers use milestones to track progress and ensure that goals are met within the specified timeframes.\nProject Milestones act as guideposts, ensuring that projects stay on track, risks are managed, and stakeholders remain informed. Project Managers can assess whether tasks are on schedule or if adjustments are needed. These markers help prevent delays and ensure timely completion'
    },
    {
      key: 41,
      question: 'How to add Milestone in Project Timeline?',
      answer: 'Click on Project Timeline.\nClick on Add Milestone.\nSelect the category.\nSelect the date.\nClick save.\nAfter Saving User will be able to see a bar is created saying Milestone and User can see the dates and category name mentioned.\nPost that User can edit it by saying what is the status, Done, Impacted or in progress and click update.'
    },
    {
      key: 42,
      question: 'What does the colors Green, Red and Number indicate in Milestones?',
      answer: 'The color Green indicates that milestone is achieved, color Red indicates that the date is overdue and the milestone is not achieved. Numbers show the number of milestones in a specific project.'
    },
    {
      key: 43,
      question: 'Can one project be dependent on another project? If yes, how and where the dependency is visible?',
      answer: 'A project dependency refers to a relationship between tasks where the completion or initiation of one task relies on the completion or initiation of another.\nDependencies help maintain order and ensure a logical flow of activities throughout a projects lifecycle.\nProject dependencies will be visible in Project Timeline.'
    },
    {
      key: 44,
      question: 'When does a Project Manager open a new risk? What are the factors to be considered prior to opening a new risk and its severity?',
      answer: 'When the work is not in the progress mode and with some barriers in the team the Project Manager opens a new Risk. The Factors are to see how big that problem is and how long will it take for that Risk to solve the severity has been decided.'
    },
    {
      key: 45,
      question: 'Steps to open a new risk?',
      answer: 'Click on Project Risk.\nClick on Open new risk.\nFill out the Risk Details like What is the titles of Risk, Description and impact of the risk, select the project name, suggested resolution.\nIn Risk Impacts, Select Which team, members, other project will be impacted based on the level of the severity.\nUsers can also add his/ her Comments in the Your Comment Section.\nClick Save.'
    },
    {
      key: 46,
      question: 'When do a project show Open Risk , Resolved Risk and Canceled Risk?',
      answer: 'When a project manager opens a Risk, it is shown in the open risk section.\nClick on Details of the Open Risk by scrolling to the extreme right.\nUsers can see the details of the open Risk.\nUser has the provision to edit the suggested resolution.\nOnce the User has updated the suggested resolution, User can update / resolve or Cancel the risk depending on the specific situation.\nOnce the Risk has been Resolved or Canceled, no changes can be made to it.\nThis will be visible under Canceled and Resolved.\nDetails can be seen in the Risk history.'
    },
    {
      key: 47,
      question: 'When a new risk is opened in a project, Who and how will they be impacted?',
      answer: 'Project Risks impact stakeholders, project aspects, and overall success. Effective risk management is crucial to minimize negative consequences.\nThe project team members are directly affected. Risks can lead to delays, increased workload, and stress. For example, if a critical resource leaves the team unexpectedly, it can disrupt the project timeline.\nRisks may require reallocating resources or hiring additional staff.\nf the project is delayed or fails to meet requirements, end users and customers may experience dissatisfaction or disruptions in services.\nRisks can cause delays, affecting project milestones and deadlines.\nRisks may increase project costs due to rework, resource allocation changes, or unexpected expenses.\nRisks related to technology (e.g., system failures, security breaches) can impact project success.\nScope changes due to risks (scope creep) can impact project objectives.\nRisks can compromise the quality of deliverables if not managed effectively.'
    },
    {
      key: 48,
      question: 'When do a risk show Open Risk , Resolved Risk and Canceled Risk?',
      answer: 'When a Project  manager/Super Admin  opens a Risk, it is shown in the open risk section.\nClick on Details of the Open Risk by scrolling to the extreme right.\nUser can see the details of the open Risk.\nUser has the provision to edit the suggested resolution.\nOnce the User has updated the suggested resolution, User can update / resolve or Cancel the risk depending on the specific situation.\nOnce the Risk has been Resolved or Canceled, no changes can be made to it.\nThis will be visible under Canceled and Resolved.\nDetails can be seen in the Risk history.'
    },
    {
      key: 49,
      question: 'When we mention the impacted members in Project Risks, do they get notified regarding the same?',
      answer: 'Yes, the impacted members receive an email notification that they are tagged in a project "risk name".  and that they can provide resolution.'
    }

  ],
  [ROLES_ACCESS_TYPES.RESOURCE_MANAGER.key]: [
    {
      key: 50,
      question: 'What are the steps to log in as Resource Manager?',
      answer: 'Click on the log in Page of PMO Tracker.\nUser will see the Email Id and Password Section, Fill out the required details with the credentials provided.\nAfter clicking on Sign In, User will be able to access the Resource Manager Dashboard in the PMO Tracker.'
    },
    {
      key: 51,
      question: 'Who can assign Resources in Resource Teams?',
      answer: 'Super Admin / Admin and Resource Manager.'
    },
    {
      key: 52,
      question: 'What is a dweller user?',
      answer: 'The resource manager Just create a new user(dweller) request that approved by Super admin.'
    },
    {
      key: 53,
      question: 'How does a Resource Manager add new Resources into Resource Teams?',
      answer: 'Click on Resources Requests.\nUser will see different resources requested for different projects.\nOn the extreme right after scrolling User will see the Assign button.\nClick on Assign Button.\nResource will be assigned to the requested team depending on the availability of that specific resource.\nIf the resource is not available from that specific team, User needs to assign a resource from another team.'
    },
    {
      key: 54,
      question: 'Once the Resource Request is created by Project Manager who gets the request for assigning resource?',
      answer: 'Super Admin / Admin and Resource Manager can see that request and they can assign the resource to the specific team.'
    },
    {
      key: 55,
      question: 'Why are Resource Managers not authorized to create their own Resource Team?',
      answer: 'To Avoid creating too many teams which could lead to confusion, Resource Manager is not authorized to create Resource Teams.\nOnce the Resource Team is created by Super Admin / Admin, Resource Manager can add Resources in the team.'
    },
    {
      key: 56,
      question: 'What is the difference between Assigned, Committed and Designated capacity?',
      answer: 'Assigned capacity refers to available resources that is specifically allocated for a particular purpose. It represents resources set aside for specific tasks, projects, or responsibilities. While assigned, these resources can still be adjusted or reallocated based on changing needs. A team members time allocated for a particular project is considered assigned capacity.\nCommitted capacity refers to resources that are contractually or formally committed to specific activities or projects. It represents a firm commitment, often backed by agreements or contracts. Committed capacity is less flexible because it cannot be easily changed or reallocated.\nDesignated capacity refers to resources that are earmarked or designated for a particular purpose but may not have strict commitments. These resources are set aside for specific needs or functions which are flexible. These resources do not have particular project assigned to them.'
    },
    {
      key: 57,
      question: 'When an ongoing project is put on hold, where, how and who will be notified about the same in PMO Tracker?',
      answer: 'Resource Manager, Stakeholders & all the Resources allocated to that project will be notified when the project is put on hold.'
    }

  ],
  [ROLES_ACCESS_TYPES.GENERAL_USER.key]: [
    {
      key: 58,
      question: 'Steps to Verify as a New User?',
      answer: 'User will get an Email notification.\nClick on Verify Email.\nUser will have to set up a new password.\nOnce the new password is set.\nUser can Sign in with the Email id and Password.\nUser will be able to access the user Dashboard in PMO Tracker.'
    },
    {
      key: 59,
      question: 'What are the steps to log in as General User?',
      answer: 'Click on the log in Page of PMO Tracker.\nUser will see the Email Id and Password Section, Fill out the required details with the credentials provided.\nAfter clicking on Sign In, User will be able to access the General User Dashboard in the PMO Tracker'
    },
    {
      key: 60,
      question: 'When we mention the impacted members in Project Risks, do they get notified regarding the same?',
      answer: 'Yes, the impacted members receive an email notification that they are tagged in a project "risk name".  and that they can provide resolution.'
    },

    {
      key: 61,
      question: 'What is Monitored risk? And what kind of risks will be shown under Monitored risk?',
      answer: 'Monitored risks refer to the ongoing tracking and oversight of identified risks throughout the project lifecycle. Risk monitoring involves continuously tracking and overseeing identified risks to assess their status, changes, and effectiveness of mitigation strategies.\nTypes of Risks Monitored:\nPredicted Threat risks that were identified during risk analysis.\nOther risks specific to the project context, such as technical challenges, resource constraints, or external dependencies.'
    }
  ],
  [ROLES_ACCESS_TYPES.EXECUTIVE.key]: []
};

export const contactSupportEmail = 'Support@pmotracker.com';
