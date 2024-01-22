import {
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { RippleAvatar } from "../Groups/Groups";
import { Person as PersonIcon } from "@mui/icons-material";
import { FC } from "react";
import _ from "lodash";
import { UserOpenInfo } from "../../types/commonTypes";

const SidebarList: FC<{
  open: boolean | undefined;
  onItemClick: (name: string) => void;
  userGroup: Array<{ name: string }>;
  currentUserInfo: UserOpenInfo;
}> = ({ open, onItemClick, userGroup, currentUserInfo }) => {
  const generatePerson = (
    name: string,
    key: string | number,
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
            <RippleAvatar>
              <PersonIcon />
            </RippleAvatar>
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
      {generatePerson(currentUserInfo.name, currentUserInfo.name)}
      <Divider />
      <List sx={{ overflowY: "auto" }}>
        {_.map(userGroup, (user, index) => generatePerson(user.name, index))}
      </List>
    </>
  );
};
export default SidebarList;
