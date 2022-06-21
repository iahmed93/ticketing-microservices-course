import request from "supertest";
import { app } from "../app";

export const signin = async () => {
  const email = "test@test.com";
  const password = "password";

  const signUpResponse = await request(app)
    .post("/api/users/signup")
    .send({
      email,
      password,
    })
    .expect(201);
  return signUpResponse.get("Set-Cookie");
};
