import React, { useState, useMemo } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Typography, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { createNewPassword, updatePassword } from '../service/passwords.service';
import { createNewPasswordBody } from '../../../shared/utils/request.utils';
import { selectPasswordSelected, clearPasswordSelected } from '../store/passwords.slice';
import { PasswordModalTypes } from '../../../shared/constants/enums';
import { TOAST_MESSAGES } from '../../../shared/constants/toastMessages';
import CustomIconButton from '../../../shared/components/ui/CustomIconButton';
import ReusableModal from '../../../shared/components/ui/ReusableModal';
import FormField from '../../../shared/components/inputs/FormField';
import PasswordField from '../../../shared/components/inputs/PasswordField';
import useToast from '../../../hooks/useToast';
import CloseButton from '../../../shared/components/ui/Buttons/CloseButton';

const NewPassModal = ({ handleFetchPasswords }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const { toastError } = useToast();

  const PASSWORD_SELECTED = useSelector(selectPasswordSelected);

  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isEdit = PASSWORD_SELECTED.open && PASSWORD_SELECTED.type === PasswordModalTypes.EDIT;
  const isOpen = PASSWORD_SELECTED.open && (isEdit || PASSWORD_SELECTED.type === PasswordModalTypes.NEW) ? true : false;

  const initialValues = useMemo(
    () =>
      isEdit
        ? {
            name: PASSWORD_SELECTED.name || '',
            description: PASSWORD_SELECTED.description || '',
            password: PASSWORD_SELECTED.pswdDecrypted,
            repeatPassword: PASSWORD_SELECTED.pswdDecrypted,
          }
        : { name: '', description: '', password: '', repeatPassword: '' },
    [isEdit, PASSWORD_SELECTED]
  );

  const validationSchema = Yup.object({
    name: Yup.string().required(intl.formatMessage({ id: 'FieldRequired' })),
    description: Yup.string().required(intl.formatMessage({ id: 'FieldRequired' })),
    password: Yup.string().required(intl.formatMessage({ id: 'FieldRequired' })),
    repeatPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], intl.formatMessage({ id: 'PasswordsMustMatch' }))
      .required(intl.formatMessage({ id: 'FieldRequired' })),
  });

  const handleClose = () => {
    dispatch(clearPasswordSelected());
  };

  const handleSubmit = async (values) => {
    if (isEdit) {
      const noChanges =
        values.name === PASSWORD_SELECTED.name &&
        values.description === PASSWORD_SELECTED.description &&
        values.password === PASSWORD_SELECTED.pswdDecrypted;

      if (noChanges) {
        toastError(TOAST_MESSAGES.passwords.noChanges);
        setLoading(false);
        return;
      }
      await updatePassword(PASSWORD_SELECTED.id, createNewPasswordBody(values));
    } else {
      await createNewPassword(createNewPasswordBody(values));
    }
    handleFetchPasswords(true);
    dispatch(clearPasswordSelected());
  };

  return (
    <ReusableModal open={isOpen} onClose={handleClose}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Typography variant="h6" component="h2">
          <strong>{intl.formatMessage({ id: 'NewPassModalTitle' })}</strong>
        </Typography>
        <CloseButton handleClose={handleClose} />
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
