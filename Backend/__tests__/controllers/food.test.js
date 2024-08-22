import {
  addFood,
  listFood,
  removeFood,
} from "../../controllers/foodController";
import foodModel from "../../models/foodModel";
import fs from "fs";

jest.mock("../../models/foodModel");
jest.mock("fs");

describe("Food Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      file: { filename: "test-image.jpg" },
    };
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  describe("addFood", () => {
    it("should add a new food item successfully", async () => {
      const mockFood = {
        save: jest.fn().mockResolvedValue(true),
      };
      foodModel.mockImplementation(() => mockFood);

      req.body = {
        name: "Test Food",
        description: "Test Description",
        price: 9.99,
        category: "Test Category",
      };

      await addFood(req, res);

      expect(mockFood.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Food Successfuly Added",
      });
    });

    it("should handle errors when adding food", async () => {
      const mockFood = {
        save: jest.fn().mockRejectedValue(new Error("Database error")),
      };
      foodModel.mockImplementation(() => mockFood);

      req.body = {
        name: "Test Food",
        description: "Test Description",
        price: 9.99,
        category: "Test Category",
      };

      await addFood(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Error",
      });
    });
  });

  describe("listFood", () => {
    it("should list all food items", async () => {
      const mockFoods = [
        { name: "Food 1", price: 9.99 },
        { name: "Food 2", price: 14.99 },
      ];
      foodModel.find.mockResolvedValue(mockFoods);

      await listFood(req, res);

      expect(foodModel.find).toHaveBeenCalledWith({});
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockFoods });
    });

    it("should handle errors when listing food", async () => {
      foodModel.find.mockRejectedValue(new Error("Database error"));

      await listFood(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "error",
      });
    });
  });

  describe("removeFood", () => {
    it("should remove a food item successfully", async () => {
      const mockFood = { image: "test-image.jpg" };
      foodModel.findById.mockResolvedValue(mockFood);
      foodModel.findByIdAndDelete.mockResolvedValue(true);
      fs.unlink.mockImplementation((path, callback) => callback());

      req.body = { id: "testId" };

      await removeFood(req, res);

      expect(foodModel.findById).toHaveBeenCalledWith("testId");
      expect(fs.unlink).toHaveBeenCalledWith(
        "uploads/test-image.jpg",
        expect.any(Function)
      );
      expect(foodModel.findByIdAndDelete).toHaveBeenCalledWith("testId");
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Food Succesfully Removed",
      });
    });

    it("should handle errors when removing food", async () => {
      foodModel.findById.mockRejectedValue(new Error("Database error"));

      req.body = { id: "testId" };

      await removeFood(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Error",
      });
    });
  });
});
