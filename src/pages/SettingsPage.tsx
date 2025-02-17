import React, { useState, useEffect } from "react";
import { Box, Button, Grid2, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useThemeModeContext } from "../context/ThemeModeContext";
import { useSettings } from "../context/SettingsContext";
import { ThemeMode, SteamUserType } from "../types";
import GeneralSettings from "../components/GeneralSettings";
import SunshineSettings from "../components/SunshineSettings";
import SteamSettings from "../components/SteamSettings";

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
          setSteamId(detectedUsers[0].id);
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

  const handleThemeChange = (value: ThemeMode) => {
    setThemeMode(value);
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
        <GeneralSettings
          language={language}
          themeMode={themeMode}
          onLanguageChange={setLanguage}
          onThemeChange={handleThemeChange}
        />

        <SunshineSettings
          sunshinePath={sunshinePath}
          sunshineLogin={sunshineLogin}
          sunshinePassword={sunshinePlainPassword}
          showPassword={showPassword}
          sunshineAlert={sunshineAlert}
          loading={loading.sunshine}
          onSunshinePathChange={setSunshinePath}
          onSunshineLoginChange={setSunshineLogin}
          onSunshinePasswordChange={setSunshinePlainPassword}
          onShowPasswordChange={setShowPassword}
          onScan={() => handleScan("sunshine")}
          onBrowse={() => handleBrowse(setSunshinePath, setSunshineAlert)}
          onPasswordBlur={handlePasswordBlur}
        />

        <SteamSettings
          steamPath={steamPath}
          steamId={steamId}
          steamUsers={steamUsers}
          steamAlert={steamAlert}
          steamUsersAlert={steamUsersAlert}
          loading={{ steam: loading.steam, steamUsers: loading.steamUsers }}
          onSteamPathChange={setSteamPath}
          onSteamIdChange={setSteamId}
          onScan={handleScan}
          onBrowse={handleBrowse}
          setSteamAlert={setSteamAlert}
        />
      </Grid2>

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
