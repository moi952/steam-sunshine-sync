import React from "react";
import { TextField, IconButton, InputAdornment, Box, CircularProgress } from "@mui/material";
import { FolderOpen as FolderOpenIcon, Search as SearchIcon } from "@mui/icons-material";

interface PathInputProps {
  label: string;
  value: string;
  onChange: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  onBrowse: () => void;
  onScan: () => void;
  loading: boolean;
}

const PathInput: React.FC<PathInputProps> = ({
  label,
  value,
  onChange,
  onBrowse,
  onScan,
  loading,
}) => (
  <Box display="flex" alignItems="center">
    <TextField
      size="small"
      label={label}
      variant="outlined"
      fullWidth
      value={value}
      onChange={onChange}
      sx={{ flex: 1, marginRight: 2 }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton color="primary" onClick={onBrowse}>
              <FolderOpenIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
    <IconButton color="primary" onClick={onScan} disabled={loading}>
      {loading ? <CircularProgress size={24} /> : <SearchIcon />}
    </IconButton>
  </Box>
);

export default PathInput;
