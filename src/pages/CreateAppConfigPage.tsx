import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Alert, Box, IconButton, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { ScannedGamesConfig, SunshineAppConfig } from "../types";
import AppConfig from "../components/AppConfig";
import { initSunshineAppFromScannedGame } from "../utils/sunshineAppHelper";
import { scannedGamesService } from "../services/scannedGamesService";
import { exportedGamesService } from "../services/exportedGamesService";

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
        const loadedScannedGame = await scannedGamesService.getScannedGameById(scannedGameId);
        if (!loadedScannedGame) {
          setErrorMsg("Jeu scanné introuvable");
          return;
        }
        setScannedGame(loadedScannedGame);
        // Ici, vous pouvez utiliser scannedGame pour initialiser le formulaire
        const newApp = initSunshineAppFromScannedGame(loadedScannedGame);
        setSunshineConfig(newApp);
      } catch (error) {
        console.error("Erreur lors de la récupération du jeu exporté", error);
        setErrorMsg("Erreur lors de la récupération du jeu exporté");
      }
    } else {
      setErrorMsg("Aucun scannedGameId fourni");
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
