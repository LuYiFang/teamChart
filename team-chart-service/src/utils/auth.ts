import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { SECRET_KEY } from "./constants";
import UserModel from "../controllers/userModel";

export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const tokenHeader = req.headers.authorization || "";
  const { isSuccess, result } = await verifyToken(tokenHeader);
  if (!isSuccess) {
    return res.status(401).json({ message: `Unauthorized - ${result}` });
  }

  res.locals.userId = result;
  next();
}

export const verifyToken = async (tokenHeader: string) => {
  if (!tokenHeader) {
    return {
      isSuccess: false,
      result: "Unauthorized",
    };
  }

  if (!tokenHeader.startsWith("Bearer ")) {
    return {
      isSuccess: false,
      result: "invalid token",
    };
  }

  const token = tokenHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, SECRET_KEY, {
      ignoreExpiration: false,
    });

    const userId = (decoded as { userId: string }).userId;

    const user = UserModel.findById(userId);
    if (!user) {
      return {
        isSuccess: false,
        result: "user not found",
      };
    }

    return {
      isSuccess: true,
      result: userId,
    };
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return {
        isSuccess: false,
        result: error.message,
      };
    }
    return {
      isSuccess: false,
      result: "verify token failed",
    };
  }
};
