import { Box, Tab } from "@mui/material";
import OpenTab from "../Tab/OpenTab";
import VerticlTabs from "../Tab/VerticalTabs";
import _ from "lodash";
import Sidebar from "./Sidebar";
import { FC } from "react";
import { SidbarTabComponentProps } from "../../types/commonTypes";
import { sidebarTabList } from "../../Utility/contants";
import MessagesBox from "../Messages/MessagesBox";
import WishBoard from "../Boxes/WishBoard";
import TabPanel from "../Tab/TabPanel";

const SidebarTab: FC<SidbarTabComponentProps> = (props) => {
  const {
    anchor = "left",
    isOpen,
    hidden = false,
    onClick,
    tabIndex = 0,
    onChange = () => {},
    userOpenInfo,
    currentGroup,
    sendMessage,
    messageGroup,
    loginUserList,
    wishList,
  } = props;

  const tabList = [
    <MessagesBox
      currentUserInfo={userOpenInfo}
      currentGroup={currentGroup}
      sendMessage={sendMessage}
      messageGroup={messageGroup}
    />,
    <WishBoard wishList={wishList} currentUserInfo={userOpenInfo} />,
  ];

  return (
    <>
      <Sidebar anchor="right" isOpen={isOpen} hidden={hidden} onClick={onClick}>
        <OpenTab anchor={anchor} isOpen={isOpen} onClick={onClick} />
        <VerticlTabs tabIndex={tabIndex} onChange={onChange}>
          {_.map(sidebarTabList, (tabName, i) => {
            return (
              <Tab
                label={tabName}
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
          {_.map(tabList, (tab, i) => {
            return (
              <TabPanel
                value={tabIndex}
                index={i}
                key={`vertical-tab-panel-${i}`}
              >
                {tab}
              </TabPanel>
            );
          })}
        </Box>
      </Sidebar>
    </>
  );
};

export default SidebarTab;
