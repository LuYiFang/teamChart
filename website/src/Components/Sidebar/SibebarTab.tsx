import { Box, Tab } from "@mui/material";
import VerticlTabs from "../Tab/VerticalTabs";
import _ from "lodash";
import Sidebar from "./Sidebar";
import { FC, useEffect, useState } from "react";
import { SidbarTabComponentProps, User } from "../../types/commonTypes";
import { messageTabName, sidebarTabList } from "../../Utility/contants";
import MessagesBox from "../Messages/MessagesBox";
import WishBoard from "../Boxes/WishBoard";
import TabPanel from "../Tab/TabPanel";

const SidebarTab: FC<SidbarTabComponentProps> = (props) => {
  const {
    isOpen,
    disabledMessage = false,
    onClick,
    tabIndex = 0,
    onChange = () => {},
    userOpenInfo,
    currentGroup,
    sendMessage,
    messageGroup,
    userGroup,
    wishList,
  } = props;

  const [userMap, setUserMap] = useState({});

  const tabContentList = [
    <MessagesBox
      currentUserInfo={userOpenInfo}
      currentGroup={currentGroup}
      sendMessage={sendMessage}
      messageGroup={messageGroup}
      userMap={userMap}
    />,
    <WishBoard
      wishList={wishList}
      currentUserInfo={userOpenInfo}
      userMap={userMap}
      sendMessage={sendMessage}
    />,
  ];

  useEffect(() => {
    setUserMap(
      _.mapValues(
        _.groupBy(userGroup, "name"),
        (group) => _.first(group) as User,
      ),
    );
  }, [userGroup]);

  return (
    <>
      <Sidebar anchor="right" isOpen={isOpen} onClick={onClick}>
        <VerticlTabs tabIndex={tabIndex} onChange={onChange}>
          {_.map(sidebarTabList, (tabName, i) => {
            return (
              <Tab
                label={tabName}
                disabled={disabledMessage && tabName === messageTabName}
                key={`vertical-tab-${i}`}
                sx={{
                  "&": {
                    backgroundColor: (theme) => theme.palette.primary.light,
                  },
                  "&:hover": {
                    color: (theme) => theme.palette.primary.dark,
                    opacity: 1,
                  },
                  "&.Mui-selected": {
                    backgroundColor: (theme) => theme.palette.primary.light,
                    color: (theme) => theme.palette.text.primary,
                    fontWeight: 600,
                  },
                  "&.Mui-focusVisible": {
                    backgroundColor: (theme) => theme.palette.primary.light,
                    color: (theme) => theme.palette.text.primary,
                    fontWeight: 600,
                  },
                }}
              />
            );
          })}
        </VerticlTabs>
        <Box sx={{ width: "100%" }}>
          {_.map(tabContentList, (tabContent, i) => {
            return (
              <TabPanel
                value={tabIndex}
                index={i}
                key={`vertical-tab-panel-${i}`}
              >
                {tabContent}
              </TabPanel>
            );
          })}
        </Box>
      </Sidebar>
    </>
  );
};

export default SidebarTab;
