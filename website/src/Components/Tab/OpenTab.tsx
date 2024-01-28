import { Box, IconButton, Theme } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { SidbarComponentProps } from "../../types/commonTypes";

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

export default OpenTab;
