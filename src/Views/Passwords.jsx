import React, { useEffect } from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import { useIntl } from 'react-intl';
import { Stack } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

import ViewTemplate from '../Components/Generals/ViewTemplate';
import PasswordsTable from '../Components/Passwords/PasswordsTable';
import {
  fetchPasswords,
  selectPasswordsList,
  selectIsPasswordsListEmpty,
  fetchPasswordById,
  openNewPassword,
  selectNeedUpdate,
} from '../Redux/passwords.Slice';
import { selectIsLogged } from '../Redux/user.Slice';
import ViewPassModal from '../Components/Passwords/ViewPassModal';
import CustomIconButton from '../Components/Generals/CustomIconButton';
import NewPassModal from '../Components/Passwords/NewPassModal';

const Passwords = ({ handleToastError }) => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const PASSWORD_LIST = useSelector(selectPasswordsList);
  const IS_EMPTY_LIST = useSelector(selectIsPasswordsListEmpty);
  const IS_LOGGED = useSelector(selectIsLogged);
  const NEED_UPDATE = useSelector(selectNeedUpdate);

  const handleFetchPasswords = React.useCallback(
    (refresh = false) => {
      dispatch(fetchPasswords({ refresh }));
    },
    [dispatch]
  );

  const handleSeePassword = (row, type) => {
    dispatch(
      fetchPasswordById({
        id: row._id,
        name: row.pswd_name,
        description: row.pswd_description,
        type,
      })
    );
  };

  const handleNewPassword = () => {
    dispatch(openNewPassword());
  };

  useEffect(() => {
    if (IS_EMPTY_LIST && IS_LOGGED) handleFetchPasswords();
  }, [handleFetchPasswords, IS_EMPTY_LIST, IS_LOGGED]);

  useEffect(() => {
    if (NEED_UPDATE) handleFetchPasswords(true);
  }, [handleFetchPasswords, NEED_UPDATE]);

  return (
    <ViewTemplate viewTitle={intl.formatMessage({ id: 'passwordTitle' })}>
      <ViewPassModal />
      <NewPassModal handleToastError={handleToastError} handleFetchPasswords={handleFetchPasswords} />

      <Stack direction="row" spacing={2}>
        <CustomIconButton
          onClick={(event) => {
            event.preventDefault();
            handleFetchPasswords(true);
          }}
          icon={<RefreshIcon fontSize="small" />}
        />

        <CustomIconButton
          onClick={(event) => {
            event.preventDefault();
            handleNewPassword();
          }}
          icon={<AddIcon fontSize="small" />}
        />
      </Stack>

      <PasswordsTable rows={PASSWORD_LIST} handleSeePassword={handleSeePassword} />
    </ViewTemplate>
  );
};

export default Passwords;
