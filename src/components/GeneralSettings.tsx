import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ThemeMode } from "../types";
import SettingsSection from "./SettingsSection";

interface GeneralSettingsProps {
  language: string;
  themeMode: ThemeMode;
  onLanguageChange: (_value: string) => void;
  onThemeChange: (_value: ThemeMode) => void;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({
  language,
  themeMode,
  onLanguageChange,
  onThemeChange,
}) => {
  const { t } = useTranslation();

  return (
    <SettingsSection sectionTitle={t("settingsPage.generalSectionTitle")}>
      <FormControl fullWidth size="small">
        <InputLabel>{t("settingsPage.language")}</InputLabel>
        <Select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          label={t("settingsPage.language")}
        >
          <MenuItem value="fr">{t("settingsPage.languageFr")}</MenuItem>
          <MenuItem value="en">{t("settingsPage.languageEn")}</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth size="small">
        <InputLabel>{t("settingsPage.themeColor")}</InputLabel>
        <Select
          value={themeMode}
          onChange={(e) => onThemeChange(e.target.value as ThemeMode)}
          label={t("settingsPage.themeColor")}
        >
          <MenuItem value="light">{t("settingsPage.themeLight")}</MenuItem>
          <MenuItem value="dark">{t("settingsPage.themeDark")}</MenuItem>
          <MenuItem value="system">{t("settingsPage.themeSystem")}</MenuItem>
        </Select>
      </FormControl>
    </SettingsSection>
  );
};

export default GeneralSettings;
