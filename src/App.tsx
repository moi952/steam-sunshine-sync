import React, { useEffect } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { Drawer, ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import HomePage from "./pages/HomePage";
import SettingsPage from "./pages/SettingsPage";
import "./i18n"; // Initialize i18n
import { useThemeModeContext, ThemeModeProvider } from "./context/ThemeModeContext";
import Menu from "./layout/Menu";
import { SettingsProvider } from "./context/SettingsContext";

const AppContent: React.FC = () => {
  const { themeMode, currentMode, toggleTheme } = useThemeModeContext();

  // Create dynamic theme using currentMode from the shared context
  const theme = createTheme({
    palette: {
      mode: currentMode,
    },
  });

  useEffect(() => {
    console.log("Current mode App:", currentMode);
  }, [currentMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          {/* Side navigation bar */}
          <Drawer
            sx={{
              width: "fit-content",
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: "fit-content",
                boxSizing: "border-box",
              },
            }}
            variant="persistent"
            anchor="left"
            open
          >
            <Menu themeMode={themeMode} onThemeToggle={toggleTheme} />
          </Drawer>

          {/* Main content with spacing for sidebar */}
          <div style={{ marginLeft: "80px", padding: "20px" }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
};

const App: React.FC = () => (
  <SettingsProvider>
    <ThemeModeProvider>
      <AppContent />
    </ThemeModeProvider>
  </SettingsProvider>
);

export default App;
