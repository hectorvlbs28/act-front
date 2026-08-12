import { useSelector } from 'react-redux';

import { selectIsLogged } from '../features/auth/store/auth.slice';
import { PERMISSIONS } from '../shared/constants/permissions';

export const usePermissions = () => {
  const isLogged = useSelector(selectIsLogged);

  const can = (permission) => {
    if (!permission || permission === PERMISSIONS.PUBLIC) return true;

    const required = Array.isArray(permission) ? permission : [permission];

    return required.some((perm) => {
      switch (perm) {
        case PERMISSIONS.GUEST:
          return !isLogged;
        case PERMISSIONS.AUTHENTICATED:
          return isLogged;
        default:
          return false;
      }
    });
  };

  return { can, isLogged };
};

export default usePermissions;
