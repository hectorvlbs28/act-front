import React, { useState } from "react";
import { Box, Button, Popover } from "@mui/material";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import LogoutIcon from "@mui/icons-material/Logout";
import { useSelector, useDispatch } from "react-redux";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";

import { selectNameUser, setSignOutUser } from "../../../features/auth/store/auth.slice";
import { setSignOutPasswords } from "../../../features/passwords/store/passwords.slice";
import { putSignOut } from "../../../features/auth/service/auth.service";
import Links from "../../constants/links";
import useToast from "../../../hooks/useToast";
import { TOAST_MESSAGES } from "../../constants/toastMessages";

const UserPopover = () => {
  const intl     = useIntl();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toastError } = useToast();

  const NAME_USER  = useSelector(selectNameUser);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async (e, closePopover) => {
    e.preventDefault();
    setIsLoading(true);
    closePopover();
    try {
      await putSignOut();
      navigate(Links.home);
      dispatch(setSignOutPasswords());
      dispatch(setSignOutUser());
    } catch {
      toastError(TOAST_MESSAGES.auth.signOutError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PopupState variant="popover" popupId="user-popover">
      {(popupState) => (
        <Box>
          <Button color="primary" variant="text" loading={isLoading} {...bindTrigger(popupState)}>
            {NAME_USER}
          </Button>
          <Popover
            {...bindPopover(popupState)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top",    horizontal: "center" }}
            sx={{ padding: 2 }}
          >
            <Button
              color="primary"
              onClick={(e) => handleSignOut(e, popupState.close)}
              sx={{ padding: 1, display: "flex", gap: 1 }}
            >
              <LogoutIcon /> {intl.formatMessage({ id: "signOutBtn" })}
            </Button>
          </Popover>
        </Box>
      )}
    </PopupState>
  );
};

export default UserPopover;
