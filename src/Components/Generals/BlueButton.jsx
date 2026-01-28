import React from "react";
import { Button, Typography } from "@mui/material";

const BlueButton = ({ text, handleClick }) => {
  return (
    <Button
      onClick={handleClick}
      variant="text"
      size="small"
      sx={{
        padding: 0,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: "hsl(210, 98%, 48%)",
          textDecoration: "underline",
        }}
      >
        {text}
      </Typography>
    </Button>
  );
};

export default BlueButton;
