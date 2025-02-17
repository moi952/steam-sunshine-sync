import React from "react";
import { Box, Divider, List } from "@mui/material";
import {
  Home,
  Settings,
  DarkMode,
  LightMode,
  BrightnessAuto,
  Gamepad,
  Search,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useSettings } from "../context/SettingsContext";
import MenuItem from "../components/layout/MenuItem";

interface MenuProps {
  themeMode: "light" | "dark" | "system";
  onThemeToggle: () => void;
  isMini: boolean;
}

const Menu: React.FC<MenuProps> = ({ themeMode, onThemeToggle, isMini }) => {
  const { settings } = useSettings();
  const { t } = useTranslation();

  return (
    <Box sx={{ width: "fit-content", paddingY: "10px" }}>
      <List sx={{ gap: "10px", display: "flex", flexDirection: "column" }}>
        <MenuItem isMini={!isMini} label={t("menu.home")} path="/" icon={<Home />} />
        {!settings.firstLaunch && (
          <>
            <MenuItem
              isMini={!isMini}
              label={t("menu.scan_games")}
              path="/scan-games"
              icon={<Search />}
            />
            {/* <MenuItem
              isMini={!isMini}
              label={t("menu.configure_games")}
              path="/selected-games"
              icon={<SportsEsports />}
            /> */}
            <MenuItem
              isMini={!isMini}
              label={t("menu.export_games")}
              path="/exported-games"
              icon={<Gamepad />}
            />
            <MenuItem
              isMini={!isMini}
              label={t("menu.sunshine_apps")}
              path="/sunshine-apps"
              icon={
                <img
                  src={`${process.env.PUBLIC_URL}/logo-sunshine.png`}
                  alt="Sunshine Apps"
                  style={{ width: 24, height: 24 }}
                />
              }
            />
          </>
        )}
        <Divider />
        <MenuItem
          isMini={!isMini}
          label={t("menu.settings")}
          path="/settings"
          icon={<Settings />}
        />
        <MenuItem
          isMini={!isMini}
          onClick={onThemeToggle}
          label={t("menu.theme")}
          icon={
            themeMode === "light" ? (
              <LightMode />
            ) : themeMode === "dark" ? (
              <DarkMode />
            ) : (
              <BrightnessAuto />
            )
          }
        />
      </List>
    </Box>
  );
};

export default Menu;
