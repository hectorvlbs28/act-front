import React from 'react';
import { Button } from '@mui/material';

const ColorButton = ({ color, text, handleClick }) => {
  return (
    <Button
      fullWidth
      variant="contained"
      color={color || 'error'}
      onClick={(e) => {
        e.preventDefault();
        handleClick();
      }}
    >
      {text}
    </Button>
  );
};

export default ColorButton;
