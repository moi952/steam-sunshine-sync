import { createTheme } from "@mui/material/styles";

const getTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
    },
    components: {
      MuiListItemText: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.text.primary,
          }),
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            color: "#007bff",
            textDecoration: "none",
          },
        },
      },
    },
  });

export default getTheme;
