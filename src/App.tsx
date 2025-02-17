import React, { useEffect, useState, useRef } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box, IconButton, Divider } from "@mui/material";
import { styled, Theme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HomePage from "./pages/HomePage";
import SettingsPage from "./pages/SettingsPage";
import "./i18n"; // Initialize i18n
import { useThemeModeContext, ThemeModeProvider } from "./context/ThemeModeContext";
import Menu from "./layout/Menu";
import { SettingsProvider } from "./context/SettingsContext";
import SelectedGames from "./components/SelectedGames";
import ExportedGames from "./components/ExportedGames";
import GameConfigPage from "./pages/GameConfigPage";
import ScanGamesPage from "./pages/ScanGamesPage";
import getTheme from "./theme/theme";
import SunshinePage from "./pages/SunshinePage";

const drawerWidthMini = 60;

const openedMixin = (theme: Theme): any => ({
  width: "fit-content",
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): any => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: drawerWidthMini,
});

interface DrawerProps {
  open: boolean;
}

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})<DrawerProps>(({ theme, open }) => ({
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open ? openedMixin(theme) : closedMixin(theme)),
  "& .MuiDrawer-paper": open ? openedMixin(theme) : closedMixin(theme),
}));

const AppContent: React.FC = () => {
  const { themeMode, currentMode, toggleTheme } = useThemeModeContext();
  const [open, setOpen] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState<number>(drawerWidthMini);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && drawerRef.current) {
      setDrawerWidth(drawerRef.current.clientWidth);
    } else {
      setDrawerWidth(0);
    }
  }, [open]);

  return (
    <ThemeProvider theme={getTheme(currentMode)}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: "flex", height: "100vh" }}>
          {/* Drawer with ref to measure its width */}
          <Drawer variant="permanent" open={open} PaperProps={{ ref: drawerRef }}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
              <IconButton onClick={() => setOpen(!open)}>
                {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </IconButton>
            </Box>
            <Divider />
            <Menu themeMode={themeMode} onThemeToggle={toggleTheme} isMini={open} />
          </Drawer>

          {/* Main content with margin-left equal to the measured width of the Drawer */}
          <Box component="main" sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px` }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/scan-games" element={<ScanGamesPage />} />
              <Route path="/selected-games" element={<SelectedGames />} />
              <Route path="/exported-games" element={<ExportedGames />} />
              <Route path="/sunshine-apps" element={<SunshinePage />} />
              <Route path="/game-sunshine-edit/:uniqueId" element={<GameConfigPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </Box>
        </Box>
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
