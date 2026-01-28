import React from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

const LinkButton = ({ btnLinkTo, btnText, btnColor, btnVariant, btnSize }) => {
  return (
    <Button
      component={Link}
      to={btnLinkTo}
      color={btnColor}
      variant={btnVariant}
      size={btnSize}
      sx={{
        padding: 2,
      }}
    >
      {btnText}
    </Button>
  );
};

export default LinkButton;
