import request from "supertest";
import express from "express";
import orderRoute from "../../routes/orderRoute";
import {
  listOrders,
  placeOrder,
  updateStatus,
  userOrders,
  verifyOrder,
} from "../../controllers/orderController";
import authMiddleware from "../../middleware/auth";

jest.mock("../../controllers/orderController");
jest.mock("../../middleware/auth");

const app = express();
app.use(express.json());
app.use("/api/orders", orderRoute);

describe("Order Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/orders/place", () => {
    it("should call placeOrder controller when authenticated", async () => {
      const mockOrder = {
        userId: "user123",
        items: [{ id: "item1", quantity: 2 }],
        totalAmount: 50,
      };

      authMiddleware.mockImplementation((req, res, next) => next());
      placeOrder.mockImplementation((req, res) => {
        res.json({ success: true, message: "Order placed successfully" });
      });

      const response = await request(app)
        .post("/api/orders/place")
        .send(mockOrder);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: "Order placed successfully",
      });
      expect(authMiddleware).toHaveBeenCalledTimes(1);
      expect(placeOrder).toHaveBeenCalledTimes(1);
    });
  });

  describe("POST /api/orders/verify", () => {
    it("should call verifyOrder controller", async () => {
      const mockVerification = {
        orderId: "order123",
        success: true,
      };

      verifyOrder.mockImplementation((req, res) => {
        res.json({ success: true, message: "Order verified" });
      });

      const response = await request(app)
        .post("/api/orders/verify")
        .send(mockVerification);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: "Order verified",
      });
      expect(verifyOrder).toHaveBeenCalledTimes(1);
    });
  });

  describe("POST /api/orders/userorders", () => {
    it("should call userOrders controller when authenticated", async () => {
      const mockUserId = { userId: "user123" };

      authMiddleware.mockImplementation((req, res, next) => next());
      userOrders.mockImplementation((req, res) => {
        res.json({ success: true, orders: [] });
      });

      const response = await request(app)
        .post("/api/orders/userorders")
        .send(mockUserId);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ success: true, orders: [] });
      expect(authMiddleware).toHaveBeenCalledTimes(1);
      expect(userOrders).toHaveBeenCalledTimes(1);
    });
  });

  describe("GET /api/orders/list", () => {
    it("should call listOrders controller", async () => {
      listOrders.mockImplementation((req, res) => {
        res.json({ success: true, orders: [] });
      });

      const response = await request(app).get("/api/orders/list");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ success: true, orders: [] });
      expect(listOrders).toHaveBeenCalledTimes(1);
    });
  });

  describe("POST /api/orders/status", () => {
    it("should call updateStatus controller", async () => {
      const mockStatusUpdate = {
        orderId: "order123",
        status: "delivered",
      };

      updateStatus.mockImplementation((req, res) => {
        res.json({ success: true, message: "Status updated successfully" });
      });

      const response = await request(app)
        .post("/api/orders/status")
        .send(mockStatusUpdate);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: "Status updated successfully",
      });
      expect(updateStatus).toHaveBeenCalledTimes(1);
    });
  });
});
