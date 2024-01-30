import {
  Collapse,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemButtonProps,
  ListItemProps,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import {
  FC,
  FormEvent,
  MouseEvent,
  MouseEventHandler,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import _ from "lodash";
import {
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

type ActionClickHandler = (
  event: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>,
) => void;

const ListPerson: FC<{
  open: boolean;
  name: string;
  status?: OnlineStatus;
  onItemClick: (name: string) => void;
  isCurrentUser?: boolean;
  onActionClick: ActionClickHandler;
}> = ({ name, status, open, onItemClick, isCurrentUser, onActionClick }) => {
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);

  const handleClick = () => {
    setIsCallDialogOpen(true);
  };
  const handleClose = () => {
    setIsCallDialogOpen(false);
  };

  let itemProps: ListItemProps = {};
  if (open) {
    if (isCurrentUser) {
      itemProps["secondaryAction"] = (
        <IconButton onClick={onActionClick} color="inherit">
          {isCurrentUser ? <LogoutIcon /> : <NotificationsActiveIcon />}
        </IconButton>
      );
    } else {
      itemProps["secondaryAction"] = (
        <IconButton onClick={handleClick} color="inherit">
          {isCurrentUser ? <LogoutIcon /> : <NotificationsActiveIcon />}
        </IconButton>
      );
    }
  }

  let actionList = ["Call"];
  if (isCurrentUser) actionList = ["Logout"];

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
        onSubmit={onActionClick}
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
    logout();
  };

  const handleCall = (user: User, event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    sendMessage(
      JSON.stringify({
        type: "call",
        targetUser: user.name,
        username: currentUserInfo.name,
        message: data.get("callMessage"),
      }),
    );
  };

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
          onActionClick={handleLogout}
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
              onActionClick={(event) =>
                handleCall(user, event as FormEvent<HTMLFormElement>)
              }
            />
          ))}
        </List>
      </Sidebar>
    </>
  );
};
export default SidebarList;
