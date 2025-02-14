import React, { useState, useEffect } from "react";
import { SteamGame } from "steam-library-scanner";
import {
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { selectedGamesService } from "../services/selectedGamesService";

const SelectedGames: React.FC = () => {
  const [selectedGames, setSelectedGames] = useState<SteamGame[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSelectedGames = async () => {
      setLoading(true);
      try {
        const games = await selectedGamesService.getSelectedGames();
        setSelectedGames(games);
      } catch (error) {
        console.error("Error fetching selected games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSelectedGames();
  }, []);

  const addToSelected = async (game: SteamGame) => {
    try {
      await selectedGamesService.addSelectedGame(game);
      setSelectedGames(await selectedGamesService.getSelectedGames());
    } catch (error) {
      console.error("Error adding game to selected:", error);
    }
  };

  const removeFromSelected = async (gameId: string) => {
    try {
      await selectedGamesService.removeSelectedGame(gameId);
      setSelectedGames(await selectedGamesService.getSelectedGames());
    } catch (error) {
      console.error("Error removing game from selected:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Selected Games
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {selectedGames.map((game) => (
            <ListItem key={game.appId}>
              <ListItemText primary={game.name} />
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => removeFromSelected(game.appId)}
              >
                Remove
              </Button>
            </ListItem>
          ))}
        </List>
      )}
      {/* ENLEVER */}
      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          addToSelected({
            id: "1",
            name: "Example Game",
            cmd: "",
            imagePath: "",
            appId: "",
          })
        }
      >
        Add Example Game
      </Button>
    </Box>
  );
};

export default SelectedGames;
