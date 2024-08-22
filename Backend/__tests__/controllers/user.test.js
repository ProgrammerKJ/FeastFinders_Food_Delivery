import { loginUser, registerUser } from "../../controllers/userController";
import userModel from "../../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

jest.mock("../../models/userModel");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("validator");

describe("User Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  describe("loginUser", () => {
    it("should login user successfully", async () => {
      const user = {
        _id: "user_id",
        email: "test@example.com",
        password: "hashedPassword",
      };
      userModel.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("token");

      req.body = { email: "test@example.com", password: "password123" };

      await loginUser(req, res);

      expect(res.json).toHaveBeenCalledWith({ success: true, token: "token" });
    });

    it("should return error for non-existent user", async () => {
      userModel.findOne.mockResolvedValue(null);

      req.body = { email: "nonexistent@example.com", password: "password123" };

      await loginUser(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "User Doesn't Exist",
      });
    });

    it("should return error for invalid password", async () => {
      const user = {
        _id: "user_id",
        email: "test@example.com",
        password: "hashedPassword",
      };
      userModel.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);

      req.body = { email: "test@example.com", password: "wrongpassword" };

      await loginUser(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid Password",
      });
    });
  });

  describe("registerUser", () => {
    it("should register user successfully", async () => {
      userModel.findOne.mockResolvedValue(null);
      validator.isEmail.mockReturnValue(true);
      bcrypt.genSalt.mockResolvedValue("salt");
      bcrypt.hash.mockResolvedValue("hashedPassword");
      userModel.prototype.save.mockResolvedValue({ _id: "new_user_id" });
      jwt.sign.mockReturnValue("token");

      req.body = {
        name: "Test User",
        email: "newuser@example.com",
        password: "password123",
      };

      await registerUser(req, res);

      expect(res.json).toHaveBeenCalledWith({ success: true, token: "token" });
    });

    it("should return error for existing user", async () => {
      userModel.findOne.mockResolvedValue({ _id: "existing_user_id" });

      req.body = {
        name: "Existing User",
        email: "existing@example.com",
        password: "password123",
      };

      await registerUser(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "User already exists",
      });
    });

    it("should return error for invalid email", async () => {
      userModel.findOne.mockResolvedValue(null);
      validator.isEmail.mockReturnValue(false);

      req.body = {
        name: "Invalid Email User",
        email: "invalidemail",
        password: "password123",
      };

      await registerUser(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Need to enter a valid email address",
      });
    });

    it("should return error for short password", async () => {
      userModel.findOne.mockResolvedValue(null);
      validator.isEmail.mockReturnValue(true);

      req.body = {
        name: "Short Password User",
        email: "shortpass@example.com",
        password: "short",
      };

      await registerUser(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Please enter at least 8 characters",
      });
    });
  });
});
