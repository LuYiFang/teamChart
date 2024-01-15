import express, { response } from "express";
import userRouter from "./routers/userRouter";
import { PORT as ENV_PORT } from "./utils/constants";

const app = express();
const PORT = ENV_PORT || 3000;

app.use(express.json());
app.use("/api", userRouter);

app.get("/", (req, res) => {
  res.send("Hello, ts!");
});

app.use("/users", userRouter);

export const server = app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

export default app;
