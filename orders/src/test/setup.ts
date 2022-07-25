import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

jest.mock('../nats-wrapper.ts');

let mongo: any;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  await mongoose.connect(uri);

  process.env.JWT_KEY = "secret";
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  collections.forEach(async (collection) => {
    await collection.deleteMany({});
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});
