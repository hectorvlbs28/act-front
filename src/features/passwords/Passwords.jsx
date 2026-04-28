import React, { useEffect, useCallback } from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import { useIntl } from 'react-intl';
import { Stack } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

import ViewTemplate from '../../shared/components/ui/ViewTemplate';
import PasswordsTable from './components/PasswordsTable';
import ViewPassModal from './components/ViewPassModal';
import NewPassModal from './components/NewPassModal';
import CustomIconButton from '../../shared/components/ui/CustomIconButton';
import {
  fetchPasswords,
  selectPasswordsList,
  selectIsPasswordsListEmpty,
  fetchPasswordById,
  openNewPassword,
  selectNeedUpdate,
} from './store/passwords.slice';
import { selectIsLogged } from '../auth/store/auth.slice';

const Passwords = () => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const PASSWORD_LIST = useSelector(selectPasswordsList);
  const IS_EMPTY_LIST = useSelector(selectIsPasswordsListEmpty);
  const IS_LOGGED = useSelector(selectIsLogged);
  const NEED_UPDATE = useSelector(selectNeedUpdate);

  const handleFetchPasswords = useCallback(
    (refresh = false) => {
      dispatch(fetchPasswords({ refresh }));
    },
    [dispatch]
  );

  const handleSeePassword = (row, type) => {
    console.log('handleSeePassword - row', row);
    console.log('handleSeePassword - row', type);
    //dispatch(fetchPasswordById({ id: row._id, name: row.pswd_name, description: row.pswd_description, type }));
  };

  useEffect(() => {
    const shouldFetch = (IS_EMPTY_LIST && IS_LOGGED) || NEED_UPDATE;
    if (shouldFetch) handleFetchPasswords(NEED_UPDATE);
  }, [handleFetchPasswords, IS_EMPTY_LIST, IS_LOGGED, NEED_UPDATE]);

  return (
    <ViewTemplate viewTitle={intl.formatMessage({ id: 'passwordTitle' })}>
      <ViewPassModal />
      <NewPassModal handleFetchPasswords={handleFetchPasswords} />

      <Stack direction="row" spacing={2}>
        <CustomIconButton
          onClick={(e) => {
            e.preventDefault();
            handleFetchPasswords(true);
          }}
          icon={<RefreshIcon fontSize="small" />}
        />
        <CustomIconButton
          onClick={(e) => {
            e.preventDefault();
            dispatch(openNewPassword());
          }}
          icon={<AddIcon fontSize="small" />}
        />
      </Stack>

      <PasswordsTable rows={PASSWORD_LIST} handleSeePassword={handleSeePassword} />
    </ViewTemplate>
  );
};

export default Passwords;
