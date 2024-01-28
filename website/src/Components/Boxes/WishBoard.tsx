import {
  Avatar,
  Badge,
  BadgeProps,
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Stack,
  styled,
} from "@mui/material";
import React, { FC, useEffect } from "react";
import PersonIcon from "@mui/icons-material/Person";
import PlusOneIcon from "@mui/icons-material/PlusOne";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import _ from "lodash";
import {
  UserMap,
  UserOpenInfo,
  Wish,
  WishCardProps,
} from "../../types/commonTypes";
import RippleAvatar from "../Avatars/RippleAvatar";

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -5,
    top: -3,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

const WishCard: FC<WishCardProps> = ({
  currentUser,
  voteCount,
  name,
  content,
  userMap,
}) => {
  return (
    <>
      <Card>
        <CardHeader
          avatar={
            <RippleAvatar status={userMap[name]?.status}>{name}</RippleAvatar>
          }
          titleTypographyProps={{
            sx: {
              textAlign: "left",
            },
          }}
          title={name}
          action={
            <Stack direction="row">
              <IconButton sx={{ marginRight: 2 }}>
                <StyledBadge
                  color="secondary"
                  badgeContent={voteCount}
                  showZero
                >
                  <PlusOneIcon />
                </StyledBadge>
              </IconButton>
              <IconButton
                sx={{ display: currentUser === name ? "inline-flex" : "none" }}
              >
                <DeleteForeverIcon />
              </IconButton>
            </Stack>
          }
        ></CardHeader>
        <CardContent>{content}</CardContent>
      </Card>
    </>
  );
};

const WishBoard: FC<{
  wishList: Array<Wish>;
  currentUserInfo: UserOpenInfo;
  userMap: UserMap;
}> = ({ wishList, currentUserInfo, userMap }) => {
  return (
    <>
      <Stack spacing={2} p={3}>
        {_.map(wishList, (item, i) => {
          return (
            <WishCard
              key={`wish-card-${i}`}
              currentUser={currentUserInfo.name}
              name={item.username}
              content={item.content}
              voteCount={item.voteCount}
              userMap={userMap}
            />
          );
        })}
      </Stack>
    </>
  );
};
export default WishBoard;
