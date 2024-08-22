import {
  addToCart,
  removeFromCart,
  getCart,
} from "../../controllers/cartController";
import userModel from "../../models/userModel";

jest.mock("../../models/userModel");

describe("Cart Controller", () => {
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

  describe("addToCart", () => {
    it("should add a new item to cart", async () => {
      const mockUser = {
        cartData: {},
      };
      userModel.findById.mockResolvedValue(mockUser);
      userModel.findByIdAndUpdate.mockResolvedValue({});

      req.body = { userId: "user123", itemId: "item456" };

      await addToCart(req, res);

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith("user123", {
        cartData: { item456: 1 },
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Added To Cart",
      });
    });

    it("should increment quantity for existing item in cart", async () => {
      const mockUser = {
        cartData: { item456: 1 },
      };
      userModel.findById.mockResolvedValue(mockUser);
      userModel.findByIdAndUpdate.mockResolvedValue({});

      req.body = { userId: "user123", itemId: "item456" };

      await addToCart(req, res);

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith("user123", {
        cartData: { item456: 2 },
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Added To Cart",
      });
    });

    it("should handle errors", async () => {
      userModel.findById.mockRejectedValue(new Error("Database error"));

      req.body = { userId: "user123", itemId: "item456" };

      await addToCart(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Error",
      });
    });
  });

  describe("removeFromCart", () => {
    it("should decrement quantity for existing item in cart", async () => {
      const mockUser = {
        cartData: { item456: 2 },
      };
      userModel.findById.mockResolvedValue(mockUser);
      userModel.findByIdAndUpdate.mockResolvedValue({});

      req.body = { userId: "user123", itemId: "item456" };

      await removeFromCart(req, res);

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith("user123", {
        cartData: { item456: 1 },
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Removed From Cart",
      });
    });

    it("should not decrement quantity if item is not in cart", async () => {
      const mockUser = {
        cartData: {},
      };
      userModel.findById.mockResolvedValue(mockUser);
      userModel.findByIdAndUpdate.mockResolvedValue({});

      req.body = { userId: "user123", itemId: "item456" };

      await removeFromCart(req, res);

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith("user123", {
        cartData: {},
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Removed From Cart",
      });
    });

    it("should handle errors", async () => {
      userModel.findById.mockRejectedValue(new Error("Database error"));

      req.body = { userId: "user123", itemId: "item456" };

      await removeFromCart(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Error",
      });
    });
  });

  describe("getCart", () => {
    it("should return cart data for user", async () => {
      const mockUser = {
        cartData: { item456: 2, item789: 1 },
      };
      userModel.findById.mockResolvedValue(mockUser);

      req.body = { userId: "user123" };

      await getCart(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        cartData: { item456: 2, item789: 1 },
      });
    });

    it("should handle errors", async () => {
      userModel.findById.mockRejectedValue(new Error("Database error"));

      req.body = { userId: "user123" };

      await getCart(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Error",
      });
    });
  });
});
