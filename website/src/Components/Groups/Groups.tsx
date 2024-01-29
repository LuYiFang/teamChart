import React from "react";
import { styled } from "@mui/material/styles";
import { Avatar, Badge, Box, Theme, Tooltip } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import {
  OnlineStatus,
  User,
  UserOpenInfo,
  findUser,
} from "../../types/commonTypes";
import { useUserOpenInfo } from "../../hook/useUserOpenInfo";
import _ from "lodash";
import RippleAvatar from "../Avatars/RippleAvatar";

type PersonProps = {
  index: number;
  user: User;
  findUser: findUser;
  currentUserInfo: UserOpenInfo;
  status: OnlineStatus;
};

type MessageProps = {
  findUser: findUser;
  users: Array<User>;
  groupId: string;
  currentUserInfo: UserOpenInfo;
};

const Person: React.FC<PersonProps> = ({
  findUser,
  user,
  index,
  currentUserInfo,
  status,
}) => {
  const iscurrentuser = user.name === currentUserInfo.name;

  return (
    <Draggable
      draggableId={user.id}
      index={index}
      isDragDisabled={!iscurrentuser}
    >
      {(provided) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{ maxHeight: 46, ...provided.draggableProps.style }}
          >
            <Tooltip title={user.name}>
              <RippleAvatar
                status={status}
                active={findUser === user.name ? "true" : undefined}
                iscurrentuser={iscurrentuser.toString()}
              >
                {user.name}
              </RippleAvatar>
            </Tooltip>
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
            }}
          >
            <div
              style={{
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
                    status={user.status}
                  />
                );
              })}
            </div>

            {provided.placeholder}
          </div>
        );
      }}
    </Droppable>
  );
};

export default Groups;
