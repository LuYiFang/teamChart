import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "./constants";
import UserModel from "../controllers/userModel";

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const tokenHeader = req.headers.authorization;

  if (!tokenHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!tokenHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized - invalid token" });
  }

  const token = tokenHeader.slice(7);

  jwt.verify(token, SECRET_KEY, { ignoreExpiration: false }, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: `Unauthorized - ${err.message}` });
    }

    const userId = (decoded as { userId: string }).userId;

    const user = UserModel.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - user not found" });
    }

    res.locals.userId = userId;
    next();
  });
}
