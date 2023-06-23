import { createTheme } from "@mui/material";

const primaryColor = "#2a446a";
const secondaryColor = "#e98520";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: secondaryColor,
    },
    action: {
      active: secondaryColor,
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: secondaryColor,
    },
    action: {
      active: secondaryColor,
    },
  },
});
