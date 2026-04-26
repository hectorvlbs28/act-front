import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Box, Typography, TextField, Button, FormControl, IconButton, InputAdornment } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import { createNewPassword, updatePassword } from '../../Services/passwordsService';
import { createNewPasswordBody } from '../../Utils/createBodys';
import { selectNewPassword, clearNewPassword } from '../../Redux/passwords.Slice';
import { PasswordModalTypes } from '../../Utils/Enums';
import CustomIconButton from '../Generals/CustomIconButton';
import ReusableModal from '../Generals/ReusableModal';
import FormField from '../Inputs/FormField';
import PasswordField from '../Inputs/PasswordField';

const NewPassModal = ({ handleToastError, handleFetchPasswords }) => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const NEW_PASSWORD = useSelector(selectNewPassword);

  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const initialValues =
    NEW_PASSWORD.open && NEW_PASSWORD.type === PasswordModalTypes.EDIT
      ? {
          name: NEW_PASSWORD.name || '',
          description: NEW_PASSWORD.description || '',
          password: NEW_PASSWORD.pswdDecrypted,
          repeatPassword: NEW_PASSWORD.pswdDecrypted,
        }
      : { name: '', description: '', password: '', repeatPassword: '' };

  const handleCloseModal = () => {
    if (!loading) {
      dispatch(clearNewPassword());
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleRepeatPasswordVisibility = () => {
    setShowRepeatPassword((prev) => !prev);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (NEW_PASSWORD.open && NEW_PASSWORD.type === PasswordModalTypes.EDIT) {
        if (
          values.name === NEW_PASSWORD.name &&
          values.description === NEW_PASSWORD.description &&
          values.password === NEW_PASSWORD.pswdDecrypted
        ) {
          handleToastError(intl.formatMessage({ id: 'PasswordNotChangesError' }));
          setLoading(false);
          return;
        }

        const body = createNewPasswordBody(values);
        await updatePassword(NEW_PASSWORD.id, body);
        handleFetchPasswords(true);
        dispatch(clearNewPassword());
        setLoading(false);
      } else {
        const body = createNewPasswordBody(values);
        await createNewPassword(body);
        handleFetchPasswords(true);
        dispatch(clearNewPassword());
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      handleToastError(error.response.data.message);
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(intl.formatMessage({ id: 'FieldRequired' })),
    description: Yup.string().required(intl.formatMessage({ id: 'FieldRequired' })),
    password: Yup.string().required(intl.formatMessage({ id: 'FieldRequired' })),
    repeatPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], intl.formatMessage({ id: 'PasswordsMustMatch' }))
      .required(intl.formatMessage({ id: 'FieldRequired' })),
  });

  return (
    <ReusableModal open={NEW_PASSWORD.open} onClose={handleCloseModal}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Typography id="modal-NewPassModalTitle-title" variant="h6" component="h2">
          <strong>{intl.formatMessage({ id: 'NewPassModalTitle' })}</strong>
        </Typography>

        <CustomIconButton onClick={handleCloseModal} icon={<CloseIcon fontSize="small" />} />
      </Box>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched }) => (
          <Form>
            <FormField
              name="name"
              label={intl.formatMessage({ id: 'Name' })}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
            />

            <PasswordField
              name="password"
              label={intl.formatMessage({ id: 'Password' })}
              showPassword={showPassword}
              togglePasswordVisibility={togglePasswordVisibility}
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
            />

            <PasswordField
              name="repeatPassword"
              label={intl.formatMessage({ id: 'RepeatPassword' })}
              showPassword={showRepeatPassword}
              togglePasswordVisibility={toggleRepeatPasswordVisibility}
              error={touched.repeatPassword && Boolean(errors.repeatPassword)}
              helperText={touched.repeatPassword && errors.repeatPassword}
            />

            <FormField
              name="description"
              label={intl.formatMessage({ id: 'Description' })}
              error={touched.description && Boolean(errors.description)}
              helperText={touched.description && errors.description}
              rows={6}
            />

            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button loading={loading} type="submit" variant="contained" color="primary">
                {intl.formatMessage({ id: 'Submit' })}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </ReusableModal>
  );
};

export default NewPassModal;
