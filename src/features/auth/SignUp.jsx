import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';

import AuthView from './components/AuthView';
import FormField from '../../shared/components/inputs/FormField';
import PasswordField from '../../shared/components/inputs/PasswordField';
import Links from '../../shared/constants/links';
import { postSignUp } from './service/auth.service';
import { createSignUpBody } from '../../shared/utils/request.utils';

const SignUp = () => {
  const intl = useIntl();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [loading] = useState(false);

  const initialValues = { name: '', userName: '', password: '', repeatPassword: '' };

  const validationSchema = Yup.object({
    name: Yup.string().required(intl.formatMessage({ id: 'FieldRequired' })),
    userName: Yup.string().required(intl.formatMessage({ id: 'FieldRequired' })),
    password: Yup.string().required(intl.formatMessage({ id: 'FieldRequired' })),
    repeatPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], intl.formatMessage({ id: 'PasswordsMustMatch' }))
      .required(intl.formatMessage({ id: 'FieldRequired' })),
  });

  const handleSubmit = async (values, { resetForm }) => {
    const body = createSignUpBody(values);
    await postSignUp(body);
    resetForm();
    navigate(Links.home);
  };

  return (
    <AuthView title={intl.formatMessage({ id: 'signUp' })}>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ errors, touched }) => (
          <Form>
            <FormField
              name="name"
              label={intl.formatMessage({ id: 'Name' })}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
            />

            <FormField
              name="userName"
              label={intl.formatMessage({ id: 'loginUserNameLabel' })}
              error={touched.userName && Boolean(errors.userName)}
              helperText={touched.userName && errors.userName}
            />

            <PasswordField
              name="password"
              label={intl.formatMessage({ id: 'Password' })}
              showPassword={showPassword}
              togglePasswordVisibility={() => setShowPassword((p) => !p)}
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
            />

            <PasswordField
              name="repeatPassword"
              label={intl.formatMessage({ id: 'RepeatPassword' })}
              showPassword={showRepeatPassword}
              togglePasswordVisibility={() => setShowRepeatPassword((p) => !p)}
              error={touched.repeatPassword && Boolean(errors.repeatPassword)}
              helperText={touched.repeatPassword && errors.repeatPassword}
            />

            <Box display="flex" mt={2}>
              <Button loading={loading} type="submit" variant="contained" color="primary" fullWidth>
                {intl.formatMessage({ id: 'Submit' })}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </AuthView>
  );
};

export default SignUp;
