import { useEffect, useState } from "react";
import { Message, MessageGroup, VoteWish, Wish } from "../types/commonTypes";
import _ from "lodash";
import { getStorage } from "../Utility/utility";
import { Alert } from "../Components/Alerts/alert";

const useWebSocket = (url: string, username: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [loginUserList, setLoginUserList] = useState<Array<string>>([]);
  const [messageGroup, setMessageGroup] = useState<MessageGroup>({});
  const [wishList, setWishList] = useState<Array<Wish>>([]);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("web socket on open");

      const user = getStorage("user", "");

      const initMessage = {
        type: "initail",
        token: user,
      };
      ws.send(JSON.stringify(initMessage));
    };

    ws.onmessage = (event) => {
      console.log("web socket onmessage");

      const data = JSON.parse(event.data);

      switch (data?.type) {
        case "allMessage":
          handleAllMessage(data);
          break;
        case "newMessage":
          handleNewMessage(data);
          break;

        case "openWish":
          handleOpenWish(data);
          break;
        case "newWish":
          handleNewWish(data);
          break;
        case "voteWish":
          handleVoteWish(data);
          break;

        case "loginEvent":
          handleLoginEvent(ws, data);
          break;
        case "logingReturnEvent":
          handleLoginReturnEvent(data);
          break;

        case "logoutEvent":
          handlelogoutEvent(data);
          break;

        case "call":
          handleCall(data);
          break;

        case "chainCall":
          console.log("chainCall");
          handleChainCall(data);
          break;

        case "errorMessage":
          handleErrorMessage(data);
          break;
      }
    };

    ws.onclose = () => {
      console.log("web socket on close");
    };
    setSocket(ws);

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [url]);

  const handleAllMessage = (data: { data: MessageGroup }) => {
    setMessageGroup(data.data);
  };

  const handleNewMessage = (data: Message) => {
    setMessageGroup((pre) => {
      if (!_.includes(_.keys(pre), data.groupId)) {
        return { ...pre, [data.groupId]: [data] };
      }

      pre[data.groupId] = pre[data.groupId].concat([data]);
      return { ...pre };
    });
  };

  const handleOpenWish = (data: { data: Array<Wish> }) => {
    setWishList((pre) => data.data);
  };

  const handleNewWish = (data: Wish) => {
    setWishList((pre) => {
      return pre.concat([
        {
          _id: data._id,
          content: data.content,
          username: data.username,
          voteCount: data.voteCount,
          createdAt: data.createdAt,
        },
      ]);
    });
  };

  const handleVoteWish = (data: VoteWish) => {
    setWishList((pre) => {
      return _.map(pre, (wish) => {
        if (wish._id !== data.wishId) return wish;
        return {
          ...wish,
          voteCount: data.newCount,
        };
      });
    });
  };

  const handleLoginEvent = (
    ws: WebSocket,
    data: { username: string; targetUser: string },
  ) => {
    _handleLoginEvent(data.username);

    ws.send(
      JSON.stringify({
        type: "logingReturnEvent",
        username: username,
        targetUser: data.username,
      }),
    );
  };

  const handleLoginReturnEvent = (data: { username: string }) => {
    _handleLoginEvent(data.username);
  };

  const handlelogoutEvent = (data: { username: string }) => {
    _handleLogoutEvent(data.username);
  };

  const handleCall = (data: { username: string; message: string }) => {
    Alert.warning(data.message, `${data.username} call`);
  };

  const handleChainCall = (data: { username: string; message: string }) => {
    Alert.chainOfCalls(data.message, `${data.username} call`);
  };

  const handleErrorMessage = (data: { error: string }) => {
    Alert.error(data.error);
  };

  const _handleLoginEvent = (username: string) => {
    setLoginUserList((pre) => _.compact(_.uniq([...pre, username])));
  };

  const _handleLogoutEvent = (username: string) => {
    setLoginUserList((pre) => {
      return _.filter(pre, (user) => user !== username);
    });
  };

  const sendMessage = (message: string) => {
    if (!socket) {
      console.log("no socket connected");
      return;
    }

    socket.send(message);
  };

  const closeConnection = (code?: number, reason?: string) => {
    if (socket) {
      socket.close(code, reason);
    }
  };

  return {
    sendMessage,
    closeConnection,
    messageGroup,
    loginUserList,
    wishList,
  };
};

export default useWebSocket;
