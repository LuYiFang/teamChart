import { FC, useEffect, useMemo, useState } from "react";
import Sidebar from "../Components/Sidebar/Sidebar";
import SidebarList from "../Components/Sidebar/SidebarList";
import { Box } from "@mui/material";
import GroupArea from "../Components/Groups/GroupArea";
import MessagesBox from "../Components/Messages/MessagesBox";
import { DropResult } from "react-beautiful-dnd";
import _ from "lodash";
import { useUsers } from "../Components/ProtectedLayout";
import { useUserOpenInfo } from "../hook/useUserOpenInfo";
import { groupList, groupSilence } from "../Utility/contants";
import TabPanel from "../Components/Tab/TabPanel";
import WishBoard from "../Components/Boxes/WishBoard";
import SidebarTab from "../Components/Sidebar/SibebarTab";
import useWebSocket from "../hook/useWebSocket";
import { webSocketRoot } from "../apiConifg";

const Home = () => {
  const { users } = useUsers();
  const { userOpenInfo } = useUserOpenInfo();

  const { sendMessage, messageGroup, loginUserList, wishList } = useWebSocket(
    webSocketRoot,
    userOpenInfo.name,
  );

  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(true);
  const [userGroup, setUserGroup] = useState(
    _.map(_.map(users, "username"), (name, i) => ({
      id: `graggable-user-${name}`,
      name: name,
      group: groupSilence,
    })),
  );
  const [findUser, setFindUser] = useState<string>();
  const [tabIndex, setTabIndex] = useState(0);

  const currentGroup = useMemo(() => {
    const userInfo = _.find(
      userGroup,
      (user) => user.name === userOpenInfo.name,
    );
    return userInfo?.group || "";
  }, [userOpenInfo.name, userGroup]);

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

  const handleTab = (tabIndex: number) => {
    setTabIndex(tabIndex);
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
            currentUserInfo={userOpenInfo}
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
            currentUserInfo={userOpenInfo}
          />
        </Box>
        <SidebarTab
          anchor="right"
          isOpen={isMessageOpen}
          hidden={currentGroup === groupSilence ? true : false}
          onClick={() => setIsMessageOpen(!isMessageOpen)}
          tabIndex={tabIndex}
          onChange={handleTab}
          userOpenInfo={userOpenInfo}
          currentGroup={currentGroup}
          sendMessage={sendMessage}
          messageGroup={messageGroup}
          loginUserList={loginUserList}
          wishList={wishList}
        />
      </div>
    </>
  );
};
export default Home;
