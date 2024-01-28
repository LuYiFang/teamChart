import request from "supertest";
import bcrypt from "bcrypt";
import app from "../../src/app";
import {
  API_BASE_PATH,
  LOGIN_URL,
  SIGNUP_URL,
  USERS_URL,
} from "../../src/utils/constants";
import { MongoMemoryServer } from "mongodb-memory-server";
import UserModel from "../../src/models/userModel";
import { connect, disconnect } from "../../src/utils/db";

const API_TYPE = "User";

let mongod: MongoMemoryServer;

const createMemoryDB = async () => {
  mongod = await MongoMemoryServer.create({
    instance: {
      port: 27777,
    },
  });
  await connect();
};

const createUser = async () => {
  try {
    await new UserModel({
      username: "testUser",
      password: await bcrypt.hash("testPassword", 10),
    }).save();
  } catch (error) {
    console.error("Error creating UserModel:", error);
    throw error;
  }
};

const stopMemoryDB = async () => {
  try {
    await disconnect();
    if (mongod) {
      await mongod.stop();
    }
  } catch (error) {
    console.error("Error closing the server:", error);
  }
};

beforeAll(async () => {
  await createMemoryDB();
});

afterAll(async () => {
  await stopMemoryDB();
});

describe(`${API_TYPE} login tests`, () => {
  beforeAll(async () => {
    await UserModel.deleteMany({});
    await createUser();
  });

  const url_name = LOGIN_URL;
  const url = `${API_BASE_PATH}${url_name}`;

  test(`POST ${url_name} successfully. Should return jwt token.`, async () => {
    const response = await request(app).post(url).send({
      username: "testUser",
      password: "testPassword",
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  test(`POST ${url_name} failed. Should return 401.`, async () => {
    const response = await request(app)
      .post(url)
      .send({ username: "invalidUser", password: "invalidPassword" });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid username or password");
  });
});

describe(`${API_TYPE} signup tests`, () => {
  beforeAll(async () => {
    await UserModel.deleteMany({});
  });

  const url_name = SIGNUP_URL;
  const url = `${API_BASE_PATH}${url_name}`;

  test(`POST ${url_name} successfully. Should return 201.`, async () => {
    const response = await request(app).post(url).send({
      username: "newUser",
      password: "newPassword",
    });

    expect(response.status).toBe(201);
  });

  test(`POST ${url_name} failed. Should return 400.`, async () => {
    const response = await request(app)
      .post(url)
      .send({ username: "newUser", password: "aaaaa" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Username already exists");
  });
});

describe(`${API_TYPE} users tests`, () => {
  beforeAll(async () => {
    await UserModel.deleteMany({});
    await createUser();
  });

  const url_name = USERS_URL;
  const url = `${API_BASE_PATH}${url_name}`;

  test(`GET ${url_name} successfully. Should return users.`, async () => {
    const loginRes = await request(app)
      .post(`${API_BASE_PATH}${LOGIN_URL}`)
      .send({
        username: "testUser",
        password: "testPassword",
      });
    const token = loginRes.body.token;

    const response = await request(app)
      .get(url)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.users).toEqual([{ username: "testUser" }]);
  });

  test(`GET ${url_name} failed. Should return Unauthorized.`, async () => {
    const response = await request(app).get(url);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Unauthorized");
  });
});
