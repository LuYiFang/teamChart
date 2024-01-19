import React, { useState } from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import { IconButton } from "@mui/material";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const memberWidth = 240;
const messageWidth = 340;

type SidbarComponentProps = React.PropsWithChildren<{
  anchor?: "bottom" | "left" | "right" | "top" | undefined;
  isOpen: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}>;

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

const OpenTab: React.FC<SidbarComponentProps> = (props) => {
  const { anchor = "left", isOpen, onClick } = props;
  const realAnchor = anchor === "left" ? "right" : "left";
  const realAnchorWidth = anchor === "left" ? -20 : -25;
  let arrowRotation = isOpen ? "rotate(0deg)" : "rotate(180deg)";
  if (anchor === "right") {
    arrowRotation = isOpen ? "rotate(180deg)" : "rotate(0deg)";
  }

  let hiddenborder = anchor === "left" ? "borderLeftWidth" : "borderRightWidth";
  return (
    <>
      <Box
        position="absolute"
        sx={{
          zIndex: (theme: Theme) => theme.zIndex.drawer - 1,
          [realAnchor]: realAnchorWidth,
          top: (theme: Theme) => theme.spacing(1),
          borderStyle: "solid",
          borderWidth: 1,
          [hiddenborder]: 0,
          borderColor: "#d1cfcf",
          borderRadius: "50%",
          height: 25,
          width: 25,
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          backgroundColor: (theme: Theme) => theme.palette.primary.light,
          ...(!isOpen && {
            transition: (theme: Theme) => ({
              transition: theme.transitions.create(realAnchor, {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            }),
          }),
        }}
      >
        <IconButton onClick={onClick} sx={{ width: 25, height: 25 }}>
          <ArrowBackIosNewIcon
            sx={{
              transform: arrowRotation,
              transition: "transform 0.5s ease",
              color: (theme: Theme) => theme.palette.primary.contrastText,
            }}
          />
        </IconButton>
      </Box>
    </>
  );
};

const Sidebar: React.FC<SidbarComponentProps> = (props) => {
  const { anchor = "left", isOpen, onClick } = props;

  return (
    <>
      <Drawer
        open={isOpen}
        anchor={anchor}
        variant="permanent"
        PaperProps={{ style: { overflow: "visible" } }}
      >
        <OpenTab anchor={anchor} isOpen={isOpen} onClick={onClick} />
        {props.children}
      </Drawer>
    </>
  );
};
export default Sidebar;
