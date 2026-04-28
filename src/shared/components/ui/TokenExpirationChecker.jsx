import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Links from "../../constants/links";
import { putSignOut } from "../../../features/auth/service/auth.service";
import { selectTokenExpTime, setSignOutUser } from "../../../features/auth/store/auth.slice";
import { setSignOutPasswords } from "../../../features/passwords/store/passwords.slice";
import { TOAST_MESSAGES } from "../../constants/toastMessages";
import useToast from "../../../hooks/useToast";

const TokenExpirationChecker = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toastError } = useToast();

  const TOKEN_EXP_TIME = useSelector(selectTokenExpTime);

  useEffect(() => {
    const handleExpiration = async () => {
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime >= TOKEN_EXP_TIME) {
        try {
          await putSignOut();
          dispatch(setSignOutUser());
          dispatch(setSignOutPasswords());
          toastError(TOAST_MESSAGES.auth.sessionExpired);
          navigate(Links.signIn);
        } catch {
          toastError(TOAST_MESSAGES.generic.unexpectedError);
        }
      }
    };

    handleExpiration();
    const intervalId = setInterval(handleExpiration, 60000);
    return () => clearInterval(intervalId);
  }, [TOKEN_EXP_TIME, dispatch, navigate, toastError]);

  return null;
};

export default TokenExpirationChecker;
