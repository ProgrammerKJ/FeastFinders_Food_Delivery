import request from "supertest";
import express from "express";
import userRoute from "../../routes/userRoute";
import { loginUser, registerUser } from "../../controllers/userController";

jest.mock("../../controllers/userController");

const app = express();
app.use(express.json());
app.use("/api/users", userRoute);

describe("User Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/users/register", () => {
    it("should call registerUser controller", async () => {
      const mockUser = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      registerUser.mockImplementation((req, res) => {
        res.json({ success: true, message: "User registered successfully" });
      });

      const response = await request(app)
        .post("/api/users/register")
        .send(mockUser);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: "User registered successfully",
      });
      expect(registerUser).toHaveBeenCalledTimes(1);
    });
  });

  describe("POST /api/users/login", () => {
    it("should call loginUser controller", async () => {
      const mockCredentials = {
        email: "test@example.com",
        password: "password123",
      };

      loginUser.mockImplementation((req, res) => {
        res.json({ success: true, token: "mock_token" });
      });

      const response = await request(app)
        .post("/api/users/login")
        .send(mockCredentials);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ success: true, token: "mock_token" });
      expect(loginUser).toHaveBeenCalledTimes(1);
    });
  });
});
