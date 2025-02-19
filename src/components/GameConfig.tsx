import React, { useEffect, useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Cancel, Save } from "@mui/icons-material";
import { SunshineAppConfigNew, PrepCommand } from "../types";
import PrepCommands from "./PrepCommands";
import CheckboxField from "./CheckboxField";
import DetachedCommands from "./DetachedCommands";

interface GameConfigProps {
  gameDetails: SunshineAppConfigNew;
  onSave: (_appSetting: any) => void;
  handleCancel?: (_appSetting: any) => void;
}

const GameConfig: React.FC<GameConfigProps> = ({ gameDetails, onSave, handleCancel }) => {
  const [currentGameDetails, setCurrentGameDetails] = useState<SunshineAppConfigNew>(gameDetails);
  const { t } = useTranslation();

  useEffect(() => {
    setCurrentGameDetails(gameDetails);
  }, [gameDetails]);

  const handleCheckboxChange = (field: keyof SunshineAppConfigNew) => {
    setCurrentGameDetails((prevDetails) => ({
      ...prevDetails,
      [field]: !prevDetails[field],
    }));
  };

  const handleChange = (field: keyof SunshineAppConfigNew, value: any) => {
    setCurrentGameDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  const handlePrepCmdChange = (index: number, field: keyof PrepCommand, value: any) => {
    setCurrentGameDetails((prevDetails) => {
      const updatedPrepCmd = [...(prevDetails["prep-cmd"] || [])];
      updatedPrepCmd[index] = { ...updatedPrepCmd[index], [field]: value };
      return {
        ...prevDetails,
        "prep-cmd": updatedPrepCmd,
      };
    });
  };

  const addPrepCmd = () => {
    setCurrentGameDetails((prevDetails) => ({
      ...prevDetails,
      "prep-cmd": [...(prevDetails["prep-cmd"] || []), { do: "", undo: "", elevated: false }],
    }));
  };

  const removePrepCmd = (index: number) => {
    setCurrentGameDetails((prevDetails) => {
      const updatedPrepCmd = [...(prevDetails["prep-cmd"] || [])];
      updatedPrepCmd.splice(index, 1);
      return {
        ...prevDetails,
        "prep-cmd": updatedPrepCmd,
      };
    });
  };

  const addDetached = () => {
    setCurrentGameDetails((prevDetails) => ({
      ...prevDetails,
      detached: [...(prevDetails.detached || []), ""],
    }));
  };

  const removeDetached = (index: number) => {
    setCurrentGameDetails((prevDetails) => {
      const updatedDetached = [...(prevDetails.detached || [])];
      updatedDetached.splice(index, 1);
      return {
        ...prevDetails,
        detached: updatedDetached,
      };
    });
  };

  const handleDetachedChange = (index: number, value: string) => {
    setCurrentGameDetails((prevDetails) => {
      const updatedDetached = [...(prevDetails.detached || [])];
      updatedDetached[index] = value;
      return {
        ...prevDetails,
        detached: updatedDetached,
      };
    });
  };

  const saveGameDetails = () => {
    onSave(currentGameDetails);
  };

  return (
    <Box display="flex" flexDirection="column" gap="16px" sx={{ marginY: "24px" }}>
      {/* Sunshine Configuration Fields */}
      <TextField
        sx={{ margin: 0 }}
        size="small"
        label={t("sunshineGameConfig.applicationName")}
        value={currentGameDetails.name}
        onChange={(e) => handleChange("name", e.target.value)}
        fullWidth
        margin="normal"
      />

      <TextField
        sx={{ margin: 0 }}
        size="small"
        label={t("sunshineGameConfig.logOutputPath")}
        value={currentGameDetails.output}
        onChange={(e) => handleChange("output", e.target.value)}
        fullWidth
        margin="normal"
      />

      <TextField
        sx={{ margin: 0 }}
        size="small"
        label={t("sunshineGameConfig.cmd")}
        value={currentGameDetails.cmd}
        onChange={(e) => handleChange("cmd", e.target.value)}
        fullWidth
        margin="normal"
      />

      <TextField
        sx={{ margin: 0 }}
        size="small"
        label={t("sunshineGameConfig.workingDir")}
        value={currentGameDetails["working-dir"]}
        onChange={(e) => handleChange("working-dir", e.target.value)}
        fullWidth
        margin="normal"
      />

      <CheckboxField
        label={t("sunshineGameConfig.excludeGlobalPrepCmd")}
        checked={currentGameDetails["exclude-global-prep-cmd"] || true} // true by default in sunshine
        onChange={() => handleCheckboxChange("exclude-global-prep-cmd")}
      />
      <CheckboxField
        label={t("sunshineGameConfig.elevated")}
        checked={currentGameDetails.elevated || false} // true by default in sunshine
        onChange={() => handleCheckboxChange("elevated")}
      />
      <CheckboxField
        label={t("sunshineGameConfig.autoDetach")}
        checked={currentGameDetails["auto-detach"] || true} // true by default in sunshine
        onChange={() => handleCheckboxChange("auto-detach")}
      />

      <CheckboxField
        label={t("sunshineGameConfig.waitAll")}
        checked={currentGameDetails["wait-all"] || true} // true by default in sunshine
        onChange={() => handleCheckboxChange("wait-all")}
      />

      <TextField
        sx={{ margin: 0 }}
        size="small"
        label={t("sunshineGameConfig.exitTimeout")}
        type="number"
        value={currentGameDetails["exit-timeout"]}
        onChange={(e) => handleChange("exit-timeout", Number(e.target.value))}
        fullWidth
        margin="normal"
      />

      <TextField
        sx={{ margin: 0 }}
        size="small"
        label={t("sunshineGameConfig.imagePath")}
        value={currentGameDetails["image-path"]}
        onChange={(e) => handleChange("image-path", e.target.value)}
        fullWidth
        margin="normal"
      />

      <PrepCommands
        prepCmds={currentGameDetails["prep-cmd"] || []}
        onChange={handlePrepCmdChange}
        onAdd={addPrepCmd}
        onRemove={removePrepCmd}
      />

      <DetachedCommands
        detached={currentGameDetails.detached || []}
        onChange={handleDetachedChange}
        onAdd={addDetached}
        onRemove={removeDetached}
      />

      <Box
        display="inline-flex"
        alignContent="end"
        sx={{ marginTop: "1rem", width: "100%", justifyContent: "space-between" }}
      >
        {handleCancel && (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCancel}
            startIcon={<Cancel />}
          >
            {t("sunshineGameConfig.cancel")}
          </Button>
        )}
        <Button variant="contained" color="primary" onClick={saveGameDetails} startIcon={<Save />}>
          {t("sunshineGameConfig.save")}
        </Button>
      </Box>
    </Box>
  );
};

export default GameConfig;
