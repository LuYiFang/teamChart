import { WebSocket, WebSocketServer } from "ws";
import { verifyToken } from "../utils/auth";
import ChartController from "./chartControllers";
import _ from "lodash";

class WebSocketController {
  private wss: WebSocketServer;
  private ws: WebSocket;

  private chartController: ChartController;
  private userSocketMap: Map<string, WebSocket>;
  private handlers: Record<
    string,
    (data: Record<string, any>) => Promise<void>
  >;

  constructor(
    wss: WebSocketServer,
    ws: WebSocket,
    userSocketMap: Map<string, WebSocket>,
  ) {
    this.wss = wss;
    this.ws = ws;
    this.chartController = new ChartController();
    this.userSocketMap = userSocketMap;

    this.handlers = {
      initail: this.handleInitail.bind(this),
      newMessage: this.handleNewMessage.bind(this),
      newWish: this.handleNewWish.bind(this),
      voteWish: this.handleVoteWish.bind(this),
      logingReturnEvent: this.handleLogingReturn.bind(this),
      logoutEvent: this.handleLoging.bind(this),
      call: this.handleCall.bind(this),
      chainCall: this.handleChainCall.bind(this),
      broadcast: this.handleBroadcast.bind(this),
      movingGroup: this.handleMovingGroup.bind(this),
    };
  }

  async handleWebSocketMessage(data: Record<string, any>) {
    const { type } = data;
    const handler = this.handlers[type];

    if (handler) {
      await handler(data);
    }
  }

  private async handleInitail(data: Record<string, any>) {
    const { isSuccess, result } = await verifyToken(data.token);
    if (!isSuccess) {
      this.ws.send(
        JSON.stringify({
          type: "initailFailed",
          message: `${result}`,
        }),
      );
      this.ws.close();
      return;
    }

    this.broadcastAllGroupHistory();
    this.broadcastWishHistory();

    const { username } = result as { userId: string; username: string };
    this.userSocketMap.set(username, this.ws);

    this.broadcastToAll(
      {
        type: "loginEvent",
        username: username,
      },
      true,
    );
  }

  private async handleNewMessage(data: Record<string, any>) {
    this.broadcastToAll({
      type: "newMessage",
      groupId: data.groupId,
      message: data.message,
      username: data.username,
    });

    this.chartController.saveMessage(data.username, data.groupId, data.message);
  }

  private async handleNewWish(data: Record<string, any>) {
    const newWish = await this.chartController.saveOpenWishBoard(
      data.username,
      data.content,
    );

    this.broadcastToAll({
      type: "newWish",
      _id: newWish._id,
      content: newWish.content,
      username: newWish.username,
      voteCount: 0,
      createdAt: newWish.createdAt,
    });
  }

  private async handleVoteWish(data: Record<string, any>) {
    try {
      await this.chartController.voteWish(data.wishId, data.username);
      const newCount = await this.chartController.countVote(data.wishId);
      this.broadcastToAll({
        type: "voteWish",
        wishId: data.wishId,
        newCount: newCount,
      });
    } catch (error) {
      this.ws.send(
        JSON.stringify({
          type: "errorMessage",
          error: `Only one vote is allowed per wish`,
        }),
      );
    }
  }

  private async handleLogingReturn(data: Record<string, any>) {
    this.broadcastTo(data.targetUser, {
      type: "logingReturnEvent",
      username: data.username,
    });
  }

  private async handleLoging(data: Record<string, any>) {
    this.broadcastToAll(
      {
        type: "logoutEvent",
        username: data.username,
      },
      false,
    );
  }

  private async handleCall(data: Record<string, any>) {
    this.broadcastTo(data.targetUser, {
      type: "call",
      username: data.username,
      message: data.message,
    });
  }

  private async handleChainCall(data: Record<string, any>) {
    this.broadcastTo(data.targetUser, {
      type: "chainCall",
      username: data.username,
      message: data.message,
    });
  }

  private async handleBroadcast(data: Record<string, any>) {
    this.broadcastToAll({
      type: "broadcast",
      username: data.username,
      message: data.message,
    });
  }

  private async handleMovingGroup(data: Record<string, any>) {
    this.broadcastToAll({
      type: "movingGroup",
      username: data.username,
      groupId: data.groupId,
    });
  }

  send(data: Record<string, any>) {
    this.ws.send(JSON.stringify(data));
  }

  broadcastToAll(data: Record<string, any>, includeSelf: boolean = true) {
    this.wss.clients.forEach((client) => {
      let cond = true;
      if (!includeSelf) cond = client !== this.ws;

      if (cond && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }

  broadcastTo(targetUser: string, data: Record<string, any>) {
    const ws = this.userSocketMap.get(targetUser);
    if (!ws) {
      console.log("broadcast to failed");
      return;
    }
    ws.send(JSON.stringify(data));
  }

  async broadcastAllGroupHistory() {
    const messageList = await this.chartController.getAllMessageHistory();
    this.send({
      type: "allMessage",
      data: _.groupBy(messageList, "groupId"),
    });
  }

  async broadcastWishHistory() {
    const wishList = await this.chartController.getOpenWishBoard();
    this.send({
      type: "openWish",
      data: wishList,
    });
  }
}
export default WebSocketController;
