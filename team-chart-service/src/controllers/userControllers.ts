import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { SECRET_KEY } from "../utils/constants";
import connect from "../utils/db";

class UserController {
  async login(req: Request, res: Response) {
    const { username, password } = req.body;

    const db = await connect();
    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ message: "Invalid username or password" });
      return;
    }

    const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({ token });
  }
}

export default UserController;
