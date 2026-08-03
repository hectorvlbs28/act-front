import * as React from 'react';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import { alpha } from '@mui/material/styles';
import { outlinedInputClasses, svgIconClasses, toggleButtonGroupClasses, toggleButtonClasses } from '@mui/material';
import { gray, brand, teal } from '../ThemePrimitives';

export const inputsCustomizations = {
  MuiButtonBase: {
    defaultProps: { disableTouchRipple: true, disableRipple: true },
    styleOverrides: {
      root: ({ theme }) => ({
        boxSizing: 'border-box',
        transition: 'all 120ms ease-in',
        '&:focus-visible': {
          outline: `3px solid ${alpha(theme.palette.primary.main, 0.5)}`,
          outlineOffset: '2px',
        },
      }),
    },
  },

  MuiButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        boxShadow: 'none',
        borderRadius: (theme.vars || theme).shape.borderRadius,
        textTransform: 'none',
        fontWeight: 600,
        letterSpacing: 0.2,
        variants: [
          { props: { size: 'small' }, style: { height: '2.25rem', padding: '8px 14px' } },
          { props: { size: 'medium' }, style: { height: '2.5rem', padding: '8px 18px' } },
          {
            props: { color: 'primary', variant: 'contained' },
            style: {
              color: '#ffffff',
              backgroundColor: brand[400],
              backgroundImage: `linear-gradient(160deg, ${brand[300]} 0%, ${brand[500]} 100%)`,
              boxShadow: `0 2px 8px ${alpha(brand[400], 0.35)}`,
              border: `1px solid ${brand[500]}`,
              '&:hover': {
                backgroundImage: 'none',
                backgroundColor: brand[500],
                boxShadow: `0 4px 12px ${alpha(brand[400], 0.45)}`,
              },
              '&:active': { backgroundColor: brand[600] },
              ...theme.applyStyles('dark', {
                backgroundColor: brand[400],
                backgroundImage: `linear-gradient(160deg, ${brand[300]} 0%, ${brand[500]} 100%)`,
                '&:hover': { backgroundColor: brand[300], backgroundImage: 'none' },
              }),
            },
          },
          {
            props: { color: 'secondary', variant: 'contained' },
            style: {
              color: '#ffffff',
              backgroundColor: teal[400],
              backgroundImage: `linear-gradient(160deg, ${teal[300]} 0%, ${teal[500]} 100%)`,
              boxShadow: `0 2px 8px ${alpha(teal[400], 0.35)}`,
              border: `1px solid ${teal[500]}`,
              '&:hover': {
                backgroundImage: 'none',
                backgroundColor: teal[500],
                boxShadow: `0 4px 12px ${alpha(teal[400], 0.45)}`,
              },
              '&:active': { backgroundColor: teal[600] },
            },
          },
          {
            props: { variant: 'outlined' },
            style: {
              color: (theme.vars || theme).palette.text.primary,
              border: '1px solid',
              borderColor: gray[200],
              backgroundColor: alpha(gray[50], 0.3),
              '&:hover': {
                backgroundColor: alpha(brand[50], 0.5),
                borderColor: brand[300],
                color: brand[600],
              },
              '&:active': { backgroundColor: alpha(brand[100], 0.4) },
              ...theme.applyStyles('dark', {
                borderColor: gray[700],
                backgroundColor: alpha(gray[800], 0.5),
                '&:hover': {
                  borderColor: brand[400],
                  backgroundColor: alpha(brand[900], 0.3),
                  color: brand[200],
                },
              }),
            },
          },
          {
            props: { variant: 'text' },
            style: {
              color: gray[600],
              '&:hover': { backgroundColor: alpha(brand[400], 0.06), color: brand[600] },
              '&:active': { backgroundColor: alpha(brand[400], 0.12) },
              ...theme.applyStyles('dark', {
                color: gray[300],
                '&:hover': { backgroundColor: alpha(brand[300], 0.1), color: brand[200] },
              }),
            },
          },
          {
            props: { loading: true },
            style: {
              ...theme.applyStyles('dark', { '& .MuiCircularProgress-root': { color: gray[100] } }),
              ...theme.applyStyles('light', { '& .MuiCircularProgress-root': { color: '#ffffff' } }),
            },
          },
        ],
      }),
    },
  },

  MuiIconButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        boxShadow: 'none',
        borderRadius: (theme.vars || theme).shape.borderRadius,
        textTransform: 'none',
        color: (theme.vars || theme).palette.text.primary,
        //border: '1px solid',
        borderColor: gray[200],
        backgroundColor: alpha(gray[50], 0.5),
        transition: 'all 120ms ease-in',
        '&:hover': {
          backgroundColor: alpha(brand[400], 0.08),
          borderColor: brand[300],
          color: brand[600],
        },
        '&:active': { backgroundColor: alpha(brand[400], 0.15) },
        ...theme.applyStyles('dark', {
          borderColor: gray[700],
          backgroundColor: alpha(gray[800], 0.6),
          color: gray[200],
          '&:hover': {
            backgroundColor: alpha(brand[400], 0.15),
            borderColor: brand[500],
            color: brand[200],
          },
        }),
        variants: [
          {
            props: { size: 'small' },
            style: {
              width: '2rem',
              height: '2rem',
              padding: '0.25rem',
              [`& .${svgIconClasses.root}`]: { fontSize: '1rem' },
            },
          },
          { props: { size: 'medium' }, style: { width: '2.5rem', height: '2.5rem' } },
        ],
      }),
    },
  },

  MuiCheckbox: {
    defaultProps: {
      disableRipple: true,
      icon: <CheckBoxOutlineBlankRoundedIcon sx={{ color: 'hsla(224, 82%, 61%, 0.0)' }} />,
      checkedIcon: <CheckRoundedIcon sx={{ height: 14, width: 14 }} />,
      indeterminateIcon: <RemoveRoundedIcon sx={{ height: 14, width: 14 }} />,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        margin: 10,
        height: 16,
        width: 16,
        borderRadius: 5,
        border: '1px solid',
        borderColor: alpha(gray[300], 0.8),
        backgroundColor: alpha(gray[100], 0.4),
        transition: 'border-color, background-color, 120ms ease-in',
        '&:hover': { borderColor: brand[400] },
        '&.Mui-focusVisible': {
          outline: `3px solid ${alpha(brand[400], 0.5)}`,
          outlineOffset: '2px',
          borderColor: brand[400],
        },
        '&.Mui-checked': {
          color: 'white',
          backgroundColor: brand[400],
          borderColor: brand[400],
          boxShadow: 'none',
          '&:hover': { backgroundColor: brand[500] },
        },
        ...theme.applyStyles('dark', {
          borderColor: alpha(gray[600], 0.8),
          backgroundColor: alpha(gray[800], 0.8),
          '&:hover': { borderColor: brand[300] },
          '&.Mui-checked': { backgroundColor: brand[400], borderColor: brand[400] },
        }),
      }),
    },
  },

  MuiInputBase: {
    styleOverrides: {
      root: { border: 'none' },
      input: { '&::placeholder': { opacity: 0.6, color: gray[400] } },
    },
  },

  MuiTextField: {
    defaultProps: {
      variant: 'outlined',
    },
    styleOverrides: {
      root: ({ theme }) => ({
        '& .MuiInputLabel-root': {
          fontSize: '0.875rem',
          fontWeight: 500,
          color: gray[500],
          transition: 'color 120ms ease-in',
          ...theme.applyStyles('dark', {
            color: gray[400],
          }),
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: brand[400],
          ...theme.applyStyles('dark', {
            color: brand[300],
          }),
        },
        '& .MuiInputLabel-root.Mui-error': {
          color: theme.palette.error.main,
        },
        '& .MuiInputLabel-root.Mui-disabled': {
          color: gray[400],
          ...theme.applyStyles('dark', {
            color: gray[600],
          }),
        },
      }),
    },
  },

  MuiInputLabel: {
    styleOverrides: {
      root: {
        fontSize: '0.875rem',
        fontWeight: 500,
        letterSpacing: 0,
      },
      shrink: {
        fontSize: '0.75rem',
        fontWeight: 500,
        letterSpacing: 0.4,
        transform: 'translate(14px, -9px) scale(1)',
      },
      sizeSmall: {
        fontSize: '0.8125rem',
        transform: 'translate(12px, 8px) scale(1)',
        '&.MuiInputLabel-shrink': {
          transform: 'translate(12px, -9px) scale(1)',
          fontSize: '0.6875rem',
        },
      },
    },
  },

  MuiFormHelperText: {
    styleOverrides: {
      root: ({ theme }) => ({
        fontSize: '0.75rem',
        fontWeight: 400,
        marginTop: '5px',
        marginLeft: '2px',
        color: gray[500],
        letterSpacing: 0,
        '&.Mui-error': {
          color: theme.palette.error.main,
          ...theme.applyStyles('dark', {
            color: theme.palette.error.light,
          }),
        },
        ...theme.applyStyles('dark', {
          color: gray[500],
        }),
      }),
    },
  },

  MuiOutlinedInput: {
    styleOverrides: {
      input: {
        padding: 0,
        fontSize: '0.875rem',
        fontWeight: 400,
        '&::placeholder': {
          opacity: 0.55,
          color: gray[400],
        },
      },

      root: ({ theme }) => ({
        padding: '8px 12px',
        color: (theme.vars || theme).palette.text.primary,
        borderRadius: (theme.vars || theme).shape.borderRadius,
        border: `1px solid ${(theme.vars || theme).palette.divider}`,
        backgroundColor: (theme.vars || theme).palette.background.default,
        transition: 'border-color 120ms ease-in, box-shadow 120ms ease-in, background-color 120ms ease-in',

        '&:hover:not(.Mui-disabled):not(.Mui-error)': {
          borderColor: brand[400],
          backgroundColor: alpha(brand[50], 0.4),
          ...theme.applyStyles('dark', {
            borderColor: brand[500],
            backgroundColor: alpha(brand[900], 0.15),
          }),
        },

        [`&.${outlinedInputClasses.focused}:not(.Mui-error)`]: {
          borderColor: brand[400],
          backgroundColor: (theme.vars || theme).palette.background.default,
          boxShadow: `0 0 0 3px ${alpha(brand[400], 0.14)}`,
          ...theme.applyStyles('dark', {
            borderColor: brand[400],
            backgroundColor: alpha(gray[900], 0.8),
            boxShadow: `0 0 0 3px ${alpha(brand[400], 0.18)}`,
          }),
        },

        '&.Mui-error': {
          borderColor: theme.palette.error.main,
          '&:hover': {
            borderColor: theme.palette.error.dark,
          },
          [`&.${outlinedInputClasses.focused}`]: {
            borderColor: theme.palette.error.main,
            boxShadow: `0 0 0 3px ${alpha(theme.palette.error.main, 0.14)}`,
          },
        },

        '&.Mui-disabled': {
          borderColor: alpha(gray[300], 0.5),
          backgroundColor: alpha(gray[100], 0.5),
          cursor: 'not-allowed',
          '& input': { cursor: 'not-allowed' },
          ...theme.applyStyles('dark', {
            borderColor: alpha(gray[700], 0.5),
            backgroundColor: alpha(gray[800], 0.3),
          }),
        },

        ...theme.applyStyles('dark', {
          backgroundColor: alpha(gray[800], 0.6),
          borderColor: gray[700],
          color: 'hsl(220, 40%, 94%)',
        }),

        variants: [
          {
            props: { size: 'small' },
            style: {
              height: '2.25rem',
              padding: '6px 10px',
            },
          },
          {
            props: { size: 'medium' },
            style: {
              height: '2.75rem',
              padding: '8px 12px',
            },
          },
          {
            props: { multiline: true },
            style: {
              height: 'auto',
              padding: '10px 12px',
              alignItems: 'flex-start',
            },
          },
        ],
      }),

      notchedOutline: { border: 'none' },

      inputMultiline: {
        padding: 0,
        resize: 'vertical',
        minHeight: '4rem',
        lineHeight: 1.6,
      },

      adornedStart: {
        paddingLeft: '10px',
        '& input': { paddingLeft: '6px' },
      },

      adornedEnd: {
        paddingRight: '6px',
      },
    },
  },

  MuiInputAdornment: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: gray[500],
        '& .MuiIconButton-root': {
          padding: '4px',
          marginRight: '-4px',
          border: 'none',
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: alpha(brand[400], 0.08),
            border: 'none',
          },
        },
        ...theme.applyStyles('dark', {
          color: gray[300],
          '& svg': {
            color: gray[300],
            fill: gray[300],
            opacity: 1,
          },
          '& .MuiIconButton-root:hover': {
            backgroundColor: alpha(brand[400], 0.12),
          },
        }),
      }),
    },
  },

  MuiFormControl: {
    styleOverrides: {
      root: {
        '& + &': {
          marginTop: '4px',
        },
      },
    },
  },

  MuiFormLabel: {
    styleOverrides: {
      root: ({ theme }) => ({
        fontSize: '0.8125rem',
        fontWeight: 500,
        color: gray[600],
        marginBottom: '4px',
        ...theme.applyStyles('dark', { color: gray[400] }),
        '&.Mui-focused': {
          color: brand[400],
          ...theme.applyStyles('dark', { color: brand[300] }),
        },
        '&.Mui-error': {
          color: theme.palette.error.main,
        },
      }),
    },
  },

  MuiToggleButtonGroup: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: '10px',
        boxShadow: `0 4px 16px ${alpha(brand[400], 0.15)}`,
        [`& .${toggleButtonGroupClasses.selected}`]: { color: brand[500] },
        ...theme.applyStyles('dark', {
          [`& .${toggleButtonGroupClasses.selected}`]: { color: teal[300] },
          boxShadow: `0 4px 16px ${alpha(brand[700], 0.4)}`,
        }),
      }),
    },
  },

  MuiToggleButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: '10px 16px',
        textTransform: 'none',
        borderRadius: '10px',
        fontWeight: 500,
        ...theme.applyStyles('dark', {
          color: gray[400],
          [`&.${toggleButtonClasses.selected}`]: { color: brand[300] },
        }),
      }),
    },
  },
};
