import Links from './links';
import { PERMISSIONS } from './permissions';

const navigationConfig = [
  {
    id: 'home',
    labelId: 'homeBtn',
    icon: 'HomeRounded',
    path: Links.home,
    permission: PERMISSIONS.PUBLIC,
  },
  {
    id: 'passwords',
    labelId: 'passwordsBtn',
    icon: 'LockRounded',
    path: Links.passwords,
    permission: PERMISSIONS.AUTHENTICATED,
  },
  {
    id: 'admin',
    labelId: 'adminSection',
    icon: 'AdminPanelSettingsRounded',
    permission: PERMISSIONS.AUTHENTICATED,
    children: [
      {
        id: 'newUser',
        labelId: 'signUp',
        icon: 'PersonAddRounded',
        path: Links.SignUp,
        permission: PERMISSIONS.AUTHENTICATED,
      },
    ],
  },
  {
    id: 'signin',
    labelId: 'loginTitle',
    icon: 'LoginRounded',
    path: Links.signIn,
    permission: PERMISSIONS.GUEST,
  },
];

export default navigationConfig;
