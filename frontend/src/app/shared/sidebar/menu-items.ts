import { RouteInfo, RouteUser } from "./sidebar.metadata";

export const ROUTES: RouteUser[] = [
  {
    role: "ROLE_SUPERADMIN",
    routes: [
      {
        path: "/superadmin/dashboard",
        title: "Dashboard",
        icon: "bi bi-speedometer2",
        image: "assets/images/bashboard.png",
        active: "assets/images/bashbaord.png",
        class: "",
        extralink: false,
        submenu: [],
        display: true
      },
      {
        path: "/superadmin/competitions",
        title: "Competition Manager",
        icon: "bi bi-speedometer2",
        image: "assets/images/bashboard.png",
        active: "assets/images/bashbaord.png",
        class: "",
        extralink: false,
        submenu: [],
        display: true
      }
      // {
      //   path: "/superadmin/users",
      //   title: "Users Management",
      //   icon: "bi bi-speedometer2",
      //   image: "assets/images/squads.png",
      //   active: "assets/images/squads.png",
      //   class: "",
      //   extralink: false,
      //   submenu: [],
      // },
      // {
      //   path: "/superadmin/leagues",
      //   title: "League Management",
      //   icon: "bi bi-speedometer2",
      //   image: "assets/images/leagues.png",
      //   active: "assets/images/leagues.png",
      //   class: "",
      //   extralink: false,
      //   submenu: [],
      // },
      // {
      //   path: "/superadmin/academies",
      //   title: "Team Management",
      //   icon: "bi bi-speedometer2",
      //   image: "assets/images/teams.png",
      //   active: "assets/images/teams.png",
      //   class: "",
      //   extralink: false,
      //   submenu: [],
      // },
      // {
      //   path: "/superadmin/squads",
      //   title: "Squad Management",
      //   icon: "bi bi-speedometer2",
      //   image: "assets/images/squads.png",
      //   active: "assets/images/squads.png",
      //   class: "",
      //   extralink: false,
      //   submenu: [],

      // }
    ]
  },
  {
    role: "ROLE_ADMIN",
    routes: [
      {
        path: "/admin/dashboard",
        title: "Dashboard",
        icon: "bi bi-speedometer2",
        image: "assets/images/bashboard.png",
        active: "assets/images/bashbaord.png",
        class: "",
        extralink: false,
        submenu: [],
        display: true
      },
      {
        path: "/admin/competitions",
        title: "Competition Manager",
        icon: "bi bi-speedometer2",
        image: "assets/images/bashboard.png",
        active: "assets/images/bashbaord.png",
        class: "",
        extralink: false,
        submenu: [],
        display: true
      },
      {
        path: "/admin/leagues",
        title: "League Management",
        icon: "bi bi-speedometer2",
        image: "assets/images/leagues.png",
        active: "assets/images/leagues.png",
        class: "",
        extralink: false,
        submenu: [],
        display: false
      },
      {
        path: "/admin/academies",
        title: "Club Management",
        icon: "bi bi-speedometer2",
        image: "assets/images/teams.png",
        active: "assets/images/teams.png",
        class: "",
        extralink: false,
        submenu: [],
        display: false
      },
      {
        path: "/admin/squads",
        title: "Squad Management",
        icon: "bi bi-speedometer2",
        image: "assets/images/squads.png",
        active: "assets/images/squads.png",
        class: "",
        extralink: false,
        submenu: [],
        display: false
      },
      {
        path: "/admin/users",
        title: "User Management",
        icon: "bi bi-speedometer2",
        image: "assets/images/squads.png",
        active: "assets/images/squads.png",
        class: "",
        extralink: false,
        submenu: [],
        display: false
      },
      {
        path: "/admin/players",
        title: "All Players",
        icon: "bi bi-speedometer2",
        image: "assets/images/teams.png",
        active: "assets/images/teams.png",
        class: "",
        extralink: false,
        submenu: [],
        display: false
      }
    ]
  },
  {
    role: "ROLE_COACH",
    routes: [
      {
        path: "/coach/dashboard",
        title: "Dashboard",
        icon: "bi bi-speedometer2",
        image: "assets/images/bashboard.png",
        active: "assets/images/bashbaord.png",
        class: "",
        extralink: false,
        submenu: [],
        display: true
      },
      // {
      //   path: '/coach/leagues',
      //   title: 'League Management',
      //   icon: 'bi bi-bell',
      //   class: '',
      //   extralink: false,
      //   submenu: [],
      // },
      // {
      //   path: '/coach/teams',
      //   title: 'Team Management',
      //   icon: 'bi bi-patch-check',
      //   class: '',
      //   extralink: false,
      //   submenu: [],
      // },
      {
        path: "/coach/teams",
        title: "Squad Management",
        icon: "bi bi-hdd-stack",
        image: "assets/images/squads.png",
        active: "assets/images/squads.png",
        class: "",
        extralink: false,
        submenu: [],
        display: true
      }
      // {
      //   path: '/component/card',
      //   title: 'Card',
      //   icon: 'bi bi-card-text',
      //   class: '',
      //   extralink: false,
      //   submenu: [],
      // },
      // {
      //   path: '/component/dropdown',
      //   title: 'Dropdown',
      //   icon: 'bi bi-menu-app',
      //   class: '',
      //   extralink: false,
      //   submenu: [],
      // },
      // {
      //   path: '/component/pagination',
      //   title: 'Pagination',
      //   icon: 'bi bi-dice-1',
      //   class: '',
      //   extralink: false,
      //   submenu: [],
      // },
      // {
      //   path: '/component/nav',
      //   title: 'Nav',
      //   icon: 'bi bi-pause-btn',
      //   class: '',
      //   extralink: false,
      //   submenu: [],
      // },
      // {
      //   path: '/component/table',
      //   title: 'Table',
      //   icon: 'bi bi-layout-split',
      //   class: '',
      //   extralink: false,
      //   submenu: [],
      // },
      // {
      //   path: '/about',
      //   title: 'About',
      //   icon: 'bi bi-people',
      //   class: '',
      //   extralink: false,
      //   submenu: [],
      // }
    ]
  },
  {
    role: "ROLE_REFEREE",
    routes: [
      {
        path: "/referee/dashboard",
        title: "Fixture Setup",
        icon: "bi bi-speedometer2",
        image: "assets/images/bashboard.png",
        active: "assets/images/bashbaord.png",
        class: "",
        extralink: false,
        submenu: [],
        display: true
      },
      {
        path: "/referee/mangegames",
        title: "Game Management",
        icon: "bi bi-pause-btn",
        image: "assets/images/squads.png",
        active: "assets/images/squads.png",
        class: "",
        extralink: false,
        submenu: [],
        display: true
      }
      // {
      //   path: '/component/badges',
      //   title: 'Badges',
      //   icon: 'bi bi-patch-check',
      //   class: '',
      //   extralink: false,
      //   submenu: [],
      // },
      // {
      //   path: '/component/buttons',
      //   title: 'Button',
      //   icon: 'bi bi-hdd-stack',
      //   class: '',
      //   extralink: false,
      //   submenu: [],
      // },
      // {
      //   path: '/component/card',
      //   title: 'Card',
      //   icon: 'bi bi-card-text',
      //   class: '',
      //   extralink: false,
      //   submenu: [],
      // },
      // {
      //   path: '/component/dropdown',
      //   title: 'Dropdown',
      //   icon: 'bi bi-menu-app',
      //   class: '',
      //   extralink: false,
      //   submenu: [],
      // },
      // {
      //   path: '/component/pagination',
      //   title: 'Pagination',
      //   icon: 'bi bi-dice-1',
      //   class: '',
      //   extralink: false,
      //   submenu: [],
      // },
      // {
      //   path: '/component/nav',
      //   title: 'Nav',
      //   icon: 'bi bi-pause-btn',
      //   class: '',
      //   extralink: false,
      //   submenu: [],
      // },
      // {
      //   path: '/component/table',
      //   title: 'Table',
      //   icon: 'bi bi-layout-split',
      //   class: '',
      //   extralink: false,
      //   submenu: [],
      // },
      // {
      //   path: '/about',
      //   title: 'About',
      //   icon: 'bi bi-people',
      //   class: '',
      //   extralink: false,
      //   submenu: [],
      // }
    ]
  }
];
