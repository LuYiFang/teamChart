import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
} from "@mui/material";
import _ from "lodash";
import { FC } from "react";

export const SingleDialog: FC<{
  onClose: () => void;
  index: string;
  msg: string;
  title: string;
}> = ({ onClose, index, msg, title }) => {
  const indexNumber = parseInt(index);

  return (
    <Paper
      elevation={3}
      sx={{
        "&": {
          position: "absolute",
          top: 32 + indexNumber * 50,
          left: 64 + indexNumber * 50,
          height: 350,
          width: 450,
          zIndex: (theme) => theme.zIndex.drawer + 4,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        },
      }}
    >
      <div
        className="swal2-icon swal2-warning swal2-icon-show"
        style={{ display: "flex" }}
      >
        <div className="swal2-icon-content">!</div>
      </div>
      <h2
        className="swal2-title"
        id="swal2-title"
        style={{ display: "block", width: "fit-content" }}
      >
        {title}
      </h2>
      <div
        className="swal2-html-container"
        id="swal2-html-container"
        style={{ display: "block", width: "fit-content" }}
      >
        {msg}
      </div>
      <DialogActions sx={{ mt: 1.5 }}>
        <Button
          sx={{
            backgroundColor: "#7066e0",
            "&:hover": { backgroundColor: "#5c549e" },
          }}
          variant="contained"
          onClick={() => {
            if (!onClose) return;
            onClose();
          }}
        >
          OK
        </Button>
      </DialogActions>
    </Paper>
  );
};
