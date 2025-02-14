import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ExportGameConfig } from "../types";
import { exportedGamesService } from "../services/exportedGamesService";

const ExportedGames: React.FC = () => {
  const [exportedGames, setExportedGames] = useState<ExportGameConfig[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchExportedGames = async () => {
      setLoading(true);
      try {
        const games = await exportedGamesService.getExportedGames();
        setExportedGames(games);
      } catch (error) {
        console.error("Error fetching exported games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExportedGames();
  }, []);

  const addExportedGameConfig = async (game: ExportGameConfig) => {
    try {
      await exportedGamesService.addExportedGameConfig(game);
      setExportedGames(await exportedGamesService.getExportedGames());
    } catch (error) {
      console.error("Error adding exported game config:", error);
    }
  };

  const removeExportedGameConfig = async (uniqueId: string) => {
    try {
      await exportedGamesService.removeExportedGameConfig(uniqueId);
      setExportedGames(await exportedGamesService.getExportedGames());
    } catch (error) {
      console.error("Error removing exported game config:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Exported Games
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {exportedGames.map((game) => (
            <ListItem key={game.uniqueId}>
              <ListItemText
                primary={game.gameInfos.name}
                secondary={`Output: ${game.sunshineConfig.output}, Index: ${game.sunshineConfig.index}`}
              />
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate(`/game-sunshine-edit/${game.uniqueId}`)}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => removeExportedGameConfig(game.uniqueId)}
              >
                Remove
              </Button>
            </ListItem>
          ))}
        </List>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          addExportedGameConfig({
            uniqueId: "", // Will be generated in the service
            appId: "12345", // Example appId
            sunshineConfig: {
              output: "",
              index: -1,
              excludeGlobalPrepCmd: false,
              elevated: false,
              autoDetach: true,
              waitAll: true,
              exitTimeout: 5,
              prepCmd: [],
              detached: [],
              name: "",
              cmd: "",
              imagePath: "",
            },
            gameInfos: {
              id: "12345",
              name: "Example Game",
              cmd: "",
              imagePath: "",
              appId: "",
            },
          })
        }
      >
        Add Example Game Config
      </Button>
    </Box>
  );
};

export default ExportedGames;
