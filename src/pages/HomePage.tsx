import React, { useState } from "react";
import { Button, Grid2, Typography, Container, CircularProgress, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import type { SteamGame } from "steam-library-scanner";
import GameCard from "../components/GameCard";
import { useSettings } from "../context/SettingsContext";

const HomePage: React.FC = () => {
  const { settings } = useSettings();
  const [games, setGames] = useState<SteamGame[]>([]);
  const [steamGames, setSteamGames] = useState<SteamGame[]>([]);
  const [nonSteamGames, setNonSteamGames] = useState<SteamGame[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [addingAll, setAddingAll] = useState<boolean>(false);
  const { t } = useTranslation();
  const theme = useTheme();

  // Function to scan Steam games
  const scanSteamGames = async () => {
    if (!settings.steamPath || !settings.steamId) {
      alert(t("home.steamPathOrIdNotSet"));
      return;
    }

    setLoading(true);
    try {
      const { steamGames: loadedSteamGame, nonSteamGames: loadedNonSteamGames } =
        await window.electronSteamLibraryScannerApi.getAllSteamGames(
          settings.steamPath,
          settings.steamId,
        );

      await window.electronGameStorageApi.addSteamGame(loadedSteamGame[0]);
      console.log(await window.electronGameStorageApi.getAllGames());

      setSteamGames(loadedSteamGame);
      // gameService.addGame(loadedSteamGame[0]);
      setNonSteamGames(loadedNonSteamGames);
      setGames([...loadedSteamGame, ...loadedNonSteamGames]);
      setLoading(false);
    } catch (error: any) {
      console.error("Error scanning games:", error);
      alert(`${t("home.errorScanningGames")}: ${error.message}`);
      setLoading(false);
    }
  };

  // Function to add all games to Sunshine
  const addAllGames = async () => {
    setAddingAll(true);
    try {
      console.log("Starting to add games:", games.length);

      // Crée un tableau de promesses
      const promises = games.map((game, index) => {
        console.log(`Adding game ${index + 1}/${games.length}:`, game.name);

        return window.electron
          .addToSunshine({
            name: game.name,
            cmd: `steam://rungameid/454645`,
            detached: true,
            working_dir: "game.path",
          })
          .then((result: any) => {
            if (!result.success) {
              throw new Error(`Failed to add ${game.name}: ${result.error}`);
            }
            console.log(`Successfully added ${game.name}`);
          });
      });

      // Attends toutes les promesses en parallèle
      await Promise.all(promises);

      alert(`${t("home.successAddedGames")} ${games.length} ${t("home.gamesToSunshine")}`);
    } catch (error: any) {
      console.error("Error adding games:", error);
      alert(`${t("home.errorAfterAdding")} ${games.length} ${t("home.games")}: ${error.message}`);
    } finally {
      setAddingAll(false);
    }
  };

  return (
    <Container
      sx={{
        width: "100%",
        padding: 2,
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      {games.length > 0 && (
        <Button variant="contained" color="secondary" onClick={addAllGames} disabled={addingAll}>
          {addingAll ? <CircularProgress size={24} color="inherit" /> : t("home.addAllGames")}
        </Button>
      )}
      {/* Section Jeux Steam */}
      <Typography variant="h4" gutterBottom>
        {t("home.steamGames")}
      </Typography>
      <Grid2 container spacing={3}>
        {steamGames.length === 0 && !loading && (
          <Typography variant="body1" sx={{ width: "100%", textAlign: "center" }}>
            {t("home.clickScanGames")}
          </Typography>
        )}
        {steamGames.map((game) => (
          <GameCard key={game.cmd} game={game} />
        ))}
      </Grid2>

      {/* Section Jeux Non-Steam */}
      <Typography variant="h4" gutterBottom sx={{ marginTop: 4 }}>
        {t("home.nonSteamGames")}
      </Typography>
      <Grid2 container spacing={3}>
        {nonSteamGames.length === 0 && !loading && (
          <Typography variant="body1" sx={{ width: "100%", textAlign: "center" }}>
            {t("home.noNonSteamGames")}
          </Typography>
        )}
        {nonSteamGames.map((game) => (
          <GameCard key={game.cmd} game={game} />
        ))}
      </Grid2>

      {/* Bouton Scanner les jeux */}
      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
        <Button variant="contained" color="primary" onClick={scanSteamGames} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : t("home.scanGames")}
        </Button>
      </Stack>
    </Container>
  );
};

export default HomePage;
