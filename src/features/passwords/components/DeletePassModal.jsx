import React from 'react';
import { Dialog, DialogContent, DialogActions, Box, Typography, Button, IconButton } from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { useSelector, useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import { selectPasswordSelected, clearPasswordSelected, fetchDeletePasswordById } from '../store/passwords.slice';
import { PasswordModalTypes } from '../../../shared/constants/enums';
import { TOAST_MESSAGES } from '../../../shared/constants/toastMessages';
import CustomIconButton from '../../../shared/components/ui/CustomIconButton';
import ReusableModal from '../../../shared/components/ui/ReusableModal';
import CloseButton from '../../../shared/components/ui/Buttons/CloseButton';
import ColorButton from '../../../shared/components/ui/Buttons/ColorButton';

const DeletePassModal = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const PASSWORD_SELECTED = useSelector(selectPasswordSelected);
  const isOpen = PASSWORD_SELECTED.open && PASSWORD_SELECTED.type === PasswordModalTypes.DELETE ? true : false;

  const handleClose = () => dispatch(clearPasswordSelected());

  const handleDelete = () => {
    dispatch(fetchDeletePasswordById({ id: PASSWORD_SELECTED.id }));
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => handleClose()}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'error.main',
          backgroundImage: 'none',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          pt: 1.5,
          pr: 1.5,
        }}
      >
        <CloseButton handleClose={handleClose} />
      </Box>

      <DialogContent sx={{ pt: 0, px: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, textAlign: 'center' }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(211, 47, 47, 0.15)' : 'rgba(211, 47, 47, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <WarningAmberRoundedIcon sx={{ fontSize: 28, color: 'error.main' }} />
          </Box>

          <Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {intl.formatMessage({ id: 'deletePasswordTitle' })}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              {intl.formatMessage(
                { id: 'deletePasswordMessage' },
                {
                  name: (
                    <Typography component="span" variant="body2" fontWeight={600} color="text.primary">
                      {PASSWORD_SELECTED.name}
                    </Typography>
                  ),
                }
              )}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button fullWidth variant="outlined" onClick={handleClose}>
          {intl.formatMessage({ id: 'Cancel' })}
        </Button>
        <ColorButton text={intl.formatMessage({ id: 'deletePasswordConfirm' })} handleClick={handleDelete} />
      </DialogActions>
    </Dialog>
  );
};

export default DeletePassModal;
