// SteamSettings.tsx
import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import PathInput from "./PathInput";
import SettingsSection from "./SettingsSection";

interface SteamUserType {
  id: string;
  name: string;
}

interface SteamSettingsProps {
  steamPath: string;
  steamId: string;
  steamUsers: SteamUserType[];
  steamAlert: string;
  steamUsersAlert: string;
  loading: { steam: boolean; steamUsers: boolean };
  onSteamPathChange: React.Dispatch<React.SetStateAction<string>>;
  onSteamIdChange: React.Dispatch<React.SetStateAction<string>>;
  onScan: (_type: "steam" | "steamUsers") => void;
  onBrowse: (
    _setPath: React.Dispatch<React.SetStateAction<string>>,
    _setAlert: React.Dispatch<React.SetStateAction<string>>,
  ) => void;
  setSteamAlert: React.Dispatch<React.SetStateAction<string>>;
}

const SteamSettings: React.FC<SteamSettingsProps> = ({
  steamPath,
  steamId,
  steamUsers,
  steamAlert,
  steamUsersAlert,
  loading,
  onSteamPathChange,
  onSteamIdChange,
  onScan,
  onBrowse,
  setSteamAlert,
}) => {
  const { t } = useTranslation();

  return (
    <SettingsSection sectionTitle={t("settingsPage.steamSectionTitle")}>
      <PathInput
        label={t("settingsPage.steamPath")}
        value={steamPath}
        onChange={(e) => onSteamPathChange(e.target.value)}
        onBrowse={() => onBrowse(onSteamPathChange, setSteamAlert)}
        onScan={() => onScan("steam")}
        loading={loading.steam}
      />
      {steamAlert && <Alert severity="info">{steamAlert}</Alert>}

      <Box display="flex" alignItems="center">
        <FormControl fullWidth sx={{ flex: 1, marginRight: 2 }}>
          <InputLabel>{t("settingsPage.steamId")}</InputLabel>
          <Select
            size="small"
            value={steamId}
            onChange={(e) => onSteamIdChange(e.target.value)}
            label={t("settingsPage.steamId")}
            displayEmpty
            variant="outlined"
          >
            {steamUsers.length > 0 ? (
              steamUsers.map((user, index) => (
                <MenuItem key={index} value={user.id}>
                  {user.name} ({user.id})
                </MenuItem>
              ))
            ) : (
              <MenuItem value={steamId}>{steamId}</MenuItem>
            )}
          </Select>
        </FormControl>
        <IconButton
          color="primary"
          onClick={() => onScan("steamUsers")}
          disabled={loading.steamUsers}
        >
          {loading.steamUsers ? <CircularProgress size={24} /> : <SearchIcon />}
        </IconButton>
      </Box>
      {steamUsersAlert && <Alert severity="info">{steamUsersAlert}</Alert>}
    </SettingsSection>
  );
};

export default SteamSettings;
