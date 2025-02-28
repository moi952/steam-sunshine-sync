import React, { useEffect } from "react";
import { Box, Typography, Container, Button, Paper, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSettings } from "../context/SettingsContext";

const HomePage: React.FC = () => {
  const { settings, isLoading } = useSettings();
  const { t } = useTranslation();

  useEffect(() => {
    console.log("firstLaunch : ", settings.firstLaunch);
  }, [settings]);

  if (isLoading) {
    return (
      <Container
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          {t("homePage.welcome", { appName: "Steam sunshine sync" })}
        </Typography>
        {settings.firstLaunch && (
          <>
            <Typography variant="body1" align="center" gutterBottom>
              {t("homePage.configBeforeScan")}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Button variant="contained" color="primary" component={Link} to="/settings">
                {t("homePage.goToSettings")}
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default HomePage;
