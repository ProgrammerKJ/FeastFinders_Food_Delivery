import mongoose from "mongoose";

describe("Database Connection", () => {
  it("should be connected to the database", () => {
    expect(mongoose.connection.readyState).toBe(1);
  });
});
