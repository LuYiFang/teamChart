import { useEffect, useState } from "react";
import { MessageGroup } from "../types/commonTypes";
import _ from "lodash";

const useWebSocket = (url: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messageGroup, setMessageGroup] = useState<MessageGroup>({});

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("web socket on open");
    };

    ws.onmessage = (event) => {
      console.log("web socket onmessage");

      const data = JSON.parse(event.data);

      if (data?.type === "allMessage") {
        setMessageGroup(data.data);
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

  return { sendMessage, closeConnection, messageGroup };
};

export default useWebSocket;
