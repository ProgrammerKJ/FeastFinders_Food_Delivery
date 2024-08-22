import request from "supertest";
import express from "express";
import foodRoute from "../../routes/foodRoute";
import {
  addFood,
  listFood,
  removeFood,
} from "../../controllers/foodController";
import multer from "multer";
import path from "path";

jest.mock("../../controllers/foodController");

jest.mock("multer", () => {
  const multerMock = jest.fn().mockReturnValue({
    single: jest.fn().mockImplementation(() => (req, res, next) => {
      req.file = {
        filename: "mocked-filename.jpg",
      };
      next();
    }),
  });
  multerMock.diskStorage = jest.fn();
  return multerMock;
});

const app = express();
app.use(express.json());
app.use("/api/food", foodRoute);

describe("Food Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/food/add", () => {
    it("should call addFood controller with uploaded file", async () => {
      const mockFood = {
        name: "Test Food",
        description: "Test Description",
        price: 9.99,
        category: "Test Category",
      };

      addFood.mockImplementation((req, res) => {
        res.json({ success: true, message: "Food added successfully" });
      });

      const response = await request(app)
        .post("/api/food/add")
        .field("name", mockFood.name)
        .field("description", mockFood.description)
        .field("price", mockFood.price)
        .field("category", mockFood.category)
        .attach("image", Buffer.from("fake image data"), "test-image.jpg");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: "Food added successfully",
      });
      expect(addFood).toHaveBeenCalledTimes(1);
      expect(addFood.mock.calls[0][0].file).toBeDefined();
      expect(addFood.mock.calls[0][0].file.filename).toBe(
        "mocked-filename.jpg"
      );
    });
  });

  describe("GET /api/food/list", () => {
    it("should call listFood controller", async () => {
      listFood.mockImplementation((req, res) => {
        res.json({ success: true, foods: [] });
      });

      const response = await request(app).get("/api/food/list");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ success: true, foods: [] });
      expect(listFood).toHaveBeenCalledTimes(1);
    });
  });

  describe("POST /api/food/remove", () => {
    it("should call removeFood controller", async () => {
      const mockFoodId = { id: "food123" };

      removeFood.mockImplementation((req, res) => {
        res.json({ success: true, message: "Food removed successfully" });
      });

      const response = await request(app)
        .post("/api/food/remove")
        .send(mockFoodId);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: "Food removed successfully",
      });
      expect(removeFood).toHaveBeenCalledTimes(1);
    });
  });
});
