import React from "react";
import { FormControl, TextField } from "@mui/material";
import { Field } from "formik";

const FormField = ({ name, label, error, helperText, rows, ...props }) => {
  return (
    <FormControl fullWidth margin="dense">
      <Field
        as={TextField}
        name={name}
        label={label}
        error={error}
        helperText={helperText}
        multiline={rows ? true : false}
        rows={rows}
        variant={rows ? "filled" : "outlined"}
        {...props}
      />
    </FormControl>
  );
};

export default FormField;
