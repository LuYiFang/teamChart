import {
  ChangeEvent,
  FC,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  Box,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import {
  MessageGroup,
  SendMessage,
  UserMap,
  UserOpenInfo,
} from "../../types/commonTypes";
import { groupPublic } from "../../Utility/contants";
import _ from "lodash";
import RippleAvatar from "../Avatars/RippleAvatar";
import moment from "moment";

const MessagesBox: FC<{
  currentUserInfo: UserOpenInfo;
  currentGroup: string;
  sendMessage: SendMessage;
  messageGroup: MessageGroup;
  userMap: UserMap;
}> = ({
  currentUserInfo,
  currentGroup,
  sendMessage,
  messageGroup,
  userMap,
}) => {
  const [textValue, setTextValue] = useState("");
  const [message, setMessage] = useState("");

  const boxRef = useRef<HTMLDivElement>(null);

  const currentGroupMessages = useMemo(() => {
    return messageGroup[currentGroup] || [];
  }, [messageGroup, currentGroup]);

  useEffect(() => {
    if (!boxRef.current) return;

    boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [currentGroupMessages]);

  const generateMessage = useCallback(
    (
      name: string,
      message: string,
      createdAt: Date,
      preName: string | undefined,
      index: number,
    ): React.ReactElement => {
      const isCurrentUser = currentUserInfo.name === name;
      const isConsecutive = preName === name;

      return (
        <Stack
          key={`message-${index}`}
          spacing={1}
          sx={{
            mx: 2,
            mt: isConsecutive ? 1.5 : 2,
            alignItems: isCurrentUser ? "flex-end" : "flex-start",
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{
              display: isConsecutive || isCurrentUser ? "none" : "flex",
              alignItems: "center",
              pt: 2,
            }}
          >
            <RippleAvatar status={userMap[name]?.status}>{name}</RippleAvatar>
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
                isCurrentUser
                  ? theme.palette.secondary.light
                  : theme.palette.primary.light,
              position: "relative",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                position: "absolute",
                [isCurrentUser ? "left" : "right"]: 0,
                bottom: -20,
              }}
            >
              {moment(createdAt).format("kk:mm")}
            </Typography>
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
    },
    [currentUserInfo, userMap],
  );

  const handleChangeMessage = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
    setTextValue(event.target.value);
  };

  const handleKeyUp = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();

        handleSendMessage();
      }
    },
    [message, currentGroup, currentUserInfo.name],
  );

  const handleSendMessage = () => {
    sendMessage(
      JSON.stringify({
        username: currentUserInfo.name,
        groupId: currentGroup,
        message: message,
        type: "newMessage",
      }),
    );

    setTextValue("");
    handlePublicBroadcast();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) event.preventDefault();
  };

  const handlePublicBroadcast = () => {
    if (currentGroup !== groupPublic) return;

    sendMessage(
      JSON.stringify({
        type: "broadcast",
        username: currentUserInfo.name,
        message: message,
      }),
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
        <Box
          sx={{
            borderWidth: 0,
            borderBottomWidth: 1,
            borderStyle: "solid",
            borderColor: (theme) => theme.palette.primary.light,
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h5">{currentGroup}</Typography>
        </Box>

        <Box
          ref={boxRef}
          sx={{
            height: "calc( 100vh - 90px - 16px - 32px - 60px)",
            overflowY: "auto",
            p: 2,
            pb: 4,
          }}
        >
          {currentGroupMessages.map((item: any, index) => {
            const preName = (currentGroupMessages[index - 1] || {}).username;
            return generateMessage(
              item.username,
              item.message,
              item.createdAt,
              preName,
              index,
            );
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
              onKeyUp: handleKeyUp,
              onKeyDown: handleKeyDown,
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
            value={textValue}
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
