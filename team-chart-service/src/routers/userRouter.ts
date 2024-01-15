import express from "express";
import UserController from "../controllers/userControllers";
import { LOGIN_URL } from "../utils/constants";

const router = express.Router();
const userController = new UserController();

router.post(LOGIN_URL, userController.login);

export default router;
