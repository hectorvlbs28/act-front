import React from 'react';
import Grid from '@mui/material/Grid';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';
import { useIntl } from 'react-intl';
import { Typography, Stack, Container, Card, Box } from '@mui/material';

const HighlightItem = React.memo(({ icon, title }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Stack
      direction="column"
      align="center"
      component={Card}
      spacing={1}
      useFlexGap
      sx={{
        color: 'inherit',
        p: 3,
        height: '100%',
        borderColor: 'hsla(220, 25%, 25%, 0.3)',
        backgroundColor: 'grey.800',
      }}
    >
      <Box sx={{ opacity: '50%' }}>{icon}</Box>
      <Box>
        <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
          {title}
        </Typography>
      </Box>
    </Stack>
  </Grid>
));

const Highlights = () => {
  const intl = useIntl();

  const ITEMS = [
    {
      icon: <SettingsSuggestRoundedIcon />,
      title: intl.formatMessage({ id: 'flexibleManagement' }),
    },
    {
      icon: <ConstructionRoundedIcon />,
      title: intl.formatMessage({ id: 'designedToLast' }),
    },
    {
      icon: <ThumbUpAltRoundedIcon />,
      title: intl.formatMessage({ id: 'intuitiveExperience' }),
    },
    {
      icon: <AutoFixHighRoundedIcon />,
      title: intl.formatMessage({ id: 'smartAutomation' }),
    },
    {
      icon: <SupportAgentRoundedIcon />,
      title: intl.formatMessage({ id: 'reliableSupport' }),
    },
    {
      icon: <QueryStatsRoundedIcon />,
      title: intl.formatMessage({ id: 'detailedTracking' }),
    },
  ];

  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: 'white',
        bgcolor: 'grey.900',
      }}
    >
      <Container
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Grid container spacing={2}>
          {ITEMS.map((item, index) => (
            <HighlightItem key={index} icon={item.icon} title={item.title} />
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Highlights;
