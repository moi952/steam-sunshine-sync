import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";

interface MenuItemProps {
  icon: ReactNode;
  path?: string;
  label: string;
  onClick?: () => void;
  isMini?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  isMini = false,
  icon,
  path,
  label,
  onClick,
}: MenuItemProps) => (
  <ListItem
    disablePadding
    onClick={onClick}
    component={path ? Link : "div"}
    {...(path ? { to: path } : {})}
  >
    <ListItemButton>
      <ListItemIcon
        sx={{
          minWidth: "20px",
          ...(!isMini ? { marginRight: "16px" } : {}),
        }}
      >
        {icon}
      </ListItemIcon>

      {!isMini && <ListItemText primary={label} sx={{ fontWeight: "bold" }} />}
    </ListItemButton>
  </ListItem>
);

export default MenuItem;
