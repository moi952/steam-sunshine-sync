import { useTranslation } from "react-i18next";
import { Box, Button, IconButton, Stack, TextField, Typography } from "@mui/material";
import { Add, DeleteForever } from "@mui/icons-material";
import React from "react";

const DetachedCommands: React.FC<{
  detached: string[];
  onChange: (_index: number, _value: any) => void;
  onAdd: () => void;
  onRemove: (_index: number) => void;
}> = ({ detached, onChange, onAdd, onRemove }) => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        border: "1px solid grey",
        borderRadius: "8px",
        p: "16px",
        gap: "16px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="body1" gutterBottom>
        {t("sunshineAppConfig.detachedProcesses")}
      </Typography>
      {Array.isArray(detached) &&
        detached.map((detachedItem, index) => (
          <Box key={index}>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                size="small"
                fullWidth
                label={t("sunshineAppConfig.detachedProcesses")}
                value={detachedItem}
                onChange={(e) => onChange(index, e.target.value)}
                margin="normal"
              />
              <IconButton aria-label="delete" size="small" onClick={() => onRemove(index)}>
                <DeleteForever sx={{ color: "red" }} />
              </IconButton>
            </Stack>
          </Box>
        ))}
      <Box>
        <Button
          variant="contained"
          color="primary"
          onClick={onAdd}
          size="small"
          sx={{ minWidth: "20px", padding: "4px" }}
        >
          <Add />
        </Button>
      </Box>
    </Box>
  );
};

export default DetachedCommands;
