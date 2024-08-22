import authMiddleware from "../../middleware/auth";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken");

describe("Auth Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
      body: {},
    };
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    process.env.JWT_SECRET = "test_secret";
  });

  it("should return not authorized if no token is provided", async () => {
    await authMiddleware(req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Not Authorized!",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next() if a valid token is provided", async () => {
    const mockToken = "valid.mock.token";
    const mockDecoded = { id: "user123" };
    req.headers.token = mockToken;
    jwt.verify.mockReturnValue(mockDecoded);

    await authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(mockToken, "test_secret");
    expect(req.body.userId).toBe("user123");
    expect(next).toHaveBeenCalled();
  });

  it("should return error if token verification fails", async () => {
    const mockToken = "invalid.mock.token";
    req.headers.token = mockToken;
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    await authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(mockToken, "test_secret");
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Error",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
