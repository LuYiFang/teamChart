import express from "express";
import UserController from "../controllers/userControllers";
import { LOGIN_URL, SIGNUP_URL, USERS_URL } from "../utils/constants";
import { authenticateToken } from "../utils/auth";

const router = express.Router();
const userController = new UserController();

router.post(LOGIN_URL, userController.login);
router.post(SIGNUP_URL, userController.signup);

router.get(USERS_URL, authenticateToken, userController.users);

export default router;
