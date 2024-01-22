import { WebSocket, Server as WebSocketServer } from "ws";
import MessageModel from "./controllers/messageModel";
import { verifyToken } from "./utils/auth";
import _, { compact } from "lodash";
import UserModel from "./controllers/userModel";

const userSocketMap = new Map<string, WebSocket>();

export const setupWebsocket = (wss: WebSocketServer) => {
  wss.on("connection", async (ws, req) => {
    console.log("ws client connected");

    broadcastAllGroupHistory(ws);

    ws.on("message", async (message) => {
      console.log(`Received message: ${message}`);

      try {
        const messageString = message.toString();
        const data = JSON.parse(messageString);

        new MessageModel({
          username: data.username,
          groupId: data.groupId,
          message: data.message,
        }).save();

        if (data.type === "newMessage") {
          broadcastToOthers(wss, data.username, data.message, data.groupId);
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

const broadcastToOthers = (
  wss: WebSocketServer,
  username: string,
  message: string,
  groupId: string,
) => {
  wss.clients.forEach((client) => {
    if (/*client !== sender &&*/ client.readyState === WebSocket.OPEN) {
      console.log("broadcast");
      client.send(
        JSON.stringify({
          type: "newMessage",
          groupId: groupId,
          message: message,
          username: username,
        }),
      );
    }
  });
};

const broadcastAllGroupHistory = async (ws: WebSocket) => {
  const messages = await MessageModel.find({})
    .sort({ createTime: -1 })
    .limit(50)
    .select({ username: 1, message: 1, groupId: 1, createTime: 1, _id: 0 })
    .sort({ createTime: 1 });

  ws.send(
    JSON.stringify({
      type: "allMessage",
      data: _.groupBy(messages, "groupId"),
    }),
  );
};
