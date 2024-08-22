import {
  placeOrder,
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus,
} from "../../controllers/orderController";
import orderModel from "../../models/orderModel";
import userModel from "../../models/userModel";
import Stripe from "stripe";

jest.mock("../../models/orderModel");
jest.mock("../../models/userModel");
jest.mock("stripe");

describe("Order Controller", () => {
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
    process.env.STRIPE_SECRET_KEY = "test_stripe_key";
  });

  describe("placeOrder", () => {
    it("should place an order successfully", async () => {
      const mockOrder = {
        _id: "order123",
        save: jest.fn().mockResolvedValue(true),
      };
      orderModel.mockImplementation(() => mockOrder);
      userModel.findByIdAndUpdate.mockResolvedValue({});
      Stripe.prototype.checkout = {
        sessions: {
          create: jest
            .fn()
            .mockResolvedValue({ url: "https://stripe.com/checkout" }),
        },
      };

      req.body = {
        userId: "user123",
        items: [{ name: "Test Item", price: 10, quantity: 2 }],
        amount: 22,
        address: { street: "123 Test St", city: "Test City" },
      };

      await placeOrder(req, res);

      expect(mockOrder.save).toHaveBeenCalled();
      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith("user123", {
        cartData: {},
      });
      expect(Stripe.prototype.checkout.sessions.create).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        session_url: "https://stripe.com/checkout",
      });
    });

    it("should handle errors when placing an order", async () => {
      orderModel.mockImplementation(() => {
        throw new Error("Database error");
      });

      req.body = {
        userId: "user123",
        items: [{ name: "Test Item", price: 10, quantity: 2 }],
        amount: 22,
        address: { street: "123 Test St", city: "Test City" },
      };

      await placeOrder(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Error",
      });
    });
  });

  describe("verifyOrder", () => {
    it("should verify a successful payment", async () => {
      orderModel.findByIdAndUpdate.mockResolvedValue({});

      req.body = { orderId: "order123", success: "true" };

      await verifyOrder(req, res);

      expect(orderModel.findByIdAndUpdate).toHaveBeenCalledWith("order123", {
        payment: true,
      });
      expect(res.json).toHaveBeenCalledWith({ success: true, message: "Paid" });
    });

    it("should handle unsuccessful payment", async () => {
      orderModel.findOneAndDelete.mockResolvedValue({});

      req.body = { orderId: "order123", success: "false" };

      await verifyOrder(req, res);

      expect(orderModel.findOneAndDelete).toHaveBeenCalledWith("order123");
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Not Paid",
      });
    });
  });

  describe("userOrders", () => {
    it("should retrieve user orders", async () => {
      const mockOrders = [{ _id: "order1" }, { _id: "order2" }];
      orderModel.find.mockResolvedValue(mockOrders);

      req.body = { userId: "user123" };

      await userOrders(req, res);

      expect(orderModel.find).toHaveBeenCalledWith({ userId: "user123" });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockOrders,
      });
    });
  });

  describe("listOrders", () => {
    it("should list all orders", async () => {
      const mockOrders = [{ _id: "order1" }, { _id: "order2" }];
      orderModel.find.mockResolvedValue(mockOrders);

      await listOrders(req, res);

      expect(orderModel.find).toHaveBeenCalledWith({});
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockOrders,
      });
    });
  });

  describe("updateStatus", () => {
    it("should update order status", async () => {
      orderModel.findByIdAndUpdate.mockResolvedValue({});

      req.body = { orderId: "order123", status: "Delivered" };

      await updateStatus(req, res);

      expect(orderModel.findByIdAndUpdate).toHaveBeenCalledWith("order123", {
        status: "Delivered",
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Status Updated",
      });
    });
  });
});
