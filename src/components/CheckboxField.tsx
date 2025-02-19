import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import React from "react";

const CheckboxField: React.FC<{ label: string; checked: boolean; onChange: () => void }> = ({
  label,
  checked,
  onChange,
}) => (
  <FormControlLabel
    control={<Checkbox size="small" checked={checked} onChange={onChange} />}
    label={<Typography variant="body2">{label}</Typography>}
  />
);

export default CheckboxField;
