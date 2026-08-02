import React from 'react';
import { useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography } from '@mui/material';

import { openNewPassword, selectListLength } from '../store/passwords.slice';
import SearchBar from '../../../shared/components/inputs/SearchBar';
import CustomIconButton from '../../../shared/components/ui/CustomIconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';

const PassHeader = ({ value, onChange, handleFetchPasswords }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const LIST_LENGTH = useSelector(selectListLength);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        mb: 3,
        gap: 2,
        flexWrap: 'wrap',
      }}
    >
      <Box>
        <Typography variant="h5">{intl.formatMessage({ id: 'passwordTitle' })}</Typography>
        <Typography variant="subtitle1">{`${LIST_LENGTH} ${intl.formatMessage({ id: 'viewTable' })}`}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SearchBar value={value} onChange={onChange} placeholder={intl.formatMessage({ id: 'searchPlaceholder' })} />
        <CustomIconButton
          onClick={() => {
            handleFetchPasswords(true);
          }}
          icon={<RefreshIcon fontSize="small" />}
        />
        <CustomIconButton
          onClick={() => {
            dispatch(openNewPassword());
          }}
          icon={<AddIcon />}
          text={intl.formatMessage({ id: 'newPasswordBtn' })}
        />
      </Box>
    </Box>
  );
};

export default PassHeader;
