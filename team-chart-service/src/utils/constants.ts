import { Jwt } from "jsonwebtoken";

export const SECRET_KEY: string = process.env.SECRET_KEY as string;
export const PORT = process.env.PORT;

export const API_BASE_PATH = "/api";
// user url
export const LOGIN_URL = "/login";
export const SIGNUP_URL = "/signup";
export const USERS_URL = "/users";

// db
export const MONGO_DB_URL: string = process.env.MONGO_DB as string;
export const MONGO_DB_NAME: string = process.env.MONGO_DB_NAME as string;

// password
export const saltRounds: number = parseInt(process.env.SALT_ROUND as string);
