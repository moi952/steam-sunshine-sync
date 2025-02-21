import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Alert, Box, IconButton, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { ScannedGamesConfig, SunshineAppConfig } from "../types";
import AppConfig from "../components/AppConfig";
import { initSunshineAppFromScannedGame } from "../utils/sunshineAppHelper";
import { exportedGamesService } from "../services/exportedGamesService";
import ScannedGamesClient from "../services/scannedGamesClient";

const CreateAppConfigPage = () => {
  const { t } = useTranslation();
  const { scannedGameId } = useParams<{ scannedGameId: string }>();
  const navigate = useNavigate();
  const [sunshineConfig, setSunshineConfig] = useState<SunshineAppConfig | null>(null);
  const [scannedGame, setScannedGame] = useState<ScannedGamesConfig | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function fetchExportedGame() {
    console.log("scannedGameId", scannedGameId);
    if (scannedGameId !== undefined) {
      try {
        const loadedScannedGameResponse =
          await ScannedGamesClient.getScannedGameById(scannedGameId);

        // Check if the success flag is true
        if (!loadedScannedGameResponse.success) {
          setErrorMsg("Scanned game not found or failed to fetch");
          return;
        }

        if (!loadedScannedGameResponse.data) {
          setErrorMsg("Scanned game not found or failed to fetch");
          return;
        }

        // If success is true, proceed with the game
        setScannedGame(loadedScannedGameResponse.data);

        // Initialize the app from the scanned game
        const newApp = initSunshineAppFromScannedGame(loadedScannedGameResponse.data);
        setSunshineConfig(newApp);
      } catch (error) {
        console.error("Error fetching exported game", error);
        setErrorMsg("Error retrieving the exported game");
      }
    } else {
      setErrorMsg("No scannedGameId provided");
    }
  }

  useEffect(() => {
    fetchExportedGame();
  }, [scannedGameId]);

  const handleSave = async (app: SunshineAppConfig) => {
    const newAppDetails: SunshineAppConfig = app;
    const exportedGame = exportedGamesService.createExportedGameConfig(
      newAppDetails,
      scannedGame!.gameDetails,
      scannedGame?.uniqueId,
    );

    console.log("exportedGame: ", exportedGame);
    if ((await exportedGame).uniqueId) navigate(-1);
  };

  return (
    <Box>
      <Box display="inline-flex" gap="16px">
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4">{t("sunshineAppConfig.pageTitle")}</Typography>
      </Box>
      {sunshineConfig && <AppConfig appDetails={sunshineConfig} onSave={handleSave} />}
      {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
    </Box>
  );
};

export default CreateAppConfigPage;
