import { Typography, Stack } from '@mui/material';

const DrawerField = ({ label, children }) => {
  return (
    <Stack spacing={0.75} width="100%">
      <Typography
        variant="overline"
        sx={{
          color: 'text.secondary',
          letterSpacing: '0.08em',
          lineHeight: 1,
        }}
      >
        {label}
      </Typography>
      {children}
    </Stack>
  );
};

export default DrawerField;
