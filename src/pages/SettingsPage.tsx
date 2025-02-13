import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  IconButton,
  CircularProgress,
  Box,
  ButtonGroup,
} from "@mui/material";
import { FolderOpen as FolderOpenIcon, Search as SearchIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { ThemeMode } from "../types";
import { useThemeModeContext } from "../context/ThemeModeContext";
import { useSettings } from "../context/SettingsContext";

type SteamUserType = {
  id: string;
  name: string;
};

const SettingsPage: React.FC = () => {
  const { setTheme } = useThemeModeContext();
  const { settings, saveSettings: saveSettingsToContext } = useSettings();
  const { t, i18n } = useTranslation();
  const [steamPath, setSteamPath] = useState("");
  const [steamId, setSteamId] = useState("");
  const [language, setLanguage] = useState("fr");
  const [sunshinePath, setSunshinePath] = useState("");
  const [steamUsers, setSteamUsers] = useState<SteamUserType[]>([]);
  const [steamAlert, setSteamAlert] = useState("");
  const [sunshineAlert, setSunshineAlert] = useState("");
  const [steamUsersAlert, setSteamUsersAlert] = useState("");
  const [loading, setLoading] = useState({
    steam: false,
    sunshine: false,
    steamUsers: false,
  });
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");

  const loadSettings = async () => {
    if (settings) {
      console.log("Settings loaded:", settings);
      setSteamPath(settings.steamPath || "");
      setSteamId(settings.steamId || "");
      setLanguage(settings.language || "fr");
      setSunshinePath(settings.sunshinePath || "");
      setThemeMode(settings.themeMode || "system");
      setSettingsLoaded(true);
    }

    // Change la langue dans i18next
    i18n.changeLanguage(settings.language || "fr");
  };

  const saveSettings = async () => {
    await saveSettingsToContext({
      steamPath,
      steamId,
      language,
      sunshinePath,
      themeMode,
    });
    setTheme(themeMode);
    i18n.changeLanguage(language);
  };

  const handleScan = async (type: "steam" | "sunshine" | "steamUsers") => {
    setLoading((prev) => ({ ...prev, [type]: true }));
    try {
      let detectedPath = "";
      let detectedUsers: SteamUserType[] = [];
      if (type === "steam") {
        detectedPath = await window.electron.detectSteamPath();
      }
      if (type === "steamUsers") {
        if (!steamPath) {
          setSteamAlert(t("settings.noSteamPath"));
          return;
        }
        detectedUsers = await window.electronSteamLibraryScannerApi.getSteamUsers(
          settings.steamPath || "",
        );
        setSteamAlert("");
      }
      if (type === "sunshine") {
        detectedPath = await window.electron.detectSunshinePath();
      }

      if (type === "steam" && detectedPath) {
        setSteamPath(detectedPath);
        setSteamAlert(t("settings.detectedSteamPath", { path: detectedPath }));
      } else if (type === "steam") {
        setSteamAlert(t("settings.noSteamPath"));
      }

      if (type === "sunshine" && detectedPath) {
        setSunshinePath(detectedPath);
        setSunshineAlert(t("settings.detectedSunshinePath", { path: detectedPath }));
      } else if (type === "sunshine") {
        setSunshineAlert(t("settings.noSunshinePath"));
      }

      if (type === "steamUsers" && detectedUsers.length > 0) {
        setSteamUsers(detectedUsers);
        if (!steamUsers.some((user) => user.id === steamId)) {
          setSteamId(detectedUsers[0].id); // Set the first detected user as default if current ID is not in the list
        }
        const formattedUsers = detectedUsers.map((user) => `${user.name} (${user.id})`);
        setSteamUsersAlert(t("settings.detectedSteamUsers", { users: formattedUsers.join(", ") }));
        detectedUsers.join(", ");
      } else if (type === "steamUsers") {
        setSteamUsersAlert(t("settings.noSteamUsers"));
      }
    } catch (error) {
      console.error(`Error during ${type} scan:`, error);
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleThemeChange = (value: string) => {
    setThemeMode(value as ThemeMode);
  };

  const handleBrowse = async (
    setPath: React.Dispatch<React.SetStateAction<string>>,
    setAlert: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    const path = await window.electron.openFileDialog();
    if (path) {
      setPath(path);
      setAlert(t("settings.manuallySelectedPath"));
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (settingsLoaded) {
      if (!steamPath) {
        handleScan("steam");
      }
      if (!sunshinePath) {
        handleScan("sunshine");
      }
      if (steamPath && !steamId) {
        handleScan("steamUsers");
      }
    }
  }, [settingsLoaded, steamPath, sunshinePath, steamId]);

  return (
    <Container maxWidth="sm" sx={{ paddingTop: 2 }}>
      <Typography variant="h4" gutterBottom>
        {t("settings.title")}
      </Typography>

      <Box display="flex" alignItems="center" sx={{ marginBottom: 3 }}>
        <FormControl fullWidth sx={{ flex: 1, marginRight: 2 }}>
          <InputLabel>{t("settings.language")}</InputLabel>
          <Select
            value={language}
            onChange={(e: any) => setLanguage(e.target.value)}
            label={t("settings.language")}
            variant="outlined"
          >
            <MenuItem value="fr">{t("settings.languageFr")}</MenuItem>
            <MenuItem value="en">{t("settings.languageEn")}</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box display="flex" alignItems="center" sx={{ marginBottom: 3 }}>
        <FormControl fullWidth sx={{ flex: 1, marginRight: 2 }}>
          <InputLabel>{t("settings.steamId")}</InputLabel>
          <Select
            value={steamId}
            onChange={(e: any) => setSteamId(e.target.value)}
            label={t("settings.steamId")}
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
          onClick={() => handleScan("steamUsers")}
          disabled={loading.steamUsers}
        >
          {loading.steamUsers ? <CircularProgress size={24} /> : <SearchIcon />}
        </IconButton>
      </Box>
      {steamUsersAlert && (
        <Alert severity="info" sx={{ marginTop: 1, marginBottom: 2 }}>
          {steamUsersAlert}
        </Alert>
      )}

      <Box display="flex" alignItems="center" sx={{ marginBottom: 3 }}>
        <TextField
          label={t("settings.steamPath")}
          variant="outlined"
          fullWidth
          value={steamPath}
          onChange={(e: any) => setSteamPath(e.target.value)}
          sx={{ flex: 1, marginRight: 2 }}
          InputProps={{
            endAdornment: (
              <IconButton color="primary" onClick={() => handleBrowse(setSteamPath, setSteamAlert)}>
                <FolderOpenIcon />
              </IconButton>
            ),
          }}
        />
        <IconButton
          color="primary"
          onClick={() => handleScan("steam")}
          disabled={loading.steam}
          sx={{ marginLeft: 1 }}
        >
          {loading.steam ? <CircularProgress size={24} /> : <SearchIcon />}
        </IconButton>
      </Box>
      {steamAlert && (
        <Alert severity="info" sx={{ marginTop: 1, marginBottom: 2 }}>
          {steamAlert}
        </Alert>
      )}

      <Box display="flex" alignItems="center" sx={{ marginBottom: 3 }}>
        <TextField
          label={t("settings.sunshinePath")}
          variant="outlined"
          fullWidth
          value={sunshinePath}
          onChange={(e: any) => setSunshinePath(e.target.value)}
          sx={{ flex: 1, marginRight: 2 }}
          InputProps={{
            endAdornment: (
              <IconButton
                color="primary"
                onClick={() => handleBrowse(setSunshinePath, setSunshineAlert)}
              >
                <FolderOpenIcon />
              </IconButton>
            ),
          }}
        />
        <IconButton
          color="primary"
          onClick={() => handleScan("sunshine")}
          disabled={loading.sunshine}
          sx={{ marginLeft: 1 }}
        >
          {loading.sunshine ? <CircularProgress size={24} /> : <SearchIcon />}
        </IconButton>
      </Box>
      {sunshineAlert && (
        <Alert severity="info" sx={{ marginTop: 1, marginBottom: 2 }}>
          {sunshineAlert}
        </Alert>
      )}

      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="h6">{t("settings.themeColor")}</Typography>
        <ButtonGroup variant="contained" fullWidth sx={{ marginBottom: 2 }}>
          <Button
            onClick={() => handleThemeChange("light")}
            sx={{
              backgroundColor: themeMode === "light" ? "primary.main" : "transparent",
              color: themeMode === "light" ? "white" : "text.primary",
            }}
          >
            {t("settings.themeLight")}
          </Button>
          <Button
            onClick={() => handleThemeChange("dark")}
            sx={{
              backgroundColor: themeMode === "dark" ? "primary.main" : "transparent",
              color: themeMode === "dark" ? "white" : "text.primary",
            }}
          >
            {t("settings.themeDark")}
          </Button>
          <Button
            onClick={() => handleThemeChange("system")}
            sx={{
              backgroundColor: themeMode === "system" ? "primary.main" : "transparent",
              color: themeMode === "system" ? "white" : "text.primary",
            }}
          >
            {t("settings.themeSystem")}
          </Button>
        </ButtonGroup>
      </Box>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={saveSettings}
        sx={{ marginTop: 2 }}
      >
        {t("settings.save")}
      </Button>
    </Container>
  );
};

export default SettingsPage;
