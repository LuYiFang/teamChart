import { FC } from "react";
import { Box, IconButton, Stack, TextField, Typography } from "@mui/material";
import { RippleAvatar } from "../Groups/Groups";
import { Person as PersonIcon, Send as SendIcon } from "@mui/icons-material";
import { User } from "../../types/commonTypes";

const MessagesBox: FC<{
  messages: Array<{ name: string; message: string }>;
  currentUser: string;
}> = ({ messages, currentUser }) => {
  const generateMessage = (
    name: string,
    message: string,
    preName: string | undefined,
    index: number,
  ): React.ReactElement => {
    return (
      <Stack
        key={`message-${index}`}
        spacing={1}
        sx={{
          mx: 2,
          alignItems: currentUser === name ? "flex-end" : "flex-start",
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{
            display: preName === name || name === currentUser ? "none" : "flex",
            alignItems: "center",
            pt: 2,
          }}
        >
          <RippleAvatar>
            <PersonIcon />
          </RippleAvatar>
          <Typography sx={{ fontWeight: "bold" }}>{name}</Typography>
        </Stack>

        <Box
          sx={{
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "rgba(0, 0, 0, 0.12)",
            borderRadius: "7%",
            ml: 8,
            width: "fit-content",
            maxWidth: "100%",
            p: 1,
            backgroundColor: (theme) =>
              currentUser === name
                ? theme.palette.secondary.light
                : theme.palette.primary.light,
          }}
        >
          <Typography
            sx={{
              width: "fit-content",
              textAlign: "start",
              maxWidth: "100%",
              wordBreak: "break-all",
              whiteSpace: "pre-wrap",
              color: (theme) => theme.palette.text.primary,
            }}
          >
            {message}
          </Typography>
        </Box>
      </Stack>
    );
  };

  return (
    <>
      <Box
        sx={{
          height: "100%",
          width: 340,
        }}
      >
        <Box sx={{ height: "calc( 100% - 90px)", overflowY: "auto" }}>
          {messages.map((item: any, index) => {
            const preName = (messages[index - 1] || {}).name;
            return generateMessage(item.name, item.message, preName, index);
          })}
        </Box>
        <Box
          sx={{
            height: 90,
            borderWidth: 0,
            borderTopWidth: 1,
            borderStyle: "solid",
            borderColor: (theme) => theme.palette.primary.light,
            px: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            InputProps={{
              sx: {
                color: (theme) => theme.palette.text.primary,
                backgroundColor: (theme) => theme.palette.primary.light,
              },
            }}
            sx={{
              "&": {
                height: "fit-content",
              },
            }}
            fullWidth
            multiline
            rows={1}
            variant="outlined"
          />
          <IconButton
            sx={{
              color: (theme) => theme.palette.primary.light,
              maxHeight: 40,
              maxWidth: 40,
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </>
  );
};

export default MessagesBox;
