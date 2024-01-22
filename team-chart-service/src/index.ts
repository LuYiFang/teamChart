import app from "./app";
import { PORT as ENV_PORT } from "./utils/constants";
import { connect, disconnect } from "./utils/db";
import { Server as WebSocketServer } from "ws";
import { setupWebsocket } from "./websocket";

const wss = new WebSocketServer({ noServer: true });

const PORT = ENV_PORT || 3000;

export const server = app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  connect();
});

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

setupWebsocket(wss);

server.on("close", async () => {
  await disconnect();
});
