import React from "react";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import { SidbarComponentProps } from "../../types/commonTypes";

const memberWidth = 240;
const messageWidth = 340;

const openedMixin = (theme: Theme, anchor: string | undefined): CSSObject => {
  return {
    width: anchor === "right" ? messageWidth : memberWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  };
};

const closedMixin = (theme: Theme, anchor: string | undefined): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: anchor === "right" ? 0 : `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: anchor === "right" ? 0 : `calc(${theme.spacing(8)} + 1px)`,
  },
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open, anchor }) => {
  return {
    width: anchor === "right" ? messageWidth : memberWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    overflow: "visible",
    ...(open && {
      ...openedMixin(theme, anchor),
      "& .MuiDrawer-paper": openedMixin(theme, anchor),
    }),
    ...(!open && {
      ...closedMixin(theme, anchor),
      "& .MuiDrawer-paper": closedMixin(theme, anchor),
    }),
  };
});

const Sidebar: React.FC<SidbarComponentProps> = (props) => {
  const { anchor = "left", isOpen, hidden = false, children } = props;

  return (
    <>
      <Drawer
        hidden={hidden}
        open={isOpen}
        anchor={anchor}
        variant="permanent"
        PaperProps={{ style: { overflow: "visible" } }}
      >
        {children}
      </Drawer>
    </>
  );
};
export default Sidebar;
