import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';

import AuthView from '../Components/Auth/AuthView';
import FormField from '../Components/Inputs/FormField';
import PasswordField from '../Components/Inputs/PasswordField';
import Links from '../Utils/Links';
import { postSignIn } from '../Services/authService';
import { createSignInBody } from '../Utils/createBodys';
import { setLoginUser } from '../Redux/user.Slice';
import useToast from '../Hooks/useToast';

const SignIn = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toastError, toastSuccess } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const initialValues = {
    userName: '',
    password: '',
  };

  const validationSchema = Yup.object({
    userName: Yup.string().required(intl.formatMessage({ id: 'FieldRequired' })),
    password: Yup.string().required(intl.formatMessage({ id: 'FieldRequired' })),
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const body = createSignInBody(values.userName, values.password);
      const { message, user, token } = await postSignIn(body);
      toastSuccess(message);
      dispatch(
        setLoginUser({
          name: user.name,
          userName: user.userName,
          user_id: user.user_id,
          userToken: token.userToken,
          tokenExpirationTime: token.tokenExpirationTime,
        })
      );
      navigate(Links.home);
    } catch (error) {
      toastError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthView title={intl.formatMessage({ id: 'loginTitle' })}>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ errors, touched }) => (
          <Form>
            <FormField
              name="userName"
              label={intl.formatMessage({ id: 'loginUserNameLabel' })}
              placeholder={intl.formatMessage({ id: 'loginUserNamePlaceholder' })}
              error={touched.userName && Boolean(errors.userName)}
              helperText={touched.userName && errors.userName}
            />

            <PasswordField
              name="password"
              label={intl.formatMessage({ id: 'loginPasswordLabel' })}
              showPassword={showPassword}
              togglePasswordVisibility={() => setShowPassword((prev) => !prev)}
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
            />

            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button loading={loading} type="submit" variant="contained" color="primary" fullWidth>
                {intl.formatMessage({ id: 'loginTitle' })}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </AuthView>
  );
};

export default SignIn;
