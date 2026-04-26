import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography } from '@mui/material';
import Links from '../Utils/Links';
import { putSignOut } from '../Services/authService';
import { selectTokenExpTime, setSignOutUser } from '../Redux/user.Slice';
import { setSignOutPasswords } from '../Redux/passwords.Slice';

const TokenExpirationChecker = ({ handleToastError }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const TOKEN_EXP_TIME = useSelector(selectTokenExpTime);

  const [isTokenExpired, setIsTokenExpired] = useState(false);

  useEffect(() => {
    const checkTokenExpiration = () => {
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime >= TOKEN_EXP_TIME) {
        setIsTokenExpired(true);
      } else {
        setIsTokenExpired(false);
      }
    };
    checkTokenExpiration();
    const intervalId = setInterval(checkTokenExpiration, 60000);

    return () => clearInterval(intervalId);
  }, [TOKEN_EXP_TIME]);

  useEffect(() => {
    const handleTokenExpiration = async () => {
      if (isTokenExpired) {
        try {
          await putSignOut();
          dispatch(setSignOutUser());
          dispatch(setSignOutPasswords());
          handleToastError('Tu sesión ha caducado. Por favor, inicia sesión nuevamente.');
          navigate(Links.signIn);
        } catch (error) {
          handleToastError(error.response.data.message);
        }
      }
    };

    handleTokenExpiration();
  }, [dispatch, handleToastError, isTokenExpired, navigate]);

  return null;
};

export default TokenExpirationChecker;
