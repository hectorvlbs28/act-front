import React from "react";
import { Field } from "formik";
import {
  TextField,
  FormControl,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const PasswordField = ({
  name,
  label,
  showPassword,
  togglePasswordVisibility,
  error,
  helperText,
}) => {
  return (
    <FormControl fullWidth margin="normal">
      <Field
        as={TextField}
        name={name}
        label={label}
        type={showPassword ? "text" : "password"}
        error={error}
        helperText={helperText}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={togglePasswordVisibility}
                edge="end"
                size="small"
              >
                {showPassword ? (
                  <VisibilityOff fontSize="small" />
                ) : (
                  <Visibility fontSize="small" />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </FormControl>
  );
};

export default PasswordField;
