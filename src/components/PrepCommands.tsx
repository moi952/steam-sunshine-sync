import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Add, DeleteForever } from "@mui/icons-material";
import React from "react";
import { PrepCommand } from "../types";

const PrepCommands: React.FC<{
  prepCmds: PrepCommand[];
  onChange: (_index: number, _field: keyof PrepCommand, _value: any) => void;
  onAdd: () => void;
  onRemove: (_index: number) => void;
}> = ({ prepCmds, onChange, onAdd, onRemove }) => {
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
        {t("sunshineGameConfig.prepCommands")}
      </Typography>
      {prepCmds.map((cmd, index) => (
        <Stack key={index} direction="row" spacing={2} alignItems="center">
          <TextField
            size="small"
            label={t("sunshineGameConfig.doCommand")}
            value={cmd.do}
            onChange={(e) => onChange(index, "do", e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            size="small"
            label={t("sunshineGameConfig.undoCommand")}
            value={cmd.undo}
            onChange={(e) => onChange(index, "undo", e.target.value)}
            fullWidth
            margin="normal"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={cmd.elevated}
                onChange={() => onChange(index, "elevated", !cmd.elevated)}
              />
            }
            label={t("sunshineGameConfig.elevated")}
          />
          <IconButton onClick={() => onRemove(index)} size="small">
            <DeleteForever sx={{ color: "red" }} />
          </IconButton>
        </Stack>
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

export default PrepCommands;
