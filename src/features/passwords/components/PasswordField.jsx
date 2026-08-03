import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { OutlinedInput, InputAdornment, IconButton, Tooltip } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

import useToast from '../../../Hooks/useToast';
import { selectPasswordSelected } from '../store/passwords.slice';
import { TOAST_MESSAGES } from '../../../shared/constants/toastMessages';

const PasswordField = () => {
  const { toastSuccess, toastError } = useToast();
  const PASSWORD_SELECTED = useSelector(selectPasswordSelected);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PASSWORD_SELECTED.pswdDecrypted);
      setCopied(true);
      toastSuccess(TOAST_MESSAGES.auth.copySuccess);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toastError(TOAST_MESSAGES.auth.copyError);
    }
  };

  return (
    <OutlinedInput
      value={PASSWORD_SELECTED.pswdDecrypted}
      type={showPassword ? 'text' : 'password'}
      disabled
      fullWidth
      size="small"
      sx={{
        fontFamily: "'Courier New', monospace",
        fontSize: '0.875rem',
        '&.Mui-disabled': {
          color: 'text.primary',
          WebkitTextFillColor: 'unset',
          borderColor: 'divider',
          backgroundColor: 'background.default',
          opacity: 1,
        },
      }}
      endAdornment={
        <InputAdornment position="end">
          <Tooltip title={showPassword ? 'Ocultar' : 'Mostrar'}>
            <IconButton size="small" onClick={() => setShowPassword((prev) => !prev)} sx={{ color: 'text.secondary' }}>
              {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
            </IconButton>
          </Tooltip>

          <Tooltip title={copied ? 'Copiado' : 'Copiar'}>
            <IconButton
              size="small"
              onClick={handleCopy}
              sx={{
                color: copied ? 'success.main' : 'text.secondary',
                transition: 'color 200ms ease',
              }}
            >
              {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </InputAdornment>
      }
    />
  );
};

export default PasswordField;
