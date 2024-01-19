import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { SECRET_KEY, saltRounds } from "../utils/constants";
import UserModel from "./userModel";

class UserController {
  async login(req: Request, res: Response) {
    const { username, password } = req.body;

    try {
      const user = await UserModel.findOne({ username });
      if (!user) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
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
    } catch (error) {
      console.error("Error in login:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async signup(req: Request, res: Response) {
    const { username, password } = req.body;

    try {
      const user = await UserModel.findOne({ username });
      if (user) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = new UserModel({ username, password: hashedPassword });
      await newUser.save();

      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.error("Error in signup:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async users(req: Request, res: Response) {
    try {
      const users = await UserModel.find({}).select({ username: 1, _id: 0 });
      if (!users) {
        return res.status(404).json({ message: "No users found" });
      }

      res.json({ users });
    } catch (error) {
      console.error("Error in login:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
}

export default UserController;
