import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Grid,
  IconButton,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector, useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { createNewPassword, updatePassword } from '../service/passwords.service';
import { createNewPasswordBody } from '../../../shared/utils/request.utils';
import { selectPasswordSelected, clearPasswordSelected } from '../store/passwords.slice';
import { PasswordModalTypes } from '../../../shared/constants/enums';
import { TOAST_MESSAGES } from '../../../shared/constants/toastMessages';
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
  const isOpen = PASSWORD_SELECTED.open && (isEdit || PASSWORD_SELECTED.type === PasswordModalTypes.NEW);

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
    if (!loading) dispatch(clearPasswordSelected());
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (isEdit) {
        const noChanges =
          values.name === PASSWORD_SELECTED.name &&
          values.description === PASSWORD_SELECTED.description &&
          values.password === PASSWORD_SELECTED.pswdDecrypted;

        if (noChanges) {
          toastError(TOAST_MESSAGES.passwords.noChanges);
          return;
        }
        await updatePassword(PASSWORD_SELECTED.id, createNewPasswordBody(values));
      } else {
        await createNewPassword(createNewPasswordBody(values));
      }
      handleFetchPasswords(true);
      dispatch(clearPasswordSelected());
    } catch (error) {
      toastError(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      //onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          backgroundImage: 'none',
        },
      }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched }) => (
          <Form>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                px: 3,
                pt: 2.5,
                pb: 2,
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {intl.formatMessage({
                    id: isEdit
                      ? 'passwords.NewPassModal.EditPassModalTitle'
                      : 'passwords.NewPassModal.NewPassModalTitle',
                  })}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {intl.formatMessage({
                    id: isEdit
                      ? 'passwords.NewPassModal.EditPassModalSubtitle'
                      : 'passwords.NewPassModal.NewPassModalSubtitle',
                  })}
                </Typography>
              </Box>

              <CloseButton
                handleClose={() => {
                  handleClose();
                }}
              />
            </Box>

            <Divider />

            <DialogContent sx={{ px: 3, py: 2.5 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {/* Nombre — ancho completo */}
                <FormField
                  name="name"
                  label={intl.formatMessage({ id: 'Name' })}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />

                {/* Contraseña y confirmar — 2 columnas */}
                <Grid container spacing={1.5}>
                  <Grid item xs={12} sm={6}>
                    <PasswordField
                      name="password"
                      label={intl.formatMessage({ id: 'Password' })}
                      showPassword={showPassword}
                      togglePasswordVisibility={() => setShowPassword((p) => !p)}
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <PasswordField
                      name="repeatPassword"
                      label={intl.formatMessage({ id: 'RepeatPassword' })}
                      showPassword={showRepeatPassword}
                      togglePasswordVisibility={() => setShowRepeatPassword((p) => !p)}
                      error={touched.repeatPassword && Boolean(errors.repeatPassword)}
                      helperText={touched.repeatPassword && errors.repeatPassword}
                    />
                  </Grid>
                </Grid>

                {/* Descripción — ancho completo, multiline */}
                <FormField
                  name="description"
                  label={intl.formatMessage({ id: 'Description' })}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                  rows={4}
                />
              </Box>
            </DialogContent>

            <Divider />

            {/* ── FOOTER ──────────────────────────────────────────────── */}
            <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
              <Button variant="outlined" onClick={handleClose} disabled={loading}>
                {intl.formatMessage({ id: 'Cancel' })}
              </Button>
              <Button type="submit" variant="contained" color="primary" loading={loading}>
                {intl.formatMessage({ id: isEdit ? 'Save' : 'Submit' })}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default NewPassModal;
