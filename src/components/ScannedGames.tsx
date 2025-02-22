import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SteamGame } from "steam-library-scanner";
import { Alert, Box, Button, CircularProgress, Grid2, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { v4 as uuidv4 } from "uuid";
import { useSettings } from "../context/SettingsContext";
import { steamService } from "../services/steamService";
import ScannedGamesClient from "../services/scannedGamesClient";
import GameCard, { gameStatus } from "./GameCard";
import { ScannedGamesConfig } from "../types";

// Extend SteamGame with a syncStatus property
interface LabeledSteamGame extends SteamGame {
  syncStatus?: gameStatus;
}

const ScannedGames: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { settings } = useSettings();

  const [steamGames, setSteamGames] = useState<LabeledSteamGame[]>([]);
  const [nonSteamGames, setNonSteamGames] = useState<LabeledSteamGame[]>([]);
  const [removedGames, setRemovedGames] = useState<SteamGame[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const steamCrendentialIsNotSet = !settings.steamPath || !settings.steamId;

  // Load saved games from scannedGames storage on component mount
  const loadSavedGames = async () => {
    try {
      const savedGamesConfig = await ScannedGamesClient.getScannedGames();
      console.log("savedGamesConfig : ", savedGamesConfig);
      // Map saved games to LabeledSteamGame (using gameDetails)
      const savedGames: LabeledSteamGame[] = savedGamesConfig.data.map((config) => ({
        ...config.gameDetails,
        syncStatus: undefined,
      }));
      // Separate Steam and non-Steam games
      const savedSteamGames = savedGames.filter((game) => game.appId && game.appId !== "0");
      const savedNonSteamGames = savedGames.filter((game) => !game.appId || game.appId === "0");
      setSteamGames(savedSteamGames);
      setNonSteamGames(savedNonSteamGames);
      // Removed games are not stored so we leave this empty on initial load
      setRemovedGames([]);
    } catch (err) {
      console.error("Error loading saved games:", err);
      setError(t("scannedGamesPage.errorLoadingSavedGames"));
    }
  };
  useEffect(() => {
    loadSavedGames();
    if (steamCrendentialIsNotSet) setError(t("scannedGamesPage.steamPathOrIdNotSet"));
  }, []);

  // Function to scan games and synchronize with stored data
  const scanSteamGames = async () => {
    if (steamCrendentialIsNotSet) {
      alert(t("scannedGamesPage.steamPathOrIdNotSet"));
      return;
    }
    setLoading(true);
    try {
      // Retrieve Steam and non-Steam games
      const { steamGames: loadedSteamGames, nonSteamGames: loadedNonSteamGames } =
        await steamService.scanGames(settings.steamPath!, settings.steamId!);
      const allScannedGames: SteamGame[] = [...loadedSteamGames, ...loadedNonSteamGames];

      // Synchronize scanned games with stored games
      const syncResult = await ScannedGamesClient.syncScannedGames(allScannedGames);
      if (!syncResult.success) throw syncResult.error || t("scannedGamesPage.errorScanningGames");

      if (syncResult.syncResult) await ScannedGamesClient.applySyncResult(syncResult.syncResult);
      else throw t("scannedGamesPage.errorScanningGames");

      // Determine sync status for each game ("new" or "updated")
      const getSyncStatus = (game: SteamGame): "new" | "updated" | "" => {
        if (
          syncResult.syncResult?.toAdd.some((syncGame) => syncGame.gameDetails.cmd === game.cmd)
        ) {
          return "new";
        }
        if (
          syncResult.syncResult?.toUpdate.some((syncGame) => syncGame.gameDetails.cmd === game.cmd)
        ) {
          return "updated";
        }
        return "";
      };

      // Add syncStatus label to each scanned game
      const labeledGames = allScannedGames.map((game) => ({
        ...game,
        syncStatus: getSyncStatus(game),
      })) as LabeledSteamGame[];

      // Separate Steam and non-Steam games
      const labeledSteamGames = labeledGames.filter((game) => game.appId && game.appId !== "0");
      const labeledNonSteamGames = labeledGames.filter((game) => !game.appId || game.appId === "0");

      // Filter removed games (exclude those that are updated)
      const removed = syncResult.syncResult?.toRemove
        .filter(
          (syncGame) =>
            !syncResult.syncResult?.toUpdate.some(
              (updateGame) => updateGame.gameDetails.cmd === syncGame.gameDetails.cmd,
            ),
        )
        .map((syncGame) => syncGame.gameDetails);

      // Update states with the new data
      setSteamGames(labeledSteamGames);
      setNonSteamGames(labeledNonSteamGames);
      setRemovedGames(removed);
    } catch (err) {
      console.error("Error scanning games:", err);
      setError(t("scannedGamesPage.errorScanningGames"));
      alert(`${t("scannedGamesPage.errorScanningGames")}: ${steamService.errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to add fake data by merging with existing saved games
  const addFakeData = async () => {
    // Define two fake games: one Steam and one non-Steam
    const fakeSteamGame: SteamGame = {
      cmd: "fake-steam-game",
      appId: "123456",
      name: "Fake Steam Game",
      imagePath: "",
    };

    const fakeNonSteamGame: SteamGame = {
      cmd: "fake-nonsteam-game",
      appId: "0",
      name: "Fake Non Steam Game",
      imagePath: "",
    };

    const fakeGames: SteamGame[] = [fakeSteamGame, fakeNonSteamGame];

    // Stable unique ID generator (must match the one used in scannedGamesClient)
    const generateUniqueId = (game: SteamGame): string => `${game.cmd}_${game.appId}`;
    const isSteamGame = (game: SteamGame): boolean => Boolean(game.appId && game.appId !== "0");

    setLoading(true);
    try {
      // Retrieve current saved games
      const savedGames = await ScannedGamesClient.getScannedGames();

      // Convert fake games to the StoredGame format
      const newFakeStoredGames: ScannedGamesConfig[] = fakeGames.map((game) => ({
        id: generateUniqueId(game),
        uniqueId: generateUniqueId(game),
        isSteamGame: isSteamGame(game),
        gameDetails: game,
      }));

      // Merge new fake games with the existing saved games (avoid duplicates)
      const mergedGames = [...savedGames.data];
      newFakeStoredGames.forEach((fakeGame: ScannedGamesConfig) => {
        if (!mergedGames.some((storedGame) => storedGame.id === fakeGame.id)) {
          mergedGames.push(fakeGame);
        }
      });

      // Save the merged list back to storage
      await ScannedGamesClient.setScannedGames(mergedGames);

      // Refresh UI by reloading saved games
      await loadSavedGames();
    } catch (err) {
      console.error("Error adding fake data:", err);
      alert("Erreur lors de l'ajout de fausses données");
    } finally {
      setLoading(false);
    }
  };

  const removeAll = async () => {
    setLoading(true);
    try {
      await ScannedGamesClient.setScannedGames([]);
      setSteamGames([]);
      setNonSteamGames([]);
      setRemovedGames([]);
    } catch (err) {
      console.error("Error removing all games:", err);
      alert("Erreur lors de la suppression de tous les jeux");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        padding: 2,
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      {error && <Alert severity="error">{error}</Alert>}
      {/* Action buttons at the top */}
      <Stack direction="row" spacing={2}>
        {!steamCrendentialIsNotSet && (
          <Button variant="contained" color="primary" onClick={scanSteamGames} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : t("scannedGamesPage.scanGames")}
          </Button>
        )}
        {process.env.REACT_APP_ENV === "dev" && (
          <>
            <Button variant="contained" color="secondary" onClick={addFakeData} disabled={loading}>
              Add fake datas
            </Button>
            <Button variant="contained" color="secondary" onClick={removeAll} disabled={loading}>
              Delete all
            </Button>
          </>
        )}
      </Stack>

      {/* Section for removed games */}
      {removedGames.length > 0 && (
        <>
          <Typography variant="h4" gutterBottom>
            {t("scannedGamesPage.removedGames")}
          </Typography>
          <Grid2 container spacing={3} sx={{ mb: 4 }}>
            {removedGames.map((game) => (
              <Grid2 key={uuidv4()}>
                <GameCard status="removed" gameTitle={game.name} imagePath={game.imagePath} />
              </Grid2>
            ))}
          </Grid2>
        </>
      )}

      {/* Section for Steam games */}
      <Typography variant="h4" sx={{ margin: 0 }}>
        {t("scannedGamesPage.steamGames")}
      </Typography>
      <Grid2 container spacing={3}>
        {steamGames.length === 0 && !loading && (
          <Typography variant="body1" sx={{ width: "100%", textAlign: "center" }}>
            {t("scannedGamesPage.clickScanGames")}
          </Typography>
        )}
        {steamGames.map((game) => (
          <Grid2 key={uuidv4()}>
            <GameCard
              status={game.syncStatus || undefined}
              gameTitle={game.name}
              imagePath={game.imagePath}
            />
          </Grid2>
        ))}
      </Grid2>

      {/* Section for Non-Steam games */}
      <Typography variant="h4" sx={{ margin: 0 }}>
        {t("scannedGamesPage.nonSteamGames")}
      </Typography>
      <Grid2 container spacing={3}>
        {nonSteamGames.length === 0 && !loading && (
          <Typography variant="body1" sx={{ width: "100%", textAlign: "center" }}>
            {t("scannedGamesPage.noNonSteamGames")}
          </Typography>
        )}
        {nonSteamGames.map((game) => (
          <Grid2 key={uuidv4()}>
            <GameCard
              status={game.syncStatus || undefined}
              gameTitle={game.name}
              imagePath={game.imagePath}
            />
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
};

export default ScannedGames;
