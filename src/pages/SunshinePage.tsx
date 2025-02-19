import React, { useEffect, useState } from "react";
import {
  Typography,
  Skeleton,
  Alert,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { SunshineAppConfigNew } from "../types";
import { useSettings } from "../context/SettingsContext";
import { normalizeLocalPath } from "../utils/pathFonctions";
import GameConfig from "../components/GameConfig";

const SunshinePage: React.FC = () => {
  const { settings } = useSettings();
  const { t } = useTranslation();
  const [sunshineApps, setSunshineApps] = useState<SunshineAppConfigNew[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [editedApp, setEditedApp] = useState<SunshineAppConfigNew | null>(null);
  const [normalizedImagePaths, setNormalizedImagePaths] = useState<{ [key: string]: string }>({});

  const fetchApps = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await window.electronSunshineApi.getApps();
      if (response?.apps) {
        setSunshineApps(response.apps);
      }
    } catch (err) {
      setError(`Error fetching apps: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (settings.sunshineLogin && settings.sunshinePassword) fetchApps();
    else setError(t("sunshinePage.noCredentials"));
  }, []);

  useEffect(() => {
    console.log("Loading apps", sunshineApps);
  }, [sunshineApps]);

  const handleEdit = (index: number) => {
    setExpandedIndex(index);
    setEditedApp({ ...sunshineApps[index] });
  };

  const handleCancel = () => {
    setExpandedIndex(null);
    setEditedApp(null);
  };

  const handleSave = async (app: SunshineAppConfigNew) => {
    if (expandedIndex !== null && editedApp !== null) {
      console.log("index", expandedIndex);
      console.log("app", app);

      try {
        const sunshineResponse = await window.electronSunshineApi.updateApp(expandedIndex, app);
        if (sunshineResponse && sunshineResponse.status) {
          handleCancel();
          fetchApps();
        }
      } catch (err) {
        setError(`Error fetching apps: ${err instanceof Error ? err.message : "Unknown error"}`);
      }
    }
  };

  const toggleExpanded = (index: number) => {
    if (expandedIndex === index) handleCancel();
    else handleEdit(index);
  };

  // Asynchronous function to normalize an image path
  const getAppImagePath = async (imageName: string): Promise<string> => {
    // Checks if imageName contains an extension (e.g., "toto-FR.jpg")
    if (/^[^/\\]+(\.[a-zA-Z0-9]+)$/.test(imageName)) {
      const { sunshinePath } = settings;
      // Concatenates the path and normalizes it
      return normalizeLocalPath(`${sunshinePath}/assets/${imageName}`);
    }
    // If imageName has no extension, simply normalize it
    return normalizeLocalPath(imageName);
  };

  // Loads normalized paths on initialization or when sunshineApps changes
  useEffect(() => {
    const loadNormalizedPaths = async () => {
      const paths: { [key: string]: string } = {};
      // For example, if each app has a unique identifier or we can use the index
      await Promise.all(
        sunshineApps.map(async (app, index) => {
          if (app["image-path"]) {
            const path = await getAppImagePath(app["image-path"]);
            paths[index] = path;
          }
        }),
      );
      setNormalizedImagePaths(paths);
    };

    loadNormalizedPaths();
  }, [sunshineApps, settings]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t("sunshinePage.title")}
      </Typography>

      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : loading ? (
        <Skeleton variant="rectangular" width="100%" height={200} sx={{ mb: 2 }} />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell />
                <TableCell>{t("sunshineGameConfig.applicationName")}</TableCell>
                <TableCell>{t("sunshineGameConfig.cmd")}</TableCell>
                <TableCell>{t("sunshinePage.actions")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sunshineApps.map((app, index) => (
                <React.Fragment key={index}>
                  <TableRow>
                    <TableCell>
                      <IconButton onClick={() => toggleExpanded(index)}>
                        {expandedIndex === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell sx={{ padding: 0 }}>
                      {app["image-path"] ? (
                        <img
                          src={normalizedImagePaths[index]}
                          alt={app.name}
                          style={{ width: 35, height: "auto" }}
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </TableCell>
                    <TableCell>{app.name}</TableCell>
                    <TableCell>{app.cmd}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(index)}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Form */}
                  <TableRow>
                    <TableCell colSpan={5} style={{ padding: 0 }}>
                      <Collapse in={expandedIndex === index} timeout="auto" unmountOnExit>
                        {editedApp && (
                          <Box sx={{ p: 2 }}>
                            <GameConfig
                              gameDetails={app}
                              onSave={handleSave}
                              handleCancel={handleCancel}
                            />
                          </Box>
                        )}
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default SunshinePage;
