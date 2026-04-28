import React from "react";
import IconButton from "@mui/material/IconButton";

const CustomIconButton = ({ onClick, icon, sx = {} }) => {
  return (
    <IconButton onClick={onClick} sx={{ border: "none", ...sx }}>
      {icon}
    </IconButton>
  );
};

export default CustomIconButton;
