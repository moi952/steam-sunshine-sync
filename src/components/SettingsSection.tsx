import React from "react";
import { Box, Grid2, Paper, PaperProps, Typography } from "@mui/material";

interface SettingsSectionProps extends PaperProps {
  children: React.ReactNode;
  sectionTitle: string;
}

const SettingsSection = ({ children, sectionTitle, ...props }: SettingsSectionProps) => (
  <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 4 }}>
    <Paper
      elevation={4}
      sx={{
        borderRadius: "8px",
        padding: 3,
      }}
      {...props}
    >
      <Typography variant="h6" sx={{ marginBottom: "24px", textAlign: "center" }}>
        {sectionTitle}
      </Typography>
      <Box display="flex" flexDirection="column" sx={{ gap: 3 }}>
        {children}
      </Box>
    </Paper>
  </Grid2>
);

export default SettingsSection;
