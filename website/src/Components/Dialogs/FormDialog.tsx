import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { FC } from "react";
import { FormDialogProps } from "../../types/commonTypes";

const FormDialog: FC<FormDialogProps> = ({
  open,
  onClose,
  title,
  children,
  onSubmit,
}) => {
  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            onSubmit(event);
            onClose();
          },
        }}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent sx={{ width: 900 }}>{children}</DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default FormDialog;
