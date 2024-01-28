import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#7275A6",
      contrastText: "#FFF",
    },
    secondary: {
      main: "#F2A679",
    },
    tonalOffset: {
      light: 0.6,
      dark: 0.4,
    },
    text: {
      primary: "#2C3759",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*::-webkit-scrollbar": {
          width: "5px",
        },
        "*::-webkit-scrollbar-track": {
          background: "#525477",
        },
        "*::-webkit-scrollbar-thumb": {
          background: "#a0a3dd",
        },
        "*::-webkit-scrollbar-thumb:hover": {
          background: "#a0a3dd",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        variant: "contained",
      },
    },
  },
});

export default theme;
