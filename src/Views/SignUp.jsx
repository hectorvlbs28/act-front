import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { Box, Button, CssBaseline, Stack, Typography } from "@mui/material";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import AppTheme from "../Theme/AppTheme";
import FormField from "../Components/Inputs/FormField";
import PasswordField from "../Components/Inputs/PasswordField";
import Links from "../Utils/Links";
import { createSignUpBody } from "../Utils/createBodys";
import { postSignUp } from "../Services/authService";
import { setApiLoading } from "../Redux/navigation.Slice";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
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
  },
  marginTop: "3rem",
}));

const SignUp = ({ handleToastError, handleToastSuccess }) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    name: Yup.string().required(intl.formatMessage({ id: "FieldRequired" })),
    userName: Yup.string().required(
      intl.formatMessage({ id: "FieldRequired" })
    ),
    password: Yup.string().required(
      intl.formatMessage({ id: "FieldRequired" })
    ),
    repeatPassword: Yup.string()
      .oneOf(
        [Yup.ref("password"), null],
        intl.formatMessage({ id: "PasswordsMustMatch" })
      )
      .required(intl.formatMessage({ id: "FieldRequired" })),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    name: "",
    userName: "",
    password: "",
    repeatPassword: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleRepeatPasswordVisibility = () => {
    setShowRepeatPassword((prev) => !prev);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    dispatch(
      setApiLoading({
        status: true,
      })
    );
    try {
      const body = createSignUpBody(values);
      const { message } = await postSignUp(body);
      handleToastSuccess(message);
      dispatch(
        setApiLoading({
          status: false,
        })
      );
      setLoading(false);
      setInitialValues({
        name: "",
        userName: "",
        password: "",
        repeatPassword: "",
      });
      navigate(Links.home);
    } catch (error) {
      handleToastError(error.response.data.message);
      setLoading(false);
      dispatch(
        setApiLoading({
          status: false,
        })
      );
    }
  };

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />

      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{
              width: "100%",
              fontSize: "clamp(2rem, 10vw, 2.15rem)",
              textAlign: "center",
            }}
          >
            {intl.formatMessage({ id: "signUp" })}
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form>
                  <FormField
                    name="name"
                    label={intl.formatMessage({ id: "Name" })}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />

                  <FormField
                    name="userName"
                    label={intl.formatMessage({ id: "loginUserNameLabel" })}
                    error={touched.userName && Boolean(errors.userName)}
                    helperText={touched.userName && errors.userName}
                  />

                  <PasswordField
                    name="password"
                    label={intl.formatMessage({ id: "Password" })}
                    showPassword={showPassword}
                    togglePasswordVisibility={togglePasswordVisibility}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                  />

                  <PasswordField
                    name="repeatPassword"
                    label={intl.formatMessage({ id: "RepeatPassword" })}
                    showPassword={showRepeatPassword}
                    togglePasswordVisibility={toggleRepeatPasswordVisibility}
                    error={
                      touched.repeatPassword && Boolean(errors.repeatPassword)
                    }
                    helperText={touched.repeatPassword && errors.repeatPassword}
                  />

                  <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Button
                      loading={loading}
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      {intl.formatMessage({ id: "Submit" })}
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
};

export default SignUp;
