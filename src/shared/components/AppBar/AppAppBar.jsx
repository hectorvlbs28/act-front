import React from 'react';
import { Box, AppBar, Toolbar, IconButton, Container, Divider, ListItemButton, Drawer } from '@mui/material';
import { Menu as MenuIcon, CloseRounded as CloseRoundedIcon } from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';

import ColorModeIconDropdown from '../ui/ColorModeIconDropdown';
import Links from '../../constants/links';
import LinkButton from '../ui/LinkButton';
import UserPopover from '../ui/UserPopover';
import { selectIsLogged } from '../../../features/auth/store/auth.slice';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}));

const AppAppBar = () => {
  const location = useLocation();
  const intl = useIntl();
  const IS_LOGGED = useSelector(selectIsLogged);

  const isHome = location.pathname === Links.home;

  const routes = [
    { linkTo: Links.passwords, textId: 'passwordsBtn', showWhenLogged: true },
    { linkTo: Links.signIn, textId: 'loginTitle', showWhenLogged: false },
    { linkTo: Links.SignUp, textId: 'signUp', showWhenLogged: true },
  ];

  const [open, setOpen] = React.useState(false);

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            {!isHome && (
              <LinkButton
                btnLinkTo={Links.home}
                btnText={intl.formatMessage({ id: 'homeBtn' })}
                btnColor="primary"
                btnVariant="text"
                btnSize="small"
              />
            )}
            {IS_LOGGED && (
              <Box>
                {routes
                  .filter((r) => r.showWhenLogged)
                  .map((r, i) => (
                    <LinkButton
                      key={i}
                      btnLinkTo={r.linkTo}
                      btnText={intl.formatMessage({ id: r.textId })}
                      btnColor="primary"
                      btnVariant="text"
                      btnSize="small"
                    />
                  ))}
              </Box>
            )}
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
            {IS_LOGGED ? (
              <UserPopover />
            ) : (
              routes
                .filter((r) => !r.showWhenLogged)
                .map((r, i) => (
                  <LinkButton
                    key={i}
                    btnLinkTo={r.linkTo}
                    btnText={intl.formatMessage({ id: r.textId })}
                    btnColor="primary"
                    btnVariant="text"
                    btnSize="small"
                  />
                ))
            )}
            <ColorModeIconDropdown />
          </Box>

          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu button" onClick={() => setOpen(true)}>
              <MenuIcon />
            </IconButton>

            <Drawer
              anchor="top"
              open={open}
              onClose={() => setOpen(false)}
              slotProps={{ paper: { sx: { top: 'var(--template-frame-height, 0px)' } } }}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton onClick={() => setOpen(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                <ListItemButton component={Link} to={Links.home} onClick={() => setOpen(false)}>
                  {intl.formatMessage({ id: 'homeBtn' })}
                </ListItemButton>

                <Divider sx={{ my: 3 }} />

                {routes
                  .filter((r) => (IS_LOGGED ? r.showWhenLogged : !r.showWhenLogged))
                  .map((r, i) => (
                    <ListItemButton key={i} component={Link} to={r.linkTo} onClick={() => setOpen(false)}>
                      {intl.formatMessage({ id: r.textId })}
                    </ListItemButton>
                  ))}
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
};

export default AppAppBar;
