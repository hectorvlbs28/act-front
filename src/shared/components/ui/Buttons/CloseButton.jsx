import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

import CustomIconButton from '../CustomIconButton';

const CloseButton = ({ handleClose }) => {
  return <CustomIconButton onClick={handleClose} icon={<CloseIcon fontSize="small" />} />;
};

export default CloseButton;
