import request from "supertest";
import app, { server } from "../../src/index";
import { API_BASE_PATH, LOGIN_URL } from "../../src/utils/constants";

const API_TYPE = "User";

describe(`${API_TYPE} API tests`, () => {
  const url = `${API_BASE_PATH}${LOGIN_URL}`;
  test(`POST ${LOGIN_URL} successfully. Should return jwt token.`, async () => {
    const response = await request(app).post(url).send({
      username: "user1",
      password: "password1",
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

afterAll((done) => {
  server.close((err?: Error): void => {
    if (err) {
      console.error("Error closing server:", err);
    } else {
      console.log("Server closed successfully");
    }
    done();
  });
});
