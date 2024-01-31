import { Backdrop, Box, Button, Dialog, Paper } from "@mui/material";
import _ from "lodash";
import { FC } from "react";

const ChainDialog: FC<{ onClose: () => void }> = (props) => {
  const { onClose } = props;

  console.log("onClose", onClose);
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Backdrop open={true} sx={{ zIndex: (theme) => theme.zIndex.drawer + 3 }}>
        {_.map(_.range(8), (i) => {
          return (
            <Paper
              key={`chain-dialog-${i}`}
              elevation={3}
              sx={{
                "&": {
                  position: "absolute",
                  top: 32 + i * 50,
                  left: 64 + i * 50,
                  height: 300,
                  width: 400,
                  zIndex: (theme) => theme.zIndex.drawer + 4,
                },
              }}
            >
              I am dialog{i}
              <Button
                onClick={() => {
                  if (!onClose) return;
                  onClose();
                }}
              >
                OK
              </Button>
            </Paper>
          );
        })}
      </Backdrop>
    </div>
  );
};
export default ChainDialog;
