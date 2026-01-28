import React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Container,
  Divider,
  MenuItem,
  Drawer,
  Typography,
} from "@mui/material";
import {
  Menu as MenuIcon,
  CloseRounded as CloseRoundedIcon,
} from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useIntl } from "react-intl";

import ColorModeIconDropdown from "./ColorModeIconDropdown";
import Links from "../../Utils/Links";
import LinkButton from "./LinkButton";
import UserPopover from "../UserPopover";
import { selectIsLogged } from "../../Redux/user.Slice";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: "8px 12px",
}));

const AppAppBar = ({ handleToastError }) => {
  const location = useLocation();
  const intl = useIntl();

  const IS_LOGGED = useSelector(selectIsLogged);

  const routes = [
    {
      linkTo: Links.passwords,
      textId: "passwordsBtn",
      showWhenLogged: true,
    },
    {
      linkTo: Links.signIn,
      textId: "loginTitle",
      showWhenLogged: false,
    },
    {
      linkTo: Links.SignUp,
      textId: "signUp",
      showWhenLogged: true,
    },
  ];

  const [open, setOpen] = React.useState(false);
  const [isHome, setIsHome] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleCloseDrawer = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    setIsHome(location.pathname === Links.home);
  }, [location]);

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: "calc(var(--template-frame-height, 0px) + 28px)",
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}
          >
            {!isHome && (
              <Box>
                <LinkButton
                  btnLinkTo={Links.home}
                  btnText={intl.formatMessage({ id: "homeBtn" })}
                  btnColor="primary"
                  btnVariant="text"
                  btnSize="small"
                />
              </Box>
            )}

            {IS_LOGGED ? (
              <Box>
                {routes
                  .filter((route) => route.showWhenLogged)
                  .map((route, index) => (
                    <LinkButton
                      key={index}
                      btnLinkTo={route.linkTo}
                      btnText={intl.formatMessage({ id: route.textId })}
                      btnColor="primary"
                      btnVariant="text"
                      btnSize="small"
                    />
                  ))}
              </Box>
            ) : null}
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
            {IS_LOGGED ? (
              <UserPopover handleToastError={handleToastError} />
            ) : (
              routes
                .filter((route) => !route.showWhenLogged)
                .map((route, index) => (
                  <LinkButton
                    key={index}
                    btnLinkTo={route.linkTo}
                    btnText={intl.formatMessage({ id: route.textId })}
                    btnColor="primary"
                    btnVariant="text"
                    btnSize="small"
                  />
                ))
            )}

            <ColorModeIconDropdown />
          </Box>

          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>

            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: "var(--template-frame-height, 0px)",
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                <MenuItem
                  component={Link}
                  to={Links.home}
                  onClick={handleCloseDrawer}
                >
                  {intl.formatMessage({ id: "homeBtn" })}
                </MenuItem>

                <Divider sx={{ my: 3 }} />

                {routes
                  .filter((route) =>
                    IS_LOGGED ? route.showWhenLogged : !route.showWhenLogged
                  )
                  .map((route, index) => (
                    <MenuItem
                      key={index}
                      component={Link}
                      to={route.linkTo}
                      onClick={handleCloseDrawer}
                    >
                      {intl.formatMessage({ id: route.textId })}
                    </MenuItem>
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
