import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Alert, Box, IconButton, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { ExportGameConfig, SunshineAppConfig } from "../types";
import { exportedGamesService } from "../services/exportedGamesService";
import AppConfig from "../components/AppConfig";

const EditAppConfigPage = () => {
  const { t } = useTranslation();
  const { uniqueId } = useParams<{ uniqueId: string }>();
  const navigate = useNavigate();
  const [appDetails, setAppDetails] = useState<ExportGameConfig | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchAppsDetails = async () => {
    try {
      const apps = await exportedGamesService.getExportedGames();
      const app = apps.find((a) => a.uniqueId === uniqueId) || null;
      setAppDetails(app);
    } catch (error) {
      console.error("Error fetching apps details:", error);
    }
  };

  useEffect(() => {
    fetchAppsDetails();
  }, [uniqueId]);

  if (!appDetails) {
    return <div>Loading...</div>;
  }

  const handleSave = async (app: SunshineAppConfig) => {
    console.log("app", app);
    const newAppDetails: ExportGameConfig = { ...appDetails, sunshineConfig: app };
    console.log("newAppDetails", newAppDetails);
    try {
      await exportedGamesService.updateExportedGameConfig(appDetails.uniqueId, newAppDetails);
      fetchAppsDetails();
    } catch (err) {
      setErrorMsg(`Error fetching apps: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  };

  return (
    <Box>
      <Box display="inline-flex" gap="16px">
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4">{t("sunshineAppConfig.pageTitle")}</Typography>
      </Box>
      <Alert severity="error" sx={{ display: errorMsg ? "block" : "none" }} />
      <AppConfig appDetails={appDetails.sunshineConfig} onSave={handleSave} />
    </Box>
  );
};

export default EditAppConfigPage;
