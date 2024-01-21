import express from "express";
import userRouter from "./routers/userRouter";
import cors, { CorsOptions } from "cors";

const app = express();

const corsOptions: CorsOptions = {
  origin: ["http://127.0.0.1:3002", "http://localhost:3002"],
  credentials: false,
  methods: ["*"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api", userRouter);

app.get("/", (req, res) => {
  res.send("Hello, ts!");
});

app.use("/users", userRouter);

export default app;
