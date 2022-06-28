import request from "supertest";
import { signin } from "../../test/auth-helper";
import { app } from "../../app";

it("should return current user details", async () => {
  const cookie = await signin();
  console.log(cookie);
  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .expect(200);
  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("should return null if not authenticated", async () => {
  return request(app).get("/api/users/currentuser").expect(401);
});
