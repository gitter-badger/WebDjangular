import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'nb-home',
    link: '/admin',
  },
  {
    title: 'System',
    icon: 'fas fa-cog',
    children: [
      {
        title: 'Users',
        link: '/admin/user',
        data: {
          permission: [
            {label: 'users', action: 'list_user'},
          ]
        }
      },
      {
        title: 'Groups',
        link: '/admin/group',
        data: {
          permission: [
            {label: 'users', action: 'list_group'}
          ]
        }
      }
    ]
  },
];
