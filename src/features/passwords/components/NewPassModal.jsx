import React, { useState, useMemo } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Typography, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { createNewPassword, updatePassword } from '../service/passwords.service';
import { createNewPasswordBody } from '../../../shared/utils/request.utils';
import { selectNewPassword, clearNewPassword } from '../store/passwords.slice';
import { PasswordModalTypes } from '../../../shared/constants/enums';
import { TOAST_MESSAGES } from '../../../shared/constants/toastMessages';
import CustomIconButton from '../../../shared/components/ui/CustomIconButton';
import ReusableModal from '../../../shared/components/ui/ReusableModal';
import FormField from '../../../shared/components/inputs/FormField';
import PasswordField from '../../../shared/components/inputs/PasswordField';
import useToast from '../../../hooks/useToast';

const NewPassModal = ({ handleFetchPasswords }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const { toastError } = useToast();

  const NEW_PASSWORD = useSelector(selectNewPassword);

  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isEdit = NEW_PASSWORD.open && NEW_PASSWORD.type === PasswordModalTypes.EDIT;

  const initialValues = useMemo(
    () =>
      isEdit
        ? {
            name: NEW_PASSWORD.name || '',
            description: NEW_PASSWORD.description || '',
            password: NEW_PASSWORD.pswdDecrypted,
            repeatPassword: NEW_PASSWORD.pswdDecrypted,
          }
        : { name: '', description: '', password: '', repeatPassword: '' },
    [isEdit, NEW_PASSWORD]
  );

  const validationSchema = Yup.object({
    name: Yup.string().required(intl.formatMessage({ id: 'FieldRequired' })),
    description: Yup.string().required(intl.formatMessage({ id: 'FieldRequired' })),
    password: Yup.string().required(intl.formatMessage({ id: 'FieldRequired' })),
    repeatPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], intl.formatMessage({ id: 'PasswordsMustMatch' }))
      .required(intl.formatMessage({ id: 'FieldRequired' })),
  });

  const handleCloseModal = () => {
    if (!loading) dispatch(clearNewPassword());
  };

  const handleSubmit = async (values) => {
    if (isEdit) {
      const noChanges =
        values.name === NEW_PASSWORD.name &&
        values.description === NEW_PASSWORD.description &&
        values.password === NEW_PASSWORD.pswdDecrypted;

      if (noChanges) {
        toastError(TOAST_MESSAGES.passwords.noChanges);
        setLoading(false);
        return;
      }
      await updatePassword(NEW_PASSWORD.id, createNewPasswordBody(values));
    } else {
      await createNewPassword(createNewPasswordBody(values));
    }
    handleFetchPasswords(true);
    dispatch(clearNewPassword());
  };

  return (
    <ReusableModal open={NEW_PASSWORD.open} onClose={handleCloseModal}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Typography variant="h6" component="h2">
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
