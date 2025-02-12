import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import { ThemeMode } from "../types";

type CurrentModeType = "light" | "dark";

interface ThemeModeContextProps {
  themeMode: ThemeMode;
  currentMode: CurrentModeType;
  toggleTheme: () => void;
  setTheme: (_theme: ThemeMode) => void;
}

const ThemeModeContext = createContext<ThemeModeContextProps | undefined>(undefined);

export const ThemeModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");
  const [currentMode, setCurrentMode] = useState<CurrentModeType>("light");

  const setCurrentModeFromTheme = (theme: ThemeMode) => {
    if (theme === "light") {
      setCurrentMode("light");
    } else if (theme === "dark") {
      setCurrentMode("dark");
    } else {
      const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setCurrentMode(prefersDarkMode ? "dark" : "light");
    }
  };

  useEffect(() => {
    setCurrentModeFromTheme(themeMode);
  }, [themeMode]);

  useEffect(() => {
    // Load saved settings on startup
    const loadSettings = async () => {
      const settings = await window.electronSettingsStorageApi.getSettings();
      setThemeMode(settings.themeMode || "system");
    };
    loadSettings();

    // Add listener for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (themeMode === "system") {
        setThemeMode(e.matches ? "dark" : "light");
      }
    };
    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  // Toggle between light, dark, and system modes
  const toggleTheme = () => {
    const newTheme = themeMode === "light" ? "dark" : themeMode === "dark" ? "system" : "light";
    setThemeMode(newTheme);
    window.electronSettingsStorageApi.saveSettings({ themeMode: newTheme });
  };

  const setTheme = (theme: ThemeMode) => {
    setThemeMode(theme);
    console.log("Theme set to:", theme);
    window.electronSettingsStorageApi.saveSettings({ themeMode: theme });
  };

  const contextValue = useMemo(
    () => ({ themeMode, currentMode, toggleTheme, setTheme }),
    [themeMode, currentMode, toggleTheme, setTheme],
  );

  return <ThemeModeContext.Provider value={contextValue}>{children}</ThemeModeContext.Provider>;
};

export const useThemeModeContext = () => {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error("useThemeModeContext must be used within a ThemeModeProvider");
  }
  return context;
};
