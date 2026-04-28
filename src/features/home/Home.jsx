import React from "react";
import { CssBaseline, Divider, Box } from "@mui/material";

import AppTheme from "../../app/theme/AppTheme";
import Hero from "./components/Hero";
import Highlights from "./components/Highlights";

const Home = (props) => {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Box>
        <Hero />
        <Divider />
        <Highlights />
        <Divider />
      </Box>
    </AppTheme>
  );
};

export default Home;
