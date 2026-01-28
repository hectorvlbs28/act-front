import React, { useState } from "react";
import AppTheme from "../Theme/AppTheme";
import { useDispatch } from "react-redux";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { CssBaseline, Box, Button, Typography, Stack } from "@mui/material";

import Links from "../Utils/Links";
import AuthFormControl from "../Components/AuthFormControl";
import CustomCard from "../Components/Auth/CustomCard";
import { useIntl } from "react-intl";
import { postSignIn } from "../Services/authService";
import { createSignInBody } from "../Utils/createBodys";
import { setLoginUser } from "../Redux/user.Slice";
import { setApiLoading } from "../Redux/navigation.Slice";

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
    marginTop: "3rem",
  },
}));

const SignIn = ({ handleToastError, handleToastSuccess }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const intl = useIntl();

  const [userNameError, setUserNameError] = useState(false);
  const [userNameErrorMessage, setUserNameErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const validateInputs = () => {
    dispatch(
      setApiLoading({
        status: true,
      })
    );

    const userName = document.getElementById("userName");
    const password = document.getElementById("password");

    let isValid = true;

    if (userName.value == "") {
      setUserNameError(true);
      setUserNameErrorMessage(
        intl.formatMessage({
          id: "loginErrorUserName",
        })
      );
      isValid = false;
    } else {
      setUserNameError(false);
      setUserNameErrorMessage("");
    }

    if (!password.value || password.values) {
      setPasswordError(true);
      setPasswordErrorMessage(
        intl.formatMessage({
          id: "loginErrorPassword",
        })
      );
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    dispatch(
      setApiLoading({
        status: false,
      })
    );

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (userNameError || passwordError) return;

    dispatch(
      setApiLoading({
        status: true,
      })
    );

    const { userName, password } = event.target;
    const signInBody = createSignInBody(userName.value, password.value);

    try {
      const { message, user, token } = await postSignIn(signInBody);
      handleToastSuccess(message);

      dispatch(
        setLoginUser({
          name: user.name,
          userName: user.userName,
          user_id: user.user_id,
          userToken: token.userToken,
          tokenExpirationTime: token.tokenExpirationTime,
        })
      );
      dispatch(
        setApiLoading({
          status: false,
        })
      );

      [(userName, password)].forEach((input) => (input.value = ""));
      navigate(Links.home);
    } catch (error) {
      dispatch(
        setApiLoading({
          status: false,
        })
      );
      handleToastError(error.response.data.message);
    }
  };

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />

      <SignInContainer direction="column" justifyContent="space-between">
        <CustomCard variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{
              width: "100%",
              fontSize: "clamp(2rem, 10vw, 2.15rem)",
              textAlign: "center",
            }}
          >
            {intl.formatMessage({ id: "loginTitle" })}
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <AuthFormControl
              labelHtmlFor="userName"
              label={intl.formatMessage({ id: "loginUserNameLabel" })}
              textfieldError={userNameError}
              textfieldHelperText={userNameErrorMessage}
              textfieldId="userName"
              textfieldType="text"
              textfieldPlaceholder={intl.formatMessage({
                id: "loginUserNamePlaceholder",
              })}
              textfieldAutocomplete="userName"
            />

            <AuthFormControl
              labelHtmlFor="password"
              label={intl.formatMessage({ id: "loginPasswordLabel" })}
              textfieldError={passwordError}
              textfieldHelperText={passwordErrorMessage}
              textfieldId="password"
              textfieldType="password"
              textfieldPlaceholder={intl.formatMessage({
                id: "loginPasswordPlaceholder",
              })}
              textfieldAutocomplete="current-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              Iniciar sesión
            </Button>
          </Box>
        </CustomCard>
      </SignInContainer>
    </AppTheme>
  );
};

export default SignIn;
