import React from "react";
import { Box, List, ListItemButton, ListItemIcon } from "@mui/material";
import {
  Home,
  Settings,
  DarkMode,
  LightMode,
  BrightnessAuto,
  Games,
  Gamepad,
} from "@mui/icons-material"; // Icons for the menu
import { Link } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";

interface MenuProps {
  themeMode: "light" | "dark" | "system";
  onThemeToggle: () => void;
}

const Menu: React.FC<MenuProps> = ({ themeMode, onThemeToggle }) => {
  const { settings } = useSettings();

  return (
    <Box sx={{ width: "fit-content", padding: "10px" }}>
      <List sx={{ gap: "10px", display: "flex", flexDirection: "column" }}>
        <ListItemButton component={Link} to="/">
          <ListItemIcon sx={{ minWidth: "20px" }}>
            <Home />
          </ListItemIcon>
        </ListItemButton>

        {!settings.firstLaunch && (
          <>
            <ListItemButton component={Link} to="/scan-games">
              <ListItemIcon sx={{ minWidth: "20px" }}>
                <Games />
              </ListItemIcon>
            </ListItemButton>
            <ListItemButton component={Link} to="/selected-games">
              <ListItemIcon sx={{ minWidth: "20px" }}>
                <Games />
              </ListItemIcon>
            </ListItemButton>
            <ListItemButton component={Link} to="/exported-games">
              <ListItemIcon sx={{ minWidth: "20px" }}>
                <Gamepad />
              </ListItemIcon>
            </ListItemButton>
          </>
        )}
        <ListItemButton component={Link} to="/settings">
          <ListItemIcon sx={{ minWidth: "20px" }}>
            <Settings />
          </ListItemIcon>
        </ListItemButton>

        <ListItemButton onClick={onThemeToggle}>
          <ListItemIcon sx={{ minWidth: "20px" }}>
            {themeMode === "light" ? (
              <LightMode />
            ) : themeMode === "dark" ? (
              <DarkMode />
            ) : (
              <BrightnessAuto />
            )}
          </ListItemIcon>
        </ListItemButton>
      </List>
    </Box>
  );
};

export default Menu;
