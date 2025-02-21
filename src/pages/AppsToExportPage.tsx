import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Typography, Grid2, IconButton, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DeleteForever, EditNote } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import { ExportGameConfig, ScannedGamesConfig } from "../types";
import GameDropdown from "../components/GameDropdown";
import { exportedGamesService } from "../services/exportedGamesService";
import GameCard from "../components/GameCard";
import ScannedGamesClient from "../services/scannedGamesClient";

const AppsToExportPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [exportedGames, setExportedGames] = useState<ExportGameConfig[]>([]);
  const [scannedGames, setScannedGames] = useState<ScannedGamesConfig[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchExportedGames = async () => {
      setLoading(true);
      try {
        const games = await exportedGamesService.getExportedGames();
        console.log("Exported games", games);
        setExportedGames(games);
      } catch (error) {
        console.error("Error fetching exported games:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchScannedGames = async () => {
      const scannedGamesResult = await ScannedGamesClient.getScannedGames();

      if (
        scannedGamesResult.success &&
        scannedGamesResult.data &&
        Array.isArray(scannedGamesResult.data)
      ) {
        console.log("Scanned games", scannedGamesResult.data);
        setScannedGames(scannedGamesResult.data);
      } else {
        console.error("Invalid response structure", scannedGamesResult);
      }
    };

    fetchExportedGames();
    fetchScannedGames();
  }, []);

  // When you select a game in the dropdown, you navigate to the edit page
  const goToCreateAppPage = (exportedGameId: string | undefined) => {
    navigate(`/app-sunshine-create/${exportedGameId}`);
  };

  const removeExportedGameConfig = async (uniqueId: string) => {
    try {
      await exportedGamesService.removeExportedGameConfig(uniqueId);
      const games = await exportedGamesService.getExportedGames();
      setExportedGames(games);
    } catch (error) {
      console.error("Error removing exported game config:", error);
    }
  };

  return (
    <Box p={2} display="flex" flexDirection="column" gap={4}>
      <Box display="flex" flexDirection="row" gap={4} justifyContent="space-between">
        {/* Page Title */}
        <Box>
          <Typography variant="h4" gutterBottom>
            {t("appsToExportPage.title")}
          </Typography>
        </Box>

        {/* Dropdown at the top */}
        <Box display="flex" flexDirection="row" gap={4}>
          <Button
            size="small"
            variant="contained"
            type="button"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              console.log("Export new apps");
            }}
          >
            {t("appsToExportPage.exportNewApps")}
          </Button>
          <GameDropdown
            games={scannedGames}
            selectedGame=""
            onChange={goToCreateAppPage}
            placeholder={t("appsToExportPage.selectGame")}
          />
        </Box>
      </Box>

      {/* Display of exported configurations as a Card */}
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid2 container spacing={2}>
          {exportedGames.map((exportedGame) => (
            <Grid2 key={uuidv4()}>
              <GameCard
                onClick={() => {
                  navigate(`/app-sunshine-edit/${exportedGame.uniqueId}`);
                }}
                status={exportedGame.isExported ? "exported" : "nonExported"}
                gameTitle={exportedGame.sunshineConfig.name}
                imagePath={exportedGame.sunshineConfig["image-path"]!}
                actions={
                  <Box sx={{ display: "flex", alignItems: "end", width: "100%" }}>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/app-sunshine-edit/${exportedGame.uniqueId}`);
                      }}
                      sx={{ color: (theme) => theme.palette.primary.main }}
                    >
                      <EditNote />
                    </IconButton>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        removeExportedGameConfig(exportedGame.uniqueId);
                      }}
                      sx={{ color: (theme) => theme.palette.error.main }}
                    >
                      <DeleteForever />
                    </IconButton>
                  </Box>
                }
              />
            </Grid2>
          ))}
        </Grid2>
      )}
    </Box>
  );
};

export default AppsToExportPage;
