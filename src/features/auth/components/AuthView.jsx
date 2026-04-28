import React from "react";
import { CssBaseline, Typography, Box } from "@mui/material";

import AppTheme from "../../../app/theme/AppTheme";
import AuthContainer from "./AuthContainer";
import CustomCard from "./CustomCard";

const AuthView = ({ title, children }) => {
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <AuthContainer direction="column" justifyContent="space-between">
        <CustomCard variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{
              width:     "100%",
              fontSize:  "clamp(2rem, 10vw, 2.15rem)",
              textAlign: "center",
            }}
          >
            {title}
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {children}
          </Box>
        </CustomCard>
      </AuthContainer>
    </AppTheme>
  );
};

export default AuthView;
