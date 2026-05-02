import { Paper, Typography } from '@mui/material';

const ReadOnlyText = ({ value = '' }) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: 'background.default',
        borderColor: 'divider',
        minHeight: 80,
        width: '100%',
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
        {value}
      </Typography>
    </Paper>
  );
};

export default ReadOnlyText;
