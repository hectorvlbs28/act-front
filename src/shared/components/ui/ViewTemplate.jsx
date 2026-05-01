import React from 'react';
import { styled } from '@mui/material/styles';
import { CssBaseline, Stack, Container, Typography, Box } from '@mui/material';

import AppTheme from '../../../app/theme/AppTheme';

const StackStyled = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  position: 'relative',
  minHeight: '100%',
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(4) },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    ...theme.applyStyles('dark', {
      backgroundImage: 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

const ContainerStyled = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(10),
  display: 'flex',
  flexDirection: 'column',
  alignContent: 'center',
  justifyContent: 'center',
  gap: 6,
  [theme.breakpoints.down('sm')]: { marginTop: theme.spacing(12), gap: 1 },
}));

const ViewTemplate = ({ children, maxWidth }) => {
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <StackStyled>
        <ContainerStyled maxWidth={maxWidth ? 'xl' : maxWidth}>{children}</ContainerStyled>
      </StackStyled>
    </AppTheme>
  );
};

export default ViewTemplate;
