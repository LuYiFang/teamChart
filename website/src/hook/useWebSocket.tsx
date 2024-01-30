import { useEffect, useState } from "react";
import { MessageGroup, Wish } from "../types/commonTypes";
import _ from "lodash";
import { getStorage } from "../Utility/utility";
import { Alert } from "../Utility/alert";

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

      if (data?.type === "allMessage") {
        setMessageGroup(data.data);
        return;
      }

      if (data?.type === "openWish") {
        setWishList((pre) => data.data);
        return;
      }

      if (data?.type === "newMessage") {
        setMessageGroup((preMessageGroup) => {
          return _.mapValues(preMessageGroup, (group) => {
            return group.concat([data]);
          });
        });
        return;
      }

      if (data?.type === "newWish") {
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
        return;
      }

      if (data?.type === "voteWish") {
        setWishList((pre) => {
          return _.map(pre, (wish) => {
            if (wish._id !== data.wishId) return wish;
            return {
              ...wish,
              voteCount: data.newCount,
            };
          });
        });
        return;
      }

      if (data?.type === "loginEvent") {
        _handleLoginEvent(data.username);

        ws.send(
          JSON.stringify({
            type: "logingReturnEvent",
            username: username,
            targetUser: data.username,
          }),
        );
      }

      if (data?.type === "logingReturnEvent") {
        _handleLoginEvent(data.username);
      }

      if (data?.type === "logoutEvent") {
        console.log("logoutEvent", data);
        _handleLogoutEvent(data.username);
      }

        Alert.chainOfCalls(data.message, `${data.username} call`);
      if (data?.type === "messageError") {
        Alert.error(data.error);
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

  const _handleLoginEvent = (username: string) => {
    setLoginUserList((preLoginUserList) =>
      _.compact(_.uniq([...preLoginUserList, username])),
    );
  };

  const _handleLogoutEvent = (username: string) => {
    setLoginUserList((preLoginUserList) => _.pull(preLoginUserList, username));
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
