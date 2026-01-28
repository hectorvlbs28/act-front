import React from "react";
import { CssBaseline, Divider, Box } from "@mui/material";
import AppTheme from "../Theme/AppTheme";
import Hero from "../Components/Generals/Hero";
import Highlights from "../Components/Highlights";

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
