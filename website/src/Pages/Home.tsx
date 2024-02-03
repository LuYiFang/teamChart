import { useEffect, useMemo, useState } from "react";
import SidebarList from "../Components/Sidebar/SidebarList";
import { Box } from "@mui/material";
import GroupArea from "../Components/Groups/GroupArea";
import { DropResult } from "react-beautiful-dnd";
import _ from "lodash";
import { useUsers } from "../Components/ProtectedLayout";
import { useUserOpenInfo } from "../hook/useUserOpenInfo";
import { groupSilence } from "../Utility/contants";
import SidebarTab from "../Components/Sidebar/SibebarTab";
import useWebSocket from "../hook/useWebSocket";
import { webSocketRoot } from "../apiConifg";
import { OnlineStatus, User } from "../types/commonTypes";

const Home = () => {
  const { users } = useUsers();
  const { userOpenInfo } = useUserOpenInfo();

  const { sendMessage, messageGroup, loginUserList, wishList } = useWebSocket(
    webSocketRoot,
    userOpenInfo.name,
  );

  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(true);
  const [userGroup, setUserGroup] = useState<Array<User>>([]);
  const [findUser, setFindUser] = useState<string>();
  const [tabIndex, setTabIndex] = useState(0);

  const currentGroup = useMemo(() => {
    const userInfo = _.find(
      userGroup,
      (user) => user.name === userOpenInfo.name,
    );
    return userInfo?.group || "";
  }, [userOpenInfo.name, userGroup]);

  useEffect(() => {
    let loginUserMap: { [key: string]: boolean } = {};
    if (loginUserList && loginUserList.length >= 0) {
      loginUserMap = _.zipObject(
        loginUserList,
        Array(loginUserList.length).fill(true),
      );
    }

    const sortedUsers = _.sortBy(users, (user) =>
      user.username === userOpenInfo.name ? "-" : user.username,
    );
    setUserGroup(
      _.map(_.map(sortedUsers, "username"), (name, i) => ({
        id: `graggable-user-${name}`,
        name: name,
        group: groupSilence,
        status: loginUserMap[name] ? OnlineStatus.Online : OnlineStatus.Offline,
      })),
    );
  }, [users, loginUserList, userOpenInfo.name]);

  useEffect(() => {
    setTabIndex(currentGroup === groupSilence ? 1 : 0);
  }, [currentGroup]);

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
        <SidebarList
          open={isMembersOpen}
          onItemClick={(name) => setFindUser(name)}
          userGroup={userGroup}
          currentUserInfo={userOpenInfo}
          onClick={() => setIsMembersOpen(!isMembersOpen)}
          sendMessage={sendMessage}
        />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 4,
            height: "100vh",
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
          disabledMessage={currentGroup === groupSilence ? true : false}
          onClick={() => setIsMessageOpen(!isMessageOpen)}
          tabIndex={tabIndex}
          onChange={handleTab}
          userOpenInfo={userOpenInfo}
          currentGroup={currentGroup}
          sendMessage={sendMessage}
          messageGroup={messageGroup}
          userGroup={userGroup}
          wishList={wishList}
        />
      </div>
    </>
  );
};
export default Home;
