import { FC, useState } from "react";
import Sidebar from "../Components/Sidebar/Sidebar";
import SidebarList from "../Components/Sidebar/SidebarList";
import { Box } from "@mui/material";
import GroupArea from "../Components/Groups/GroupArea";
import MessagesBox from "../Components/Messages/MessagesBox";
import { DropResult } from "react-beautiful-dnd";
import _ from "lodash";
import { useOutletContext } from "react-router-dom";
import { useUsers } from "../Components/ProtectedLayout";

const messages = [
  { name: "A", message: "1" },
  { name: "A", message: "2222" },
  { name: "B", message: "3333333" },
  { name: "C", message: "4444444444" },
  { name: "B", message: "5555555555555" },
  { name: "B", message: "6666666666666666" },
  { name: "B", message: "77777777777777777777777777" },
];

const currentUser = "A";

const Home = () => {
  const { users } = useUsers();

  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [userGroup, setUserGroup] = useState(
    _.map(_.map(users, "username"), (name, i) => ({
      id: `graggable-user-${name}`,
      name: name,
      group: `group-5`,
    })),
  );
  const [findUser, setFindUser] = useState<string>();

  const onDragEnd = (res: DropResult) => {
    const { source, destination, draggableId } = res;

    if (!destination) return;

    const newUserGroup = _.map(userGroup, (user) => {
      if (user.id !== draggableId) return user;

      return {
        ...user,
        group: destination.droppableId,
      };
    });

    setUserGroup(newUserGroup);
  };
  return (
    <>
      <div className="App">
        <Sidebar
          isOpen={isMembersOpen}
          onClick={() => setIsMembersOpen(!isMembersOpen)}
        >
          <SidebarList
            open={isMembersOpen}
            onItemClick={(name) => setFindUser(name)}
            userGroup={userGroup}
          />
        </Sidebar>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 4,
            height: "calc(100vh - 80px)",
            zIndex: (theme) => theme.zIndex.drawer - 2,
          }}
        >
          <GroupArea
            userGroup={userGroup}
            findUser={findUser}
            onDragEnd={onDragEnd}
          />
        </Box>
        <Sidebar
          anchor="right"
          isOpen={isMessageOpen}
          onClick={() => setIsMessageOpen(!isMessageOpen)}
        >
          <MessagesBox messages={messages} currentUser={currentUser} />
        </Sidebar>
      </div>
    </>
  );
};
export default Home;
