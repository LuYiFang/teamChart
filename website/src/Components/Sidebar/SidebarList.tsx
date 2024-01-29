import {
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";
import { FC, useMemo } from "react";
import _ from "lodash";
import { OnlineStatus, User, UserOpenInfo } from "../../types/commonTypes";
import Sidebar from "./Sidebar";
import RippleAvatar from "../Avatars/RippleAvatar";

const SidebarList: FC<{
  open: boolean;
  onItemClick: (name: string) => void;
  userGroup: Array<User>;
  currentUserInfo: UserOpenInfo;
  onClick: () => void;
}> = ({ open, onItemClick, userGroup, currentUserInfo, onClick }) => {
  const otherUserList = useMemo(() => {
    return _.filter(userGroup, (user) => user.name !== currentUserInfo.name);
  }, [userGroup]);

  const generatePerson = (
    name: string,
    key: string | number,
    status?: OnlineStatus,
  ): React.ReactElement => {
    return (
      <ListItem key={`sidebar-item-${key}`}>
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
    );
  };

  return (
    <>
      <Sidebar isOpen={open} onClick={onClick}>
        {generatePerson(
          currentUserInfo.name,
          currentUserInfo.name,
          OnlineStatus.Online,
        )}
        <Divider />
        <List sx={{ overflowY: "auto", overflowX: "hidden" }}>
          {_.map(otherUserList, (user, index) =>
            generatePerson(user.name, index, user.status),
          )}
        </List>
      </Sidebar>
    </>
  );
};
export default SidebarList;
