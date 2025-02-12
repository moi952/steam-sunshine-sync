import React from "react";
import { Box, List, ListItemButton, ListItemIcon } from "@mui/material";
import { Home, Settings, DarkMode, LightMode, BrightnessAuto } from "@mui/icons-material"; // Icons for the menu
import { Link } from "react-router-dom";

interface MenuProps {
  themeMode: "light" | "dark" | "system";
  onThemeToggle: () => void;
}

const Menu: React.FC<MenuProps> = ({ themeMode, onThemeToggle }) => {
  console.log("Current themeMode:", themeMode); // Debugging

  return (
    <Box sx={{ width: "fit-content", padding: "10px" }}>
      <List sx={{ gap: "10px", display: "flex", flexDirection: "column" }}>
        <ListItemButton component={Link} to="/">
          <ListItemIcon sx={{ minWidth: "20px" }}>
            <Home />
          </ListItemIcon>
        </ListItemButton>

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
