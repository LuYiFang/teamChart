import { Alert, IconButton } from "@mui/material";
import { Clear as ClearIcon } from "@mui/icons-material";
import { forwardRef } from "react";
import _ from "lodash";
import { RippleStyledAvatar } from "../Avatars/RippleAvatar";

const BroadcastInfo = forwardRef<
  HTMLDivElement,
  { key: string; message: string; username: string; onClose: () => void }
>(({ key, message, username, onClose }, ref) => {
  return (
    <Alert
      ref={ref}
      id={key}
      severity="info"
      icon={
        <RippleStyledAvatar sx={{ width: 24, height: 24, fontSize: "0.9rem" }}>
          {_.slice(username, 0, 2)}
        </RippleStyledAvatar>
      }
      action={
        <IconButton sx={{ color: "white" }} onClick={onClose}>
          <ClearIcon />
        </IconButton>
      }
      sx={{
        "& .MuiAlert-action": {
          pt: 0,
        },
        "&": {
          backgroundColor: (theme) => theme.palette.primary.dark,
          color: "white",
        },
        "& .MuiAlert-icon": {
          color: "white",
        },
        "& .MuiAlert-message": {
          whiteSpace: "pre-wrap",
          overflowWrap: "break-word",
          maxWidth: "70vw",
          textAlign: "left",
        },
      }}
    >
      {message}
    </Alert>
  );
});

export default BroadcastInfo;
