import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Alert, Box, IconButton, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { GameToExportConfig, SunshineAppConfig } from "../types";
import AppConfig from "../components/AppConfig";
import { GamesToExportClient } from "../services/gamesToExportClient";

const EditAppConfigPage = () => {
  const { t } = useTranslation();
  const { uniqueId } = useParams<{ uniqueId: string }>();
  const navigate = useNavigate();
  const [appDetails, setAppDetails] = useState<GameToExportConfig | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchAppsDetails = async () => {
    try {
      const gamesToExportResponse = await GamesToExportClient.getGamesToExport();
      if (gamesToExportResponse.success && gamesToExportResponse.data) {
        console.log("Exported games", gamesToExportResponse);
        const app = gamesToExportResponse.data.find((a) => a.uniqueId === uniqueId) || null;
        setAppDetails(app);
      } else {
        console.error("Invalid response structure", gamesToExportResponse);
      }
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
    const newAppDetails: GameToExportConfig = { ...appDetails, sunshineConfig: app };
    console.log("newAppDetails", newAppDetails);
    try {
      const updateGameToExportConfigResponse = await GamesToExportClient.updateGameToExportConfig(
        appDetails.uniqueId,
        newAppDetails,
      );
      if (updateGameToExportConfigResponse.success) {
        fetchAppsDetails();
      } else {
        setErrorMsg("Failed to update app");
      }
    } catch (error) {
      setErrorMsg(
        `Error updating app: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
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
