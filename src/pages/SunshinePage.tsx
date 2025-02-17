import React, { useEffect, useState } from "react";
import { Typography, Skeleton, Alert, Grid2, Box } from "@mui/material";
import { useTranslation } from "react-i18next";

const SunshinePage: React.FC = () => {
  const { t } = useTranslation();
  const [sunshineApps, setSunshineApps] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        setLoading(true); // Set loading to true while fetching data
        setError(null); // Reset error before the new request
        const response = await window.electronSunshineApi.getApps();
        if (response && response.apps) {
          console.log(response.apps);
          setSunshineApps(response.apps); // Store the fetched apps
        }
      } catch (err) {
        setError(`Error fetching apps: ${err instanceof Error ? err.message : "Unknown error"}`);
      } finally {
        setLoading(false); // Stop loading once the request is complete
      }
    };

    fetchApps();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t("sunshinePage.title")}
      </Typography>

      <Grid2 container spacing={3}>
        {/* Display error alert if there's an error */}
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : loading ? (
          <Skeleton variant="rectangular" width="100%" height={200} sx={{ mb: 2 }} />
        ) : sunshineApps.length > 0 ? (
          sunshineApps.map((app, index) => <div key={index}>{app.name}</div>)
        ) : (
          <Typography align="center">{t("sunshinePage.noApps")}</Typography>
        )}
      </Grid2>
    </Box>
  );
};

export default SunshinePage;
