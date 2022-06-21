import request from "supertest";
import { app } from "../../app";

it("should fail when an email that does not exist is supplied", async () => {
  return request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

it("should fail when an incorrect password is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
  return request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "passwor",
    })
    .expect(400);
});

it("should return a 200 and a cookie on successful signin", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);
  expect(response.get("Set-Cookie")).toBeDefined();
});

it("should return a 400 on invalid email", async () => {
  return request(app)
    .post("/api/users/signin")
    .send({
      email: "test",
      password: "password",
    })
    .expect(400);
});

it("should return a 400 on invalid password", async () => {
  return request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "pas",
    })
    .expect(400);
});

it("should return a 400 on missing email and password", async () => {
  return request(app).post("/api/users/signin").send({}).expect(400);
});
