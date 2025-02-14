import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SteamGame } from "steam-library-scanner";
import { Box, Button, CircularProgress, Grid2, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSettings } from "../context/SettingsContext";
import { steamService } from "../services/steamService";
import GameCard from "./GameCard";

const ScannedGames: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { settings } = useSettings();
  const [games, setGames] = useState<SteamGame[]>([]);
  const [steamGames, setSteamGames] = useState<SteamGame[]>([]);
  const [nonSteamGames, setNonSteamGames] = useState<SteamGame[]>([]);
  const [addingAll, setAddingAll] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(steamService.isLoading);
  }, [steamService.isLoading]);

  const scanSteamGames = async () => {
    if (!settings.steamPath || !settings.steamId) {
      alert(t("scannedGames.steamPathOrIdNotSet"));
      return;
    }
    setLoading(true);
    setAddingAll(true);
    try {
      const { steamGames: loadedSteamGames, nonSteamGames: loadedNonSteamGames } =
        await steamService.scanGames(settings.steamPath, settings.steamId);

      setSteamGames(loadedSteamGames);
      setNonSteamGames(loadedNonSteamGames);
      setGames([...loadedSteamGames, ...loadedNonSteamGames]);
    } catch (error) {
      console.error("Error scanning games:", error);
      alert(`${t("scannedGames.errorScanningGames")}: ${steamService.errorMessage}`);
    } finally {
      setLoading(false);
      setAddingAll(false);
    }
  };

  const addAllGames = async () => {
    // Logique pour ajouter tous les jeux à la liste des jeux sélectionnés
    // Par exemple, enregistrer tous les jeux dans `selectedGames`
  };

  return (
    <Box
      sx={{
        width: "100%",
        padding: 2,
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      {games.length > 0 && (
        <Button variant="contained" color="secondary" onClick={addAllGames} disabled={addingAll}>
          {addingAll ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            t("scannedGames.addAllGames")
          )}
        </Button>
      )}

      {/* Section Jeux Steam */}
      <Typography variant="h4" gutterBottom>
        {t("scannedGames.steamGames")}
      </Typography>
      <Grid2 container spacing={3}>
        {steamGames.length === 0 && !loading && (
          <Typography variant="body1" sx={{ width: "100%", textAlign: "center" }}>
            {t("scannedGames.clickScanGames")}
          </Typography>
        )}
        {steamGames.map((game) => (
          <Grid2 key={game.cmd}>
            <GameCard game={game} />
          </Grid2>
        ))}
      </Grid2>

      {/* Section Jeux Non-Steam */}
      <Typography variant="h4" gutterBottom sx={{ marginTop: 4 }}>
        {t("scannedGames.nonSteamGames")}
      </Typography>
      <Grid2 container spacing={3}>
        {nonSteamGames.length === 0 && !loading && (
          <Typography variant="body1" sx={{ width: "100%", textAlign: "center" }}>
            {t("scannedGames.noNonSteamGames")}
          </Typography>
        )}
        {nonSteamGames.map((game) => (
          <Grid2 key={game.cmd}>
            <GameCard game={game} />
          </Grid2>
        ))}
      </Grid2>

      {/* Bouton Scanner les jeux */}
      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
        <Button variant="contained" color="primary" onClick={scanSteamGames} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : t("scannedGames.scanGames")}
        </Button>
      </Stack>
    </Box>
  );
};

export default ScannedGames;
