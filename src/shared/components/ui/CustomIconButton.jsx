import React from 'react';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';

const CustomIconButton = ({ onClick, icon, text }) => {
  if (text) {
    return (
      <Button onClick={onClick} startIcon={icon} variant="contained" color="primary">
        {text}
      </Button>
    );
  }

  return (
    <IconButton
      size="small"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {icon}
    </IconButton>
  );
};

export default CustomIconButton;
