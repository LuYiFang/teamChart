import app from "./app";
import { PORT as ENV_PORT } from "./utils/constants";
import { connect, disconnect } from "./utils/db";

const PORT = ENV_PORT || 3000;

export const server = app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  connect();
});

server.on("close", async () => {
  await disconnect();
});
