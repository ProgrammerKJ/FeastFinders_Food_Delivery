import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { connectDB } from "./config/db";

let mongod;

// Increase the timeout for Jest
jest.setTimeout(30000);

// Connect to the database before running tests
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.TEST_MONGODB_URI = uri;
  process.env.NODE_ENV = "test";
  await connectDB();
});

// Disconnect and close the db connection
afterAll(async () => {
  await mongoose.connection.close();
  await mongod.stop();
});

// Clear all test data after every test
beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
