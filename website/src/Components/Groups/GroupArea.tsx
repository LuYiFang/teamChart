import { Box, Grid, Theme, Typography } from "@mui/material";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import Groups from "./Groups";
import { FC } from "react";
import { User, UserOpenInfo, findUser } from "../../types/commonTypes";
import _ from "lodash";
import { groupList } from "../../Utility/contants";

const GroupArea: FC<{
  userGroup: Array<User>;
  findUser: findUser;
  onDragEnd: (res: DropResult) => void;
  currentUserInfo: UserOpenInfo;
}> = ({ userGroup, findUser, onDragEnd, currentUserInfo }) => {
  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container spacing={2} sx={{ height: "100%" }}>
          {_.map(groupList, (groupName, index) => {
            return (
              <Grid item xs={4} key={`group-grid-${index}`}>
                <Typography
                  variant="h6"
                  sx={{ color: (theme) => theme.palette.text.primary }}
                >
                  {groupName}
                </Typography>
                <Box
                  sx={{
                    borderWidth: 2,
                    borderColor: (theme: Theme) => theme.palette.primary.dark,
                    borderStyle: "solid",
                    borderRadius: "3%",
                    height: "calc(100% - 32px)",
                  }}
                >
                  <Groups
                    findUser={findUser}
                    currentUserInfo={currentUserInfo}
                    groupId={`${groupName}`}
                    users={userGroup.filter(
                      (user) => user.group === `${groupName}`,
                    )}
                  />
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </DragDropContext>
    </>
  );
};
export default GroupArea;
