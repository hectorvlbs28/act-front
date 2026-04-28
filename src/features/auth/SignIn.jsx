import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';

import AuthView from './components/AuthView';
import FormField from '../../shared/components/inputs/FormField';
import PasswordField from '../../shared/components/inputs/PasswordField';
import Links from '../../shared/constants/links';
import { postSignIn } from './service/auth.service';
import { createSignInBody } from '../../shared/utils/request.utils';
import { setLoginUser } from './store/auth.slice';

const SignIn = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [loading] = useState(false);

  const initialValues = { userName: '', password: '' };

  const validationSchema = Yup.object({
    userName: Yup.string().required(intl.formatMessage({ id: 'FieldRequired' })),
    password: Yup.string().required(intl.formatMessage({ id: 'FieldRequired' })),
  });

  const handleSubmit = async (values) => {
    const body = createSignInBody(values.userName, values.password);
    const { user, token } = await postSignIn(body);
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
              togglePasswordVisibility={() => setShowPassword((p) => !p)}
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
            />

            <Box display="flex" mt={2}>
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
