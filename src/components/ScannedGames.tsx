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
import { SyncResult } from "../types";
import { addFakeData } from "../utils/devFonctions";

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

  const processSyncResult = (syncResult: SyncResult) => {
    if (!syncResult) {
      console.error("syncResult is undefined");
      return;
    }

    // Détecter les jeux supprimés
    const removed = syncResult.toRemove.map((syncGame) => syncGame.gameDetails);

    // Fonction pour récupérer le statut de synchronisation d'un jeu
    const getSyncStatus = (game: SteamGame): gameStatus | undefined => {
      if (syncResult.toAdd.some((syncGame) => syncGame.gameDetails.cmd === game.cmd)) {
        return "new"; // Assurez-vous que cela correspond à une valeur de l'énumération gameStatus
      }
      if (syncResult.toUpdate.some((syncGame) => syncGame.gameDetails.cmd === game.cmd)) {
        return "updated"; // Assurez-vous que cela correspond à une valeur de l'énumération gameStatus
      }
      return undefined;
    };

    // Filtrer les jeux pour supprimer ceux qui ont été retirés
    const filteredSteamGames = steamGames.filter(
      (game) => !removed.some((removedGame) => removedGame.cmd === game.cmd),
    );

    const filteredNonSteamGames = nonSteamGames.filter(
      (game) => !removed.some((removedGame) => removedGame.cmd === game.cmd),
    );

    // Ajouter ou mettre à jour les jeux sans créer de doublons
    const updatedSteamGames = [
      ...filteredSteamGames.map((game) => ({
        ...game,
        syncStatus: getSyncStatus(game) || game.syncStatus, // Conserver l'ancien statut si non modifié
      })),
      ...syncResult.toAdd
        .map((g) => g.gameDetails)
        .filter(
          (game) =>
            game.appId && game.appId !== "0" && !filteredSteamGames.some((g) => g.cmd === game.cmd),
        )
        .map((game) => ({ ...game, syncStatus: "new" as gameStatus })), // Ici aussi, assurez-vous que `syncStatus` est bien un membre de `gameStatus`
    ];

    const updatedNonSteamGames = [
      ...filteredNonSteamGames.map((game) => ({
        ...game,
        syncStatus: getSyncStatus(game) || game.syncStatus,
      })),
      ...syncResult.toAdd
        .map((g) => g.gameDetails)
        .filter(
          (game) =>
            (!game.appId || game.appId === "0") &&
            !filteredNonSteamGames.some((g) => g.cmd === game.cmd),
        )
        .map((game) => ({ ...game, syncStatus: "new" as gameStatus })), // Idem ici
    ];

    // Mise à jour des états
    setSteamGames(updatedSteamGames);
    setNonSteamGames(updatedNonSteamGames);
    setRemovedGames(removed);
  };

  // Function to scan games and synchronize with stored data
  const scanSteamGames = async () => {
    if (steamCrendentialIsNotSet) {
      alert(t("scannedGamesPage.steamPathOrIdNotSet"));
      return;
    }
    setLoading(true);
    try {
      const { steamGames: loadedSteamGames, nonSteamGames: loadedNonSteamGames } =
        await steamService.scanGames(settings.steamPath!, settings.steamId!);
      const allScannedGames: SteamGame[] = [...loadedSteamGames, ...loadedNonSteamGames];

      const syncResult = await ScannedGamesClient.syncScannedGames(allScannedGames);
      if (!syncResult.success) throw syncResult.error;

      if (syncResult.syncResult) await ScannedGamesClient.applySyncResult(syncResult.syncResult);
      else throw t("scannedGamesPage.errorScanningGames");

      processSyncResult(syncResult.syncResult);
    } catch (err) {
      console.error("Error scanning games:", err);
      setError(t("scannedGamesPage.errorScanningGames"));
    } finally {
      setLoading(false);
    }
  };

  // Function to add fake data by merging with existing saved games
  const handleAddFakeData = async () => {
    try {
      setLoading(true);
      const syncResult = await addFakeData();
      await ScannedGamesClient.applySyncResult(syncResult);
      processSyncResult(syncResult);
    } catch (err) {
      console.error("Error adding fake data:", err);
      setError("Error adding wrong data");
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
      alert("Error deleting all games");
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
            <Button
              variant="contained"
              color="secondary"
              onClick={handleAddFakeData}
              disabled={loading}
            >
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
