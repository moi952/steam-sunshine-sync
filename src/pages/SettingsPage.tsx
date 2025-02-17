import React, { useState, useEffect } from "react";
import {
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
  Grid2,
  InputAdornment,
} from "@mui/material";
import {
  FolderOpen as FolderOpenIcon,
  Search as SearchIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { ThemeMode } from "../types";
import { useThemeModeContext } from "../context/ThemeModeContext";
import { useSettings } from "../context/SettingsContext";
import SettingsSection from "../components/SettingsSection";

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
  const [sunshineLogin, setSunshineLogin] = useState("");
  const [sunshinePassword, setSunshinePassword] = useState("");
  const [sunshinePlainPassword, setSunshinePlainPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
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
      setSunshineLogin(settings.sunshineLogin || "");
      setSunshinePassword(settings.sunshinePassword || "");
      setThemeMode(settings.themeMode || "system");
      setSettingsLoaded(true);
    }

    i18n.changeLanguage(settings.language || "fr");
  };

  const saveSettings = async () => {
    await saveSettingsToContext({
      steamPath,
      steamId,
      language,
      sunshinePath,
      sunshineLogin,
      sunshinePassword,
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
          setSteamAlert(t("settingsPage.noSteamPath"));
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
        setSteamAlert(t("settingsPage.detectedSteamPath", { path: detectedPath }));
      } else if (type === "steam") {
        setSteamAlert(t("settingsPage.noSteamPath"));
      }

      if (type === "sunshine" && detectedPath) {
        setSunshinePath(detectedPath);
        setSunshineAlert(t("settingsPage.detectedSunshinePath", { path: detectedPath }));
      } else if (type === "sunshine") {
        setSunshineAlert(t("settingsPage.noSunshinePath"));
      }

      if (type === "steamUsers" && detectedUsers.length > 0) {
        setSteamUsers(detectedUsers);
        if (!steamUsers.some((user) => user.id === steamId)) {
          setSteamId(detectedUsers[0].id); // Set the first detected user as default if current ID is not in the list
        }
        const formattedUsers = detectedUsers.map((user) => `${user.name} (${user.id})`);
        setSteamUsersAlert(
          t("settingsPage.detectedSteamUsers", { users: formattedUsers.join(", ") }),
        );
      } else if (type === "steamUsers") {
        setSteamUsersAlert(t("settingsPage.noSteamUsers"));
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
  const encryptAndStorePassword = async (plain: string) => {
    try {
      const encrypted = await window.cryptoAPI.encrypt(plain);
      setSunshinePassword(encrypted);
    } catch (error) {
      console.error("Encryption error:", error);
    }
  };

  const handlePasswordBlur = () => {
    encryptAndStorePassword(sunshinePlainPassword);
  };

  const decryptPasswordForDisplay = async (encrypted: string) => {
    try {
      const decrypted = await window.cryptoAPI.decrypt(encrypted);
      setSunshinePlainPassword(decrypted);
    } catch (error) {
      console.error("Decryption error:", error);
    }
  };

  useEffect(() => {
    if (sunshinePassword) {
      decryptPasswordForDisplay(sunshinePassword);
    }
  }, [sunshinePassword]);

  const handleBrowse = async (
    setPath: React.Dispatch<React.SetStateAction<string>>,
    setAlert: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    const path = await window.electron.openFileDialog();
    if (path) {
      setPath(path);
      setAlert(t("settingsPage.manuallySelectedPath"));
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
    <Box>
      <Typography variant="h4" gutterBottom>
        {t("settingsPage.title")}
      </Typography>

      <Grid2 container spacing={3}>
        {/* General Settings Section */}

        <SettingsSection sectionTitle={t("settingsPage.generalSectionTitle")}>
          <FormControl fullWidth size="small">
            <InputLabel>{t("settingsPage.language")}</InputLabel>
            <Select
              size="small"
              value={language}
              onChange={(e: any) => setLanguage(e.target.value)}
              label={t("settingsPage.language")}
              variant="outlined"
            >
              <MenuItem value="fr">{t("settingsPage.languageFr")}</MenuItem>
              <MenuItem value="en">{t("settingsPage.languageEn")}</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>{t("settingsPage.themeColor")}</InputLabel>
            <Select
              value={themeMode}
              onChange={(e) => handleThemeChange(e.target.value)}
              label={t("settingsPage.themeColor")}
              fullWidth
            >
              <MenuItem value="light">{t("settingsPage.themeLight")}</MenuItem>
              <MenuItem value="dark">{t("settingsPage.themeDark")}</MenuItem>
              <MenuItem value="system">{t("settingsPage.themeSystem")}</MenuItem>
            </Select>
          </FormControl>
        </SettingsSection>

        {/* Sunshine Settings Section */}

        <SettingsSection sectionTitle={t("settingsPage.sunshineSectionTitle")}>
          <Box display="flex" alignItems="center">
            <TextField
              size="small"
              label={t("settingsPage.sunshinePath")}
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
            >
              {loading.sunshine ? <CircularProgress size={24} /> : <SearchIcon />}
            </IconButton>
          </Box>
          {sunshineAlert && <Alert severity="info">{sunshineAlert}</Alert>}

          {/* Sunshine Login and Password Fields */}
          <Box display="flex" sx={{ gap: 2 }}>
            <Box>
              <TextField
                size="small"
                label={t("settingsPage.sunshineLogin")}
                variant="outlined"
                fullWidth
                value={sunshineLogin}
                onChange={(e: any) => setSunshineLogin(e.target.value)}
                sx={{ flex: 1 }}
              />
            </Box>
            <Box>
              <TextField
                size="small"
                label={t("settingsPage.sunshinePassword")}
                variant="outlined"
                type={showPassword ? "text" : "password"}
                fullWidth
                value={sunshinePlainPassword}
                onChange={(e) => setSunshinePlainPassword(e.target.value)}
                onBlur={handlePasswordBlur}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>
        </SettingsSection>

        {/* Steam Settings Section */}

        <SettingsSection sectionTitle={t("settingsPage.steamSectionTitle")}>
          <Box display="flex" alignItems="center">
            <TextField
              size="small"
              label={t("settingsPage.steamPath")}
              variant="outlined"
              fullWidth
              value={steamPath}
              onChange={(e: any) => setSteamPath(e.target.value)}
              sx={{ flex: 1, marginRight: 2 }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    color="primary"
                    onClick={() => handleBrowse(setSteamPath, setSteamAlert)}
                  >
                    <FolderOpenIcon />
                  </IconButton>
                ),
              }}
            />
            <IconButton
              color="primary"
              onClick={() => handleScan("steam")}
              disabled={loading.steam}
            >
              {loading.steam ? <CircularProgress size={24} /> : <SearchIcon />}
            </IconButton>
          </Box>
          {steamAlert && <Alert severity="info">{steamAlert}</Alert>}

          {/* Steam Users */}
          <Box display="flex" alignItems="center">
            <FormControl fullWidth sx={{ flex: 1, marginRight: 2 }}>
              <InputLabel>{t("settingsPage.steamId")}</InputLabel>
              <Select
                size="small"
                value={steamId}
                onChange={(e: any) => setSteamId(e.target.value)}
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
              onClick={() => handleScan("steamUsers")}
              disabled={loading.steamUsers}
            >
              {loading.steamUsers ? <CircularProgress size={24} /> : <SearchIcon />}
            </IconButton>
          </Box>
          {steamUsersAlert && <Alert severity="info">{steamUsersAlert}</Alert>}
        </SettingsSection>
      </Grid2>
      {/* Save Button */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={saveSettings}
        sx={{ marginTop: 3, width: "200px" }}
      >
        {t("settingsPage.save")}
      </Button>
    </Box>
  );
};

export default SettingsPage;
