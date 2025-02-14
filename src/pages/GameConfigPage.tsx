import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { ExportGameConfig } from "../types";
import { exportedGamesService } from "../services/exportedGamesService";
import { SunshineConfig } from "../types/SunshineConfig";

const GameConfigPage: React.FC = () => {
  const { t } = useTranslation();
  const { uniqueId } = useParams<{ uniqueId: string }>();
  const [gameDetails, setGameDetails] = useState<ExportGameConfig | null>(null);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const games = await exportedGamesService.getExportedGames();
        const game = games.find((g) => g.uniqueId === uniqueId) || null;
        setGameDetails(game);
      } catch (error) {
        console.error("Error fetching game details:", error);
      }
    };
    fetchGameDetails();
  }, [uniqueId]);

  // Mise à jour d'un champ de sunshineConfig avec typage via SunshineConfig
  const handleChange = <K extends keyof SunshineConfig>(field: K, value: SunshineConfig[K]) => {
    if (gameDetails) {
      setGameDetails({
        ...gameDetails,
        sunshineConfig: {
          ...gameDetails.sunshineConfig,
          [field]: value,
        },
      });
    }
  };

  // Pour les cases à cocher (booléens)
  const handleCheckboxChange = (field: keyof SunshineConfig) => {
    if (gameDetails) {
      setGameDetails({
        ...gameDetails,
        sunshineConfig: {
          ...gameDetails.sunshineConfig,
          [field]: !gameDetails.sunshineConfig[field],
        },
      });
    }
  };

  // Pour la modification d'une commande de préparation
  const handlePrepCmdChange = (
    index: number,
    field: keyof SunshineConfig["prepCmd"][number],
    value: any,
  ) => {
    if (gameDetails) {
      const updatedPrepCmd = [...gameDetails.sunshineConfig.prepCmd];
      updatedPrepCmd[index] = { ...updatedPrepCmd[index], [field]: value };
      setGameDetails({
        ...gameDetails,
        sunshineConfig: {
          ...gameDetails.sunshineConfig,
          prepCmd: updatedPrepCmd,
        },
      });
    }
  };

  const addPrepCmd = () => {
    if (gameDetails) {
      setGameDetails({
        ...gameDetails,
        sunshineConfig: {
          ...gameDetails.sunshineConfig,
          prepCmd: [...gameDetails.sunshineConfig.prepCmd, { do: "", undo: "", elevated: false }],
        },
      });
    }
  };

  const removePrepCmd = (index: number) => {
    if (gameDetails) {
      const updatedPrepCmd = [...gameDetails.sunshineConfig.prepCmd];
      updatedPrepCmd.splice(index, 1);
      setGameDetails({
        ...gameDetails,
        sunshineConfig: {
          ...gameDetails.sunshineConfig,
          prepCmd: updatedPrepCmd,
        },
      });
    }
  };

  const saveGameDetails = async () => {
    if (gameDetails) {
      const games = await exportedGamesService.getExportedGames();
      const updatedGames = games.map((g) =>
        g.uniqueId === gameDetails.uniqueId ? gameDetails : g,
      );
      await exportedGamesService.setExportedGames(updatedGames);
    }
  };

  if (!gameDetails) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {t("gameConfig.pageTitle")}
      </Typography>
      <Typography variant="h6" gutterBottom>
        {gameDetails.gameInfos.name}
      </Typography>

      {/* Champs de la configuration Sunshine */}
      <TextField
        label={t("gameConfig.applicationName")}
        value={gameDetails.sunshineConfig.name}
        onChange={(e) => handleChange("name", e.target.value)}
        fullWidth
        margin="normal"
      />

      <TextField
        label={t("gameConfig.logOutputPath")}
        value={gameDetails.sunshineConfig.output}
        onChange={(e) => handleChange("output", e.target.value)}
        fullWidth
        margin="normal"
      />

      <TextField
        label={t("gameConfig.cmd")}
        value={gameDetails.sunshineConfig.cmd}
        onChange={(e) => handleChange("cmd", e.target.value)}
        fullWidth
        margin="normal"
      />

      <TextField
        label={t("gameConfig.index")}
        type="number"
        value={gameDetails.sunshineConfig.index}
        onChange={(e) => handleChange("index", Number(e.target.value))}
        fullWidth
        margin="normal"
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={gameDetails.sunshineConfig.excludeGlobalPrepCmd}
            onChange={() => handleCheckboxChange("excludeGlobalPrepCmd")}
          />
        }
        label={t("gameConfig.excludeGlobalPrepCmd")}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={gameDetails.sunshineConfig.elevated}
            onChange={() => handleCheckboxChange("elevated")}
          />
        }
        label={t("gameConfig.elevated")}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={gameDetails.sunshineConfig.autoDetach}
            onChange={() => handleCheckboxChange("autoDetach")}
          />
        }
        label={t("gameConfig.autoDetach")}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={gameDetails.sunshineConfig.waitAll}
            onChange={() => handleCheckboxChange("waitAll")}
          />
        }
        label={t("gameConfig.waitAll")}
      />

      <TextField
        label={t("gameConfig.exitTimeout")}
        type="number"
        value={gameDetails.sunshineConfig.exitTimeout}
        onChange={(e) => handleChange("exitTimeout", Number(e.target.value))}
        fullWidth
        margin="normal"
      />

      <TextField
        label={t("gameConfig.imagePath")}
        value={gameDetails.sunshineConfig.imagePath}
        onChange={(e) => handleChange("imagePath", e.target.value)}
        fullWidth
        margin="normal"
      />

      <Typography variant="h6" gutterBottom>
        {t("gameConfig.prepCommands")}
      </Typography>
      {gameDetails.sunshineConfig.prepCmd.map((cmd, index) => (
        <div key={index} style={{ marginBottom: "1rem" }}>
          <TextField
            label={t("gameConfig.doCommand")}
            value={cmd.do}
            onChange={(e) => handlePrepCmdChange(index, "do", e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label={t("gameConfig.undoCommand")}
            value={cmd.undo}
            onChange={(e) => handlePrepCmdChange(index, "undo", e.target.value)}
            fullWidth
            margin="normal"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={cmd.elevated}
                onChange={() => handlePrepCmdChange(index, "elevated", !cmd.elevated)}
              />
            }
            label={t("gameConfig.elevated")}
          />
          <Button variant="contained" color="secondary" onClick={() => removePrepCmd(index)}>
            {t("gameConfig.remove")}
          </Button>
        </div>
      ))}
      <Button
        variant="contained"
        color="primary"
        onClick={addPrepCmd}
        style={{ marginBottom: "1rem" }}
      >
        {t("gameConfig.addPrepCommand")}
      </Button>

      <Typography variant="h6" gutterBottom>
        {t("gameConfig.detachedProcesses")}
      </Typography>
      <TextField
        label={t("gameConfig.detachedProcesses")}
        value={gameDetails.sunshineConfig.detached.join(", ")}
        onChange={(e) =>
          handleChange(
            "detached",
            e.target.value.split(",").map((s) => s.trim()),
          )
        }
        fullWidth
        margin="normal"
      />

      <Button
        variant="contained"
        color="primary"
        onClick={saveGameDetails}
        style={{ marginTop: "1rem" }}
      >
        {t("gameConfig.save")}
      </Button>
    </Container>
  );
};

export default GameConfigPage;
