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
    // tertiary: {
    //     main: "#AA9BBF",
    // },
    // fourthiary: {
    //     main: "#F26E50",
    // },
    // warning: {
    //   main: "#F26E50",
    // },
    // success: {
    //   main: "#7275A6",
    // },
    // info: {
    //   main: info,

    // },
    // buttonPrimary: {
    //   main: button,

    // },
    text: {
      primary: "#2C3759",
    },
    // background: {
    //   default: '#F6F7FF',
    //   light: '#F3F5FF'
    // }
  },
});

export default theme;
