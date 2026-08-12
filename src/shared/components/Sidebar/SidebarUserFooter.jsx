import React from 'react';
import { Box, IconButton, Tooltip, Typography, Divider } from '@mui/material';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';

import { selectIsLogged, selectNameUser, setSignOutUser } from '../../../features/auth/store/auth.slice';
import { setSignOutPasswords } from '../../../features/passwords/store/passwords.slice';
import { putSignOut } from '../../../features/auth/service/auth.service';
import Links from '../../constants/links';
import { useSidebar } from './SidebarContext';

const SidebarUserFooter = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { collapsed, closeMobile } = useSidebar();

  const isLogged = useSelector(selectIsLogged);
  const nameUser = useSelector(selectNameUser);

  if (!isLogged) return null;

  const handleSignOut = async () => {
    await putSignOut();
    closeMobile();
    navigate(Links.home);
    dispatch(setSignOutPasswords());
    dispatch(setSignOutUser());
  };

  return (
    <>
      <Divider />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          gap: 1,
          p: 1.5,
        }}
      >
        {!collapsed && (
          <Typography variant="body2" fontWeight={600} noWrap sx={{ minWidth: 0 }}>
            {nameUser}
          </Typography>
        )}
        <Tooltip title={intl.formatMessage({ id: 'signOutBtn' })} placement="right">
          <IconButton size="small" onClick={handleSignOut} aria-label={intl.formatMessage({ id: 'signOutBtn' })}>
            <LogoutRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </>
  );
};

export default SidebarUserFooter;
