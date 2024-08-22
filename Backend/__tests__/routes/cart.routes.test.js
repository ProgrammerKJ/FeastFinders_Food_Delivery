import request from "supertest";
import express from "express";
import cartRoute from "../../routes/cartRoute";
import {
  addToCart,
  removeFromCart,
  getCart,
} from "../../controllers/cartController";
import authMiddleware from "../../middleware/auth";

jest.mock("../../controllers/cartController");
jest.mock("../../middleware/auth");

const app = express();
app.use(express.json());
app.use("/api/cart", cartRoute);

describe("Cart Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/cart/add", () => {
    it("should call addToCart controller when authenticated", async () => {
      const mockCartItem = {
        userId: "user123",
        itemId: "item456",
      };

      authMiddleware.mockImplementation((req, res, next) => next());
      addToCart.mockImplementation((req, res) => {
        res.json({ success: true, message: "Item added to cart" });
      });

      const response = await request(app)
        .post("/api/cart/add")
        .send(mockCartItem);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: "Item added to cart",
      });
      expect(authMiddleware).toHaveBeenCalledTimes(1);
      expect(addToCart).toHaveBeenCalledTimes(1);
    });

    it("should not call addToCart controller when not authenticated", async () => {
      const mockCartItem = {
        userId: "user123",
        itemId: "item456",
      };

      authMiddleware.mockImplementation((req, res, next) => {
        res.status(401).json({ success: false, message: "Not authenticated" });
      });

      const response = await request(app)
        .post("/api/cart/add")
        .send(mockCartItem);

      expect(response.statusCode).toBe(401);
      expect(response.body).toEqual({
        success: false,
        message: "Not authenticated",
      });
      expect(authMiddleware).toHaveBeenCalledTimes(1);
      expect(addToCart).not.toHaveBeenCalled();
    });
  });

  describe("POST /api/cart/remove", () => {
    it("should call removeFromCart controller when authenticated", async () => {
      const mockCartItem = {
        userId: "user123",
        itemId: "item456",
      };

      authMiddleware.mockImplementation((req, res, next) => next());
      removeFromCart.mockImplementation((req, res) => {
        res.json({ success: true, message: "Item removed from cart" });
      });

      const response = await request(app)
        .post("/api/cart/remove")
        .send(mockCartItem);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: "Item removed from cart",
      });
      expect(authMiddleware).toHaveBeenCalledTimes(1);
      expect(removeFromCart).toHaveBeenCalledTimes(1);
    });
  });

  describe("POST /api/cart/get", () => {
    it("should call getCart controller when authenticated", async () => {
      const mockUserId = {
        userId: "user123",
      };

      authMiddleware.mockImplementation((req, res, next) => next());
      getCart.mockImplementation((req, res) => {
        res.json({ success: true, cart: { items: [] } });
      });

      const response = await request(app)
        .post("/api/cart/get")
        .send(mockUserId);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ success: true, cart: { items: [] } });
      expect(authMiddleware).toHaveBeenCalledTimes(1);
      expect(getCart).toHaveBeenCalledTimes(1);
    });
  });
});
