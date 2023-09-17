import request from "supertest";
import { app } from "../app";
import { faker } from "@faker-js/faker";
import { dbConnect, dbDisconnect, dbDrop } from "../db/database";

describe("TEST USERS ROUTE", () => {
  let response: request.Response;

  beforeEach(async () => {
    await dbConnect();
  });

  afterEach(async () => {
    await dbDrop();
  });

  afterAll(async () => {
    await dbDisconnect();
  });

  test("LOGIN", async () => {
    await request(app)
      .post("/users")
      .send({
        name: faker.person.fullName(),
        age: faker.number.int(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      })
      .expect(201);
  });
});
