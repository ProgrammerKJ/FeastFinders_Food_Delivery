import mongoose from "mongoose";
import userModel from "../../models/userModel";

describe("User Model Test", () => {
  it("create & save user successfully", async () => {
    const validUser = new userModel({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password123",
      cartData: { item1: 1, item2: 2 },
    });
    const savedUser = await validUser.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe(validUser.name);
    expect(savedUser.email).toBe(validUser.email);
    expect(savedUser.password).toBe(validUser.password);
    expect(savedUser.cartData).toEqual(validUser.cartData);
  });

  it("create user without required field should fail", async () => {
    const userWithoutRequiredField = new userModel({ name: "John Doe" });
    let err;
    try {
      await userWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.email).toBeDefined();
    expect(err.errors.password).toBeDefined();
  });

  it("create user with existing email should fail", async () => {
    const userData = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password123",
    };

    const validUser = new userModel(userData);
    await validUser.save();

    const userWithExistingEmail = new userModel(userData);
    let err;
    try {
      await userWithExistingEmail.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.code).toBe(11000);
  });

  it("create user without cartData should have empty object as default", async () => {
    const userWithoutCartData = new userModel({
      name: "Jane Doe",
      email: "janedoe@example.com",
      password: "password123",
    });
    const savedUser = await userWithoutCartData.save();
    expect(savedUser.cartData).toEqual({});
  });
});
