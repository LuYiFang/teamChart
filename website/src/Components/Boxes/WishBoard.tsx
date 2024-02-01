import {
  Avatar,
  Badge,
  BadgeProps,
  Box,
  Card,
  CardContent,
  CardHeader,
  Fab,
  IconButton,
  Stack,
  styled,
  TextField,
} from "@mui/material";
import React, { FC, FormEvent, useEffect, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import PlusOneIcon from "@mui/icons-material/PlusOne";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import _ from "lodash";
import {
  FormButtonEvent,
  SendMessage,
  UserMap,
  UserOpenInfo,
  Wish,
  WishCardProps,
} from "../../types/commonTypes";
import RippleAvatar from "../Avatars/RippleAvatar";
import FormDialog from "../Dialogs/FormDialog";

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
  handleVote,
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
              <IconButton sx={{ marginRight: 2 }} onClick={handleVote}>
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
  sendMessage: SendMessage;
}> = ({ wishList, currentUserInfo, userMap, sendMessage }) => {
  const [isCreateWishOpen, setIsCreateWishOpen] = useState(false);

  const openCreateWish = () => {
    setIsCreateWishOpen(true);
  };

  const closeCreateWish = () => {
    setIsCreateWishOpen(false);
  };

  const saveWish = (event: FormButtonEvent) => {
    event.preventDefault();

    const form = event.currentTarget.form;
    if (!form) return;

    const data = new FormData(form);
    sendMessage(
      JSON.stringify({
        type: "newWish",
        content: data.get("wishContent"),
        username: currentUserInfo.name,
      }),
    );
  };

  const handleVote = (widhId: string) => {
    sendMessage(
      JSON.stringify({
        type: "voteWish",
        wishId: widhId,
        username: currentUserInfo.name,
      }),
    );
  };

  return (
    <>
      <Box sx={{ height: "100vh" }}>
        <Box
          sx={{
            height: "calc( 100vh - 64px - 48px)",
          }}
        >
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
                  handleVote={() => handleVote(item._id)}
                />
              );
            })}
          </Stack>
        </Box>
        <Box sx={{ height: 64, p: 1, display: "flex", justifyContent: "end" }}>
          <Fab color="secondary" size="medium" onClick={openCreateWish}>
            <AddIcon
              sx={{
                "&": {
                  color: "white",
                },
              }}
            />
          </Fab>
        </Box>
      </Box>
      <FormDialog
        title="Create Wish"
        open={isCreateWishOpen}
        onClose={closeCreateWish}
        onClick={saveWish}
      >
        <TextField
          fullWidth
          multiline
          rows={5}
          autoFocus
          required
          name="wishContent"
        />
      </FormDialog>
    </>
  );
};
export default WishBoard;
