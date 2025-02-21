import React, { useEffect, useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Cancel, Save } from "@mui/icons-material";
import { SunshineAppConfig, PrepCommand } from "../types";
import PrepCommands from "./PrepCommands";
import CheckboxField from "./CheckboxField";
import DetachedCommands from "./DetachedCommands";

interface AppConfigProps {
  appDetails: SunshineAppConfig;
  onSave: (_appSetting: any) => void;
  handleCancel?: (_appSetting: any) => void;
}

const AppConfig: React.FC<AppConfigProps> = ({ appDetails, onSave, handleCancel }) => {
  const [currentAppDetails, setCurrentAppDetails] = useState<SunshineAppConfig>(appDetails);
  const { t } = useTranslation();

  useEffect(() => {
    setCurrentAppDetails(appDetails);
  }, [appDetails]);

  const handleCheckboxChange = (field: keyof SunshineAppConfig) => {
    setCurrentAppDetails((prevDetails) => ({
      ...prevDetails,
      [field]: !prevDetails[field],
    }));
  };

  const handleChange = (field: keyof SunshineAppConfig, value: any) => {
    setCurrentAppDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  const handlePrepCmdChange = (index: number, field: keyof PrepCommand, value: any) => {
    setCurrentAppDetails((prevDetails) => {
      const updatedPrepCmd = [...(prevDetails["prep-cmd"] || [])];
      updatedPrepCmd[index] = { ...updatedPrepCmd[index], [field]: value };
      return {
        ...prevDetails,
        "prep-cmd": updatedPrepCmd,
      };
    });
  };

  const addPrepCmd = () => {
    setCurrentAppDetails((prevDetails) => ({
      ...prevDetails,
      "prep-cmd": [...(prevDetails["prep-cmd"] || []), { do: "", undo: "", elevated: false }],
    }));
  };

  const removePrepCmd = (index: number) => {
    setCurrentAppDetails((prevDetails) => {
      const updatedPrepCmd = [...(prevDetails["prep-cmd"] || [])];
      updatedPrepCmd.splice(index, 1);
      return {
        ...prevDetails,
        "prep-cmd": updatedPrepCmd,
      };
    });
  };

  const addDetached = () => {
    setCurrentAppDetails((prevDetails) => ({
      ...prevDetails,
      detached: [...(prevDetails.detached || []), ""],
    }));
  };

  const removeDetached = (index: number) => {
    setCurrentAppDetails((prevDetails) => {
      const updatedDetached = [...(prevDetails.detached || [])];
      updatedDetached.splice(index, 1);
      return {
        ...prevDetails,
        detached: updatedDetached,
      };
    });
  };

  const handleDetachedChange = (index: number, value: string) => {
    setCurrentAppDetails((prevDetails) => {
      const updatedDetached = [...(prevDetails.detached || [])];
      updatedDetached[index] = value;
      return {
        ...prevDetails,
        detached: updatedDetached,
      };
    });
  };

  const saveAppDetails = () => {
    onSave(currentAppDetails);
  };

  return (
    <Box display="flex" flexDirection="column" gap="16px" sx={{ paddingY: "24px" }}>
      {/* Sunshine Configuration Fields */}
      <TextField
        sx={{ margin: 0 }}
        size="small"
        label={t("sunshineAppConfig.applicationName")}
        value={currentAppDetails.name}
        onChange={(e) => handleChange("name", e.target.value)}
        fullWidth
        margin="normal"
      />

      <TextField
        sx={{ margin: 0 }}
        size="small"
        label={t("sunshineAppConfig.logOutputPath")}
        value={currentAppDetails.output}
        onChange={(e) => handleChange("output", e.target.value)}
        fullWidth
        margin="normal"
      />

      <TextField
        sx={{ margin: 0 }}
        size="small"
        label={t("sunshineAppConfig.cmd")}
        value={currentAppDetails.cmd}
        onChange={(e) => handleChange("cmd", e.target.value)}
        fullWidth
        margin="normal"
      />

      <TextField
        sx={{ margin: 0 }}
        size="small"
        label={t("sunshineAppConfig.workingDir")}
        value={currentAppDetails["working-dir"]}
        onChange={(e) => handleChange("working-dir", e.target.value)}
        fullWidth
        margin="normal"
      />

      <CheckboxField
        label={t("sunshineAppConfig.excludeGlobalPrepCmd")}
        checked={currentAppDetails["exclude-global-prep-cmd"] || false}
        onChange={() => handleCheckboxChange("exclude-global-prep-cmd")}
      />
      <CheckboxField
        label={t("sunshineAppConfig.elevated")}
        checked={currentAppDetails.elevated || false}
        onChange={() => handleCheckboxChange("elevated")}
      />
      <CheckboxField
        label={t("sunshineAppConfig.autoDetach")}
        checked={currentAppDetails["auto-detach"] || false}
        onChange={() => handleCheckboxChange("auto-detach")}
      />

      <CheckboxField
        label={t("sunshineAppConfig.waitAll")}
        checked={currentAppDetails["wait-all"] || false}
        onChange={() => handleCheckboxChange("wait-all")}
      />

      <TextField
        sx={{ margin: 0 }}
        size="small"
        label={t("sunshineAppConfig.exitTimeout")}
        type="number"
        value={currentAppDetails["exit-timeout"]}
        onChange={(e) => handleChange("exit-timeout", Number(e.target.value))}
        fullWidth
        margin="normal"
      />

      <TextField
        sx={{ margin: 0 }}
        size="small"
        label={t("sunshineAppConfig.imagePath")}
        value={currentAppDetails["image-path"]}
        onChange={(e) => handleChange("image-path", e.target.value)}
        fullWidth
        margin="normal"
      />

      <PrepCommands
        prepCmds={currentAppDetails["prep-cmd"] || []}
        onChange={handlePrepCmdChange}
        onAdd={addPrepCmd}
        onRemove={removePrepCmd}
      />

      <DetachedCommands
        detached={currentAppDetails.detached || []}
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
            {t("sunshineAppConfig.cancel")}
          </Button>
        )}
        <Button variant="contained" color="primary" onClick={saveAppDetails} startIcon={<Save />}>
          {t("sunshineAppConfig.save")}
        </Button>
      </Box>
    </Box>
  );
};

export default AppConfig;
