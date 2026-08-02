import React, { useEffect, useCallback, useState } from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import { Stack, Box, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';

import ViewTemplate from '../../shared/components/ui/ViewTemplate';
import PasswordsTable from './components/PasswordsTable';
import NewPassModal from './components/NewPassModal';
import CustomIconButton from '../../shared/components/ui/CustomIconButton';
import SearchBar from '../../shared/components/inputs/SearchBar';
import PassHeader from './components/PassHeader';
import useToast from '../../Hooks/useToast';
import SeePassDrawer from './components/SeePassDrawer';
import DeletePassModal from './components/DeletePassModal';
import {
  fetchPasswords,
  selectPasswordsList,
  selectIsPasswordsListEmpty,
  selectPassLoading,
  fetchPasswordById,
  selectNeedUpdate,
} from './store/passwords.slice';
import { selectIsLogged } from '../auth/store/auth.slice';

const Passwords = () => {
  const dispatch = useDispatch();
  const { toastEmpty } = useToast();
  const intl = useIntl();
  const PASSWORD_LIST = useSelector(selectPasswordsList);
  const IS_EMPTY_LIST = useSelector(selectIsPasswordsListEmpty);
  const IS_LOGGED = useSelector(selectIsLogged);
  const IS_LOADING = useSelector(selectPassLoading);
  const NEED_UPDATE = useSelector(selectNeedUpdate);

  const [searchTerm, setSearchTerm] = useState('');
  const filteredRows = React.useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return PASSWORD_LIST;

    return PASSWORD_LIST.filter((row) =>
      String(row.pswd_name || '')
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [PASSWORD_LIST, searchTerm]);

  const handleFetchPasswords = useCallback(
    (refresh = false) => {
      dispatch(fetchPasswords({ refresh }));
    },
    [dispatch]
  );

  const handleSelectPass = (row, type) => {
    dispatch(fetchPasswordById({ id: row._id, name: row.pswd_name, description: row.pswd_description, type }));
  };

  useEffect(() => {
    const shouldFetch = (IS_EMPTY_LIST && IS_LOGGED) || NEED_UPDATE;
    if (shouldFetch) handleFetchPasswords(NEED_UPDATE);
  }, [handleFetchPasswords, IS_EMPTY_LIST, IS_LOGGED, NEED_UPDATE]);

  useEffect(() => {
    if (!filteredRows.length && !IS_LOADING && !IS_EMPTY_LIST) {
      toastEmpty(intl.formatMessage({ id: 'noPassFound' }));
    }
  }, [filteredRows, IS_LOADING, IS_EMPTY_LIST, intl]);

  return (
    <ViewTemplate>
      <SeePassDrawer />
      <NewPassModal handleFetchPasswords={handleFetchPasswords} />
      <DeletePassModal />

      <PassHeader value={searchTerm} onChange={setSearchTerm} handleFetchPasswords={handleFetchPasswords} />
      <PasswordsTable rows={filteredRows} handleSelectPass={handleSelectPass} />
    </ViewTemplate>
  );
};

export default Passwords;
