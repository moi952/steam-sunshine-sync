import React from "react";
import { Box, TextField, IconButton, InputAdornment, Alert } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import PathInput from "./PathInput";
import SettingsSection from "./SettingsSection";

interface SunshineSettingsProps {
  sunshinePath: string;
  sunshineLogin: string;
  sunshinePassword: string;
  showPassword: boolean;
  sunshineAlert: string;
  loading: boolean;
  onSunshinePathChange: (_value: string) => void;
  onSunshineLoginChange: (_value: string) => void;
  onSunshinePasswordChange: (_value: string) => void;
  onShowPasswordChange: (_value: boolean) => void;
  onScan: () => void;
  onBrowse: () => void;
  onPasswordBlur: () => void;
}

const SunshineSettings: React.FC<SunshineSettingsProps> = ({
  sunshinePath,
  sunshineLogin,
  sunshinePassword,
  showPassword,
  sunshineAlert,
  loading,
  onSunshinePathChange,
  onSunshineLoginChange,
  onSunshinePasswordChange,
  onShowPasswordChange,
  onScan,
  onBrowse,
  onPasswordBlur,
}) => {
  const { t } = useTranslation();

  return (
    <SettingsSection sectionTitle={t("settingsPage.sunshineSectionTitle")}>
      <PathInput
        label={t("settingsPage.sunshinePath")}
        value={sunshinePath}
        onChange={(e) => onSunshinePathChange(e.target.value)}
        onBrowse={onBrowse}
        onScan={onScan}
        loading={loading}
      />
      {sunshineAlert && <Alert severity="info">{sunshineAlert}</Alert>}

      <Box display="flex" sx={{ gap: 2 }}>
        <Box>
          <TextField
            size="small"
            label={t("settingsPage.sunshineLogin")}
            variant="outlined"
            fullWidth
            value={sunshineLogin}
            onChange={(e) => onSunshineLoginChange(e.target.value)}
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
            value={sunshinePassword}
            onChange={(e) => onSunshinePasswordChange(e.target.value)}
            onBlur={onPasswordBlur}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => onShowPasswordChange(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
    </SettingsSection>
  );
};

export default SunshineSettings;
