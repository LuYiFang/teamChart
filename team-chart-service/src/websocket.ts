import { WebSocket, Server as WebSocketServer } from "ws";
import MessageModel from "./models/messageModel";
import { verifyToken } from "./utils/auth";
import _, { compact } from "lodash";
import UserModel from "./models/userModel";
import ChartController from "./controllers/chartControllers";

const userSocketMap = new Map<string, WebSocket>();
let wssInstance: WebSocketServer | null = null;

const chartController = new ChartController();

export const setupWebsocket = (wss: WebSocketServer) => {
  wssInstance = wss;

  wss.on("connection", async (ws, req) => {
    console.log("ws client connected");

    ws.on("message", async (message) => {
      // console.log(`Received message: ${message}`);

      try {
        const messageString = message.toString();
        const data = JSON.parse(messageString);

        if (data.type === "initail") {
          const { isSuccess, result } = await verifyToken(data.token);
          if (!isSuccess) {
            ws.send(
              JSON.stringify({
                type: "initailFailed",
                message: `${result}`,
              }),
            );
            ws.close();
            return;
          }

          broadcastAllGroupHistory(ws);
          broadcastWishHistory(ws);

          const { username } = result as { userId: string; username: string };
          userSocketMap.set(username, ws);

          broadcastToAll(
            wss,
            ws,
            {
              type: "loginEvent",
              username: username,
            },
            false,
          );
          return;
        }

        if (data.type === "newMessage") {
          broadcastToAll(wss, ws, {
            type: "newMessage",
            groupId: data.groupId,
            message: data.message,
            username: data.username,
          });

          chartController.saveMessage(
            data.username,
            data.groupId,
            data.message,
          );

          return;
        }

        if (data.type === "newWish") {
          broadcastToAll(wss, ws, {
            type: "newWish",
            content: data.content,
            username: data.username,
          });

          chartController.saveOpenWishBoard(data.username, data.content);

          return;
        }

        if (data.type === "voteWish") {
          broadcastToAll(wss, ws, {
            type: "voteWish",
            wishId: data.wishId,
            username: data.username,
          });

          chartController.voteWish(data.username, data.wishId);
          return;
        }

        if (data.type === "logingReturnEvent") {
          broadcastTo(data.targetUser, {
            type: "logingReturnEvent",
            username: data.username,
          });
          return;
        }
      } catch (error) {
        ws.send(
          JSON.stringify({
            type: "messageError",
            reason: `${error}`,
          }),
        );
      }
    });

    ws.on("close", () => {
      console.log("ws client disconnected");
    });
  });
};

const broadcastToAll = (
  wss: WebSocketServer,
  sender: WebSocket,
  data: Record<string, any>,
  includeSelf: boolean = true,
) => {
  wss.clients.forEach((client) => {
    let cond = true;
    if (includeSelf) cond = client !== sender;
    if (cond && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

const broadcastTo = (targetUser: string, data: Record<string, any>) => {
  const ws = userSocketMap.get(targetUser);

  if (!ws) {
    console.log("broadcast to failed");
    return;
  }
  ws.send(JSON.stringify(data));
};

const broadcastAllGroupHistory = async (ws: WebSocket) => {
  const messageList = await chartController.getAllMessageHistory();

  ws.send(
    JSON.stringify({
      type: "allMessage",
      data: _.groupBy(messageList, "groupId"),
    }),
  );
};

const broadcastWishHistory = async (ws: WebSocket) => {
  const wishList = await chartController.getOpenWishBoard();

  ws.send(
    JSON.stringify({
      type: "openWish",
      data: wishList,
    }),
  );
};