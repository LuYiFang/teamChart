import express from "express";
import userRouter from "./routers/userRouter";

const app = express();

app.use(express.json());
app.use("/api", userRouter);

app.get("/", (req, res) => {
  res.send("Hello, ts!");
});

app.use("/users", userRouter);

export default app;
