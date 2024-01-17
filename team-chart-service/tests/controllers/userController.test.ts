import request from "supertest";
import bcrypt from "bcrypt";
import app, { server } from "../../src/index";
import { API_BASE_PATH, LOGIN_URL } from "../../src/utils/constants";
import { MongoMemoryServer } from "mongodb-memory-server";
import UserModel from "../../src/controllers/userModel";
import { disconnect } from "../../src/utils/db";

const API_TYPE = "User";

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create({
    instance: {
      port: 27777,
    },
  });
});

afterAll(async () => {
  try {
    server.close();
    if (mongod) {
      await mongod.stop();
    }
    await disconnect();
  } catch (error) {
    console.error("Error closing the server:", error);
  }
});

beforeEach(async () => {
  await new UserModel({
    username: "testuser",
    password: await bcrypt.hash("testpassword", 10),
  }).save();
});

describe(`${API_TYPE} API tests`, () => {
  const url = `${API_BASE_PATH}${LOGIN_URL}`;
  test(`POST ${LOGIN_URL} successfully. Should return jwt token.`, async () => {
    const response = await request(app).post(url).send({
      username: "testuser",
      password: "testpassword",
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  test(`POST ${LOGIN_URL} failed. Should return 401.`, async () => {
    const response = await request(app)
      .post(url)
      .send({ username: "invalidUser", password: "invalidPassword" });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid username or password");
  });
});
