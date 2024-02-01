import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { FC, FormEvent, MouseEvent, useRef } from "react";
import { FormDialogProps } from "../../types/commonTypes";

const FormDialog: FC<FormDialogProps> = ({
  open,
  onClose,
  title,
  children,
  onClick,
  customButton,
}) => {
  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        PaperProps={{
          component: "form",
        }}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent sx={{ width: 900 }}>{children}</DialogContent>
        <DialogActions>
          {customButton ? customButton : ""}
          <Button onClick={onClose}>Cancel</Button>
          <Button
            color="secondary"
            type="submit"
            name="call"
            onClick={(event) => {
              // event.preventDefault();
              onClick(event);
              onClose();
            }}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default FormDialog;
