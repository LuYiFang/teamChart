import { WebSocket, Server as WebSocketServer } from "ws";
import _ from "lodash";
import WebSocketController from "./controllers/webSocketController";

const userSocketMap = new Map<string, WebSocket>();

export const setupWebsocket = (wss: WebSocketServer) => {
  wss.on("connection", async (ws, req) => {
    console.log("ws client connected");
    const handler = new WebSocketController(wss, ws, userSocketMap);

    ws.on("message", async (message) => {
      try {
        const messageString = message.toString();
        const data = JSON.parse(messageString);
        handler.handleWebSocketMessage(data);
      } catch (error) {
        ws.send(
          JSON.stringify({
            type: "errorMessage",
            error: `${error}`,
          }),
        );
      }
    });

    ws.on("close", () => {
      console.log("ws client disconnected");
    });
  });
};
