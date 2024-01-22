import { ChangeEvent, FC, useMemo, useState } from "react";
import { Box, IconButton, Stack, TextField, Typography } from "@mui/material";
import { RippleAvatar } from "../Groups/Groups";
import { Person as PersonIcon, Send as SendIcon } from "@mui/icons-material";
import { UserOpenInfo } from "../../types/commonTypes";
import useWebSocket from "../../hook/useWebSocket";
import { webSocketRoot } from "../../apiConifg";

const MessagesBox: FC<{
  currentUserInfo: UserOpenInfo;
  currentGroup: string;
}> = ({ currentUserInfo, currentGroup }) => {
  const { sendMessage, messageGroup } = useWebSocket(webSocketRoot);
  const [message, setMessage] = useState("");

  const currentGroupMessages = useMemo(() => {
    return messageGroup[currentGroup] || [];
  }, [messageGroup, currentGroup]);

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
          alignItems: currentUserInfo.name === name ? "flex-end" : "flex-start",
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{
            display:
              preName === name || name === currentUserInfo.name
                ? "none"
                : "flex",
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
              currentUserInfo.name === name
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

  const handleChangeMessage = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    sendMessage(
      JSON.stringify({
        username: currentUserInfo.name,
        groupId: currentGroup,
        message: message,
        type: "newMessage",
      }),
    );

    setMessage("");
  };

  return (
    <>
      <Box
        sx={{
          height: "100%",
          width: 340,
        }}
      >
        <Box
          sx={{ height: "calc( 100% - 90px)", overflowY: "auto", p: 2, pb: 4 }}
        >
          {currentGroupMessages.map((item: any, index) => {
            const preName = (currentGroupMessages[index - 1] || {}).username;
            return generateMessage(item.username, item.message, preName, index);
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
            value={message}
            onChange={handleChangeMessage}
          />
          <IconButton
            sx={{
              color: (theme) => theme.palette.primary.light,
              maxHeight: 40,
              maxWidth: 40,
            }}
            onClick={handleSendMessage}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </>
  );
};

export default MessagesBox;
