import {
  Button,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemProps,
  ListItemText,
  TextField,
} from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import _ from "lodash";
import {
  FormButtonEvent,
  OnlineStatus,
  SendMessage,
  User,
  UserOpenInfo,
} from "../../types/commonTypes";
import Sidebar from "./Sidebar";
import RippleAvatar from "../Avatars/RippleAvatar";
import SearchField from "../Inputs/SearchField";
import { useAuth } from "../../hook/useAuth";
import { useUserOpenInfo } from "../../hook/useUserOpenInfo";
import FormDialog from "../Dialogs/FormDialog";

type CallHandler = (event: FormButtonEvent) => void;

type ChainCall = (user: User, event: FormButtonEvent) => void;

const ListPerson: FC<{
  open: boolean;
  name: string;
  status?: OnlineStatus;
  onItemClick: (name: string) => void;
  isCurrentUser?: boolean;
  handleLogout?: () => void;
  handleCall?: CallHandler;
  handleChainCall?: CallHandler;
}> = ({
  name,
  status,
  open,
  onItemClick,
  isCurrentUser,
  handleLogout = () => {},
  handleCall = () => {},
  handleChainCall = () => {},
}) => {
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);

  const [callClickCount, setCallClickCount] = useState(0);
  const [isCountingCall, setIsCoutingCall] = useState(false);

  let callClickCountingTimeout: ReturnType<typeof setTimeout>;

  const checkChainCallAvalible = useCallback(
    _.debounce(() => {
      return callClickCount >= 3;
    }, 500),
    [callClickCount],
  );

  const setCallClickCountTimeout = () => {
    if (callClickCountingTimeout) {
      clearTimeout(callClickCountingTimeout);
    }

    setCallClickCount(0);

    callClickCountingTimeout = setTimeout(() => {
      setIsCoutingCall(false);
    }, 60 * 1000);
  };

  const handleClick = () => {
    setIsCallDialogOpen(true);
  };

  const handleClose = () => {
    setIsCallDialogOpen(false);
  };

  const handleSubmit = (event: FormButtonEvent) => {
    if (isCountingCall) {
      setCallClickCount((pre) => pre + 1);
    } else {
      setIsCoutingCall(true);
      setCallClickCountTimeout();
    }

    if (!handleCall) return;
    handleCall(event);
  };

  let itemProps: ListItemProps = {};
  if (open) {
    if (isCurrentUser) {
      itemProps["secondaryAction"] = (
        <IconButton onClick={handleLogout} color="inherit">
          <LogoutIcon />
        </IconButton>
      );
    } else {
      itemProps["secondaryAction"] = (
        <IconButton onClick={handleClick} color="inherit">
          <NotificationsActiveIcon />
        </IconButton>
      );
    }
  }

  return (
    <>
      <ListItem {...itemProps}>
        <ListItemButton
          sx={{
            justifyContent: open ? "initial" : "center",
          }}
          onClick={() => onItemClick(name)}
        >
          <ListItemAvatar
            sx={{
              minWidth: 0,
              mr: open ? 3 : "auto",
              justifyContent: "center",
            }}
          >
            <RippleAvatar status={status}>{name}</RippleAvatar>
          </ListItemAvatar>
          <ListItemText
            primary={name}
            sx={{ opacity: open ? 1 : 0 }}
            primaryTypographyProps={{ fontWeight: "bold" }}
          />
        </ListItemButton>
      </ListItem>
      <FormDialog
        title="Call"
        open={isCallDialogOpen}
        onClose={handleClose}
        onClick={handleSubmit}
        customButton={
          checkChainCallAvalible() ? (
            <Button type="submit" name="chainCall" onClick={handleChainCall}>
              Chain call
            </Button>
          ) : (
            ""
          )
        }
      >
        <TextField
          fullWidth
          multiline
          rows={1}
          autoFocus
          name="callMessage"
          placeholder="Message"
        />
      </FormDialog>
    </>
  );
};

const SidebarList: FC<{
  open: boolean;
  onItemClick: (name: string) => void;
  userGroup: Array<User>;
  currentUserInfo: UserOpenInfo;
  onClick: () => void;
  sendMessage: SendMessage;
}> = ({
  open,
  onItemClick,
  userGroup,
  currentUserInfo,
  onClick,
  sendMessage,
}) => {
  const { logout } = useAuth();
  const { setUserOpenInfo } = useUserOpenInfo();

  const otherUserList = useMemo(() => {
    return _.filter(userGroup, (user) => user.name !== currentUserInfo.name);
  }, [userGroup]);

  const [filteredUserList, setFilterdUserList] = useState(otherUserList);

  const handleSearch = (searchStr: string) => {
    const newFilteredUserList = _.filter(otherUserList, (user) => {
      if (_.includes(_.toLower(user.name), _.toLower(searchStr))) return true;
      return false;
    });
    setFilterdUserList(newFilteredUserList);
  };

  const handleLogout = () => {
    setUserOpenInfo({ name: "" });
    sendMessage(
      JSON.stringify({
        type: "logoutEvent",
        username: currentUserInfo.name,
      }),
    );
    logout();
  };

  const sendCall = (
    type: "call" | "chainCall" = "call",
    user: User,
    event: FormButtonEvent,
  ) => {
    const form = event.currentTarget.form;
    if (!form) return;

    const data = new FormData(form);
    sendMessage(
      JSON.stringify({
        type: type,
        targetUser: user.name,
        username: currentUserInfo.name,
        message: data.get("callMessage"),
      }),
    );
  };

  const handleCall: ChainCall = useCallback(
    (user, event) => {
      console.log("handleCall");
      event.preventDefault();
      sendCall("call", user, event);
    },
    [sendCall],
  );

  const handleChainCall: ChainCall = useCallback(
    (user, event) => {
      event.preventDefault();
      sendCall("chainCall", user, event);
    },
    [sendCall],
  );

  useEffect(() => {
    setFilterdUserList(otherUserList);
  }, [otherUserList]);

  return (
    <>
      <Sidebar isOpen={open} onClick={onClick}>
        <ListPerson
          open={open}
          name={currentUserInfo.name}
          onItemClick={onItemClick}
          status={OnlineStatus.Online}
          isCurrentUser={true}
          handleLogout={handleLogout}
        />
        <Divider />

        <Collapse in={open}>
          <SearchField open={open} onChange={handleSearch} />
        </Collapse>

        <List sx={{ overflowY: "auto", overflowX: "hidden" }}>
          {_.map(filteredUserList, (user, index) => (
            <ListPerson
              key={`person-list-${index}`}
              open={open}
              name={user.name}
              onItemClick={onItemClick}
              status={user.status}
              handleCall={(event: FormButtonEvent) => handleCall(user, event)}
              handleChainCall={(event: FormButtonEvent) =>
                handleChainCall(user, event)
              }
            />
          ))}
        </List>
      </Sidebar>
    </>
  );
};
export default SidebarList;
