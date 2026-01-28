import React from "react";
import { FormLabel, FormControl, TextField } from "@mui/material";

const AuthFormControl = ({
  labelHtmlFor,
  label,
  textfieldError,
  textfieldHelperText,
  textfieldId,
  textfieldType,
  textfieldPlaceholder,
  textfieldAutocomplete
}) => {
  return (
    <FormControl>
      <FormLabel htmlFor={labelHtmlFor}>{label}</FormLabel>

      <TextField
        error={textfieldError}
        helperText={textfieldHelperText}
        id={textfieldId}
        type={textfieldType}
        name={labelHtmlFor}
        placeholder={textfieldPlaceholder}
        autoComplete={textfieldAutocomplete}
        autoFocus
        required
        fullWidth
        variant="outlined"
        color={textfieldError ? "error" : "primary"}
      />
    </FormControl>
  );
};

export default AuthFormControl;
