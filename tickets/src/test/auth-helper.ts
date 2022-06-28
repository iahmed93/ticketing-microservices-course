import jwt from "jsonwebtoken";

export const signin = (): string[] => {
  const token = jwt.sign({email : "test@test.com", password: "password"}, process.env.JWT_KEY!);
  const session = {jwt: token};
  const base64Session = Buffer.from(JSON.stringify(session)).toString('base64');
  return [`session=${base64Session}; path=/; httponly`];
};
