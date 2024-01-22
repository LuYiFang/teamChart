import React from "react";
import { styled } from "@mui/material/styles";
import { Avatar, Badge, Box, Theme } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { User, UserOpenInfo, findUser } from "../../types/commonTypes";
import { useUserOpenInfo } from "../../hook/useUserOpenInfo";

type PersonProps = {
  index: number;
  user: User;
  findUser: findUser;
  currentUserInfo: UserOpenInfo;
};

type MessageProps = {
  findUser: findUser;
  users: Array<User>;
  groupId: string;
  currentUserInfo: UserOpenInfo;
};

type RippleAvatarProps = {
  active?: string | undefined;
  iscurrentuser?: string;
};

const StyledBadge = styled(Badge)(({ theme }) => ({
  "&": {
    margin: 3,
  },
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  },
}));

export const RippleAvatar = styled(Avatar)<RippleAvatarProps>(({
  theme,
  active,
  iscurrentuser,
}) => {
  return {
    "&": {
      backgroundColor:
        iscurrentuser == "true"
          ? theme.palette.primary.light
          : theme.palette.secondary.main,
      ...(active && { boxShadow: "0 0 7px #000" }),
    },
    ...(active && {
      "&::after": {
        position: "absolute",
        top: -2,
        left: -2,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "ripple 1.2s infinite ease-in-out",
        border: "2px solid currentColor",
        content: '""',
      },
    }),
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.2)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(1.5)",
        opacity: 0,
      },
    },
  };
});

const Person: React.FC<PersonProps> = ({
  findUser,
  user,
  index,
  currentUserInfo,
}) => {
  return (
    <Draggable draggableId={user.id} index={index}>
      {(provided) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{ maxHeight: 46, ...provided.draggableProps.style }}
          >
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <RippleAvatar
                active={findUser === user.name ? "true" : undefined}
                iscurrentuser={(user.name === currentUserInfo.name).toString()}
              >
                {user.name}
              </RippleAvatar>
            </StyledBadge>
          </div>
        );
      }}
    </Draggable>
  );
};

const Groups: React.FC<MessageProps> = ({
  findUser,
  users,
  groupId,
  currentUserInfo,
}) => {
  return (
    <Droppable droppableId={`${groupId}`}>
      {(provided, snapshot) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-start",
            }}
          >
            {users.map((user, index) => {
              return (
                <Person
                  key={`person-${user.name}`}
                  findUser={findUser}
                  currentUserInfo={currentUserInfo}
                  user={user}
                  index={index}
                />
              );
            })}

            {provided.placeholder}
          </div>
        );
      }}
    </Droppable>
  );
};

export default Groups;
