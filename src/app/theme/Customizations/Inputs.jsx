import * as React from "react";
import CheckBoxOutlineBlankRoundedIcon from "@mui/icons-material/CheckBoxOutlineBlankRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import { alpha } from "@mui/material/styles";
import { outlinedInputClasses, svgIconClasses, toggleButtonGroupClasses, toggleButtonClasses } from "@mui/material";
import { gray, brand, teal } from "../ThemePrimitives";

export const inputsCustomizations = {
  MuiButtonBase: {
    defaultProps: { disableTouchRipple: true, disableRipple: true },
    styleOverrides: {
      root: ({ theme }) => ({
        boxSizing: "border-box",
        transition: "all 120ms ease-in",
        "&:focus-visible": {
          outline: `3px solid ${alpha(theme.palette.primary.main, 0.5)}`,
          outlineOffset: "2px",
        },
      }),
    },
  },

  MuiButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        boxShadow: "none",
        borderRadius: (theme.vars || theme).shape.borderRadius,
        textTransform: "none",
        fontWeight: 600,
        letterSpacing: 0.2,
        variants: [
          { props: { size: "small" },  style: { height: "2.25rem", padding: "8px 14px" } },
          { props: { size: "medium" }, style: { height: "2.5rem",  padding: "8px 18px" } },
          {
            props: { color: "primary", variant: "contained" },
            style: {
              color: "#ffffff",
              backgroundColor: brand[400],
              backgroundImage: `linear-gradient(160deg, ${brand[300]} 0%, ${brand[500]} 100%)`,
              boxShadow: `0 2px 8px ${alpha(brand[400], 0.35)}`,
              border: `1px solid ${brand[500]}`,
              "&:hover": {
                backgroundImage: "none",
                backgroundColor: brand[500],
                boxShadow: `0 4px 12px ${alpha(brand[400], 0.45)}`,
              },
              "&:active": { backgroundColor: brand[600] },
              ...theme.applyStyles("dark", {
                backgroundColor: brand[400],
                backgroundImage: `linear-gradient(160deg, ${brand[300]} 0%, ${brand[500]} 100%)`,
                "&:hover": { backgroundColor: brand[300], backgroundImage: "none" },
              }),
            },
          },
          {
            props: { color: "secondary", variant: "contained" },
            style: {
              color: "#ffffff",
              backgroundColor: teal[400],
              backgroundImage: `linear-gradient(160deg, ${teal[300]} 0%, ${teal[500]} 100%)`,
              boxShadow: `0 2px 8px ${alpha(teal[400], 0.35)}`,
              border: `1px solid ${teal[500]}`,
              "&:hover": {
                backgroundImage: "none",
                backgroundColor: teal[500],
                boxShadow: `0 4px 12px ${alpha(teal[400], 0.45)}`,
              },
              "&:active": { backgroundColor: teal[600] },
            },
          },
          {
            props: { variant: "outlined" },
            style: {
              color: (theme.vars || theme).palette.text.primary,
              border: "1px solid",
              borderColor: gray[200],
              backgroundColor: alpha(gray[50], 0.3),
              "&:hover": {
                backgroundColor: alpha(brand[50], 0.5),
                borderColor: brand[300],
                color: brand[600],
              },
              "&:active": { backgroundColor: alpha(brand[100], 0.4) },
              ...theme.applyStyles("dark", {
                borderColor: gray[700],
                backgroundColor: alpha(gray[800], 0.5),
                "&:hover": {
                  borderColor: brand[400],
                  backgroundColor: alpha(brand[900], 0.3),
                  color: brand[200],
                },
              }),
            },
          },
          {
            props: { variant: "text" },
            style: {
              color: gray[600],
              "&:hover": { backgroundColor: alpha(brand[400], 0.06), color: brand[600] },
              "&:active": { backgroundColor: alpha(brand[400], 0.12) },
              ...theme.applyStyles("dark", {
                color: gray[300],
                "&:hover": { backgroundColor: alpha(brand[300], 0.1), color: brand[200] },
              }),
            },
          },
          {
            props: { loading: true },
            style: {
              ...theme.applyStyles("dark",  { "& .MuiCircularProgress-root": { color: gray[100] } }),
              ...theme.applyStyles("light", { "& .MuiCircularProgress-root": { color: "#ffffff" } }),
            },
          },
        ],
      }),
    },
  },

  MuiIconButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        boxShadow: "none",
        borderRadius: (theme.vars || theme).shape.borderRadius,
        textTransform: "none",
        color: (theme.vars || theme).palette.text.primary,
        border: "1px solid",
        borderColor: gray[200],
        backgroundColor: alpha(gray[50], 0.5),
        transition: "all 120ms ease-in",
        "&:hover": {
          backgroundColor: alpha(brand[400], 0.08),
          borderColor: brand[300],
          color: brand[600],
        },
        "&:active": { backgroundColor: alpha(brand[400], 0.15) },
        ...theme.applyStyles("dark", {
          borderColor: gray[700],
          backgroundColor: alpha(gray[800], 0.6),
          color: gray[200],
          "&:hover": {
            backgroundColor: alpha(brand[400], 0.15),
            borderColor: brand[500],
            color: brand[200],
          },
        }),
        variants: [
          {
            props: { size: "small" },
            style: { width: "2rem", height: "2rem", padding: "0.25rem", [`& .${svgIconClasses.root}`]: { fontSize: "1rem" } },
          },
          { props: { size: "medium" }, style: { width: "2.5rem", height: "2.5rem" } },
        ],
      }),
    },
  },

  MuiCheckbox: {
    defaultProps: {
      disableRipple: true,
      icon: <CheckBoxOutlineBlankRoundedIcon sx={{ color: "hsla(224, 82%, 61%, 0.0)" }} />,
      checkedIcon: <CheckRoundedIcon sx={{ height: 14, width: 14 }} />,
      indeterminateIcon: <RemoveRoundedIcon sx={{ height: 14, width: 14 }} />,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        margin: 10, height: 16, width: 16, borderRadius: 5,
        border: "1px solid",
        borderColor: alpha(gray[300], 0.8),
        backgroundColor: alpha(gray[100], 0.4),
        transition: "border-color, background-color, 120ms ease-in",
        "&:hover": { borderColor: brand[400] },
        "&.Mui-focusVisible": {
          outline: `3px solid ${alpha(brand[400], 0.5)}`,
          outlineOffset: "2px",
          borderColor: brand[400],
        },
        "&.Mui-checked": {
          color: "white",
          backgroundColor: brand[400],
          borderColor: brand[400],
          boxShadow: "none",
          "&:hover": { backgroundColor: brand[500] },
        },
        ...theme.applyStyles("dark", {
          borderColor: alpha(gray[600], 0.8),
          backgroundColor: alpha(gray[800], 0.8),
          "&:hover": { borderColor: brand[300] },
          "&.Mui-checked": { backgroundColor: brand[400], borderColor: brand[400] },
        }),
      }),
    },
  },

  MuiInputBase: {
    styleOverrides: {
      root:  { border: "none" },
      input: { "&::placeholder": { opacity: 0.6, color: gray[400] } },
    },
  },

  MuiOutlinedInput: {
    styleOverrides: {
      input: { padding: 0 },
      root: ({ theme }) => ({
        padding: "8px 12px",
        color: (theme.vars || theme).palette.text.primary,
        borderRadius: (theme.vars || theme).shape.borderRadius,
        border: `1px solid ${(theme.vars || theme).palette.divider}`,
        backgroundColor: (theme.vars || theme).palette.background.default,
        transition: "border 120ms ease-in, box-shadow 120ms ease-in",
        "&:hover": { borderColor: brand[400] },
        [`&.${outlinedInputClasses.focused}`]: {
          outline: `3px solid ${alpha(brand[400], 0.3)}`,
          borderColor: brand[400],
          boxShadow: `0 0 0 3px ${alpha(brand[400], 0.12)}`,
        },
        ...theme.applyStyles("dark", {
          backgroundColor: alpha(gray[800], 0.8),
          "&:hover": { borderColor: brand[400] },
          [`&.${outlinedInputClasses.focused}`]: {
            outline: `3px solid ${alpha(brand[400], 0.25)}`,
            borderColor: brand[400],
          },
        }),
        variants: [
          { props: { size: "small" },  style: { height: "2.25rem" } },
          { props: { size: "medium" }, style: { height: "2.5rem" } },
        ],
      }),
      notchedOutline: { border: "none" },
    },
  },

  MuiInputAdornment: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: (theme.vars || theme).palette.grey[500],
        ...theme.applyStyles("dark", { color: (theme.vars || theme).palette.grey[400] }),
      }),
    },
  },

  MuiFormLabel: {
    styleOverrides: {
      root: ({ theme }) => ({
        typography: theme.typography.caption,
        fontWeight: 500,
        color: gray[600],
        ...theme.applyStyles("dark", { color: gray[400] }),
      }),
    },
  },
};
