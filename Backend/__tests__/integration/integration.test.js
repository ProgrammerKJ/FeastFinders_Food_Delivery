import request from "supertest";
import app from "../../server.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import foodModel from "../../models/foodModel.js";
import userModel from "../../models/userModel.js";
import orderModel from "../../models/orderModel.js";

let token;
let testUser;

beforeAll(async () => {
  const hashedPassword = await bcrypt.hash("password123", 10);
  testUser = new userModel({
    name: "Test User",
    email: "test@example.com",
    password: hashedPassword,
  });
  await testUser.save();
  token = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Food API", () => {
  beforeEach(async () => {
    await foodModel.deleteMany({});
  });

  it("GET /api/food/list should return all food items", async () => {
    const testFood = new foodModel({
      name: "Test Food",
      description: "Test Description",
      price: 9.99,
      image: "test.jpg",
      category: "Test Category",
    });
    await testFood.save();

    const response = await request(app).get("/api/food/list");
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].name).toBe("Test Food");
  });

  it("POST /api/food/add should add a new food item", async () => {
    const response = await request(app)
      .post("/api/food/add")
      .field("name", "New Food")
      .field("description", "New Description")
      .field("price", 14.99)
      .field("category", "New Category")
      .attach("image", Buffer.from("fake image data"), "test.jpg");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Food Successfuly Added");
  });

  it("POST /api/food/remove should remove a food item", async () => {
    const testFood = new foodModel({
      name: "Test Food",
      description: "Test Description",
      price: 9.99,
      image: "test.jpg",
      category: "Test Category",
    });
    await testFood.save();

    const response = await request(app)
      .post("/api/food/remove")
      .send({ id: testFood._id });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Food Succesfully Removed");
  });
});

describe("User Authentication", () => {
  beforeEach(async () => {
    await userModel.deleteMany({});
  });

  it("POST /api/user/register should register a new user", async () => {
    const response = await request(app).post("/api/user/register").send({
      name: "New User",
      email: "newuser@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
  });

  it("POST /api/user/login should login an existing user", async () => {
    const hashedPassword = await bcrypt.hash("password123", 10);
    const user = new userModel({
      name: "Existing User",
      email: "existing@example.com",
      password: hashedPassword,
    });
    await user.save();

    const response = await request(app).post("/api/user/login").send({
      email: "existing@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
  });
});

describe("Cart Operations", () => {
  beforeEach(async () => {
    await userModel.findByIdAndUpdate(
      testUser._id,
      { cartData: {} },
      { upsert: true, new: true }
    );
  });

  it("POST /api/cart/add should add an item to the cart", async () => {
    const response = await request(app)
      .post("/api/cart/add")
      .set("token", token)
      .send({ itemId: "testItemId" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Added To Cart");

    const updatedUser = await userModel.findById(testUser._id);
    expect(updatedUser.cartData).toHaveProperty("testItemId");
  });

  it("POST /api/cart/remove should remove an item from the cart", async () => {
    await userModel.findByIdAndUpdate(
      testUser._id,
      { cartData: { testItemId: 1 } },
      { new: true }
    );

    const response = await request(app)
      .post("/api/cart/remove")
      .set("token", token)
      .send({ itemId: "testItemId" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Removed From Cart");

    const updatedUser = await userModel.findById(testUser._id);
    expect(updatedUser.cartData.testItemId).toBe(0);
  });

  it("POST /api/cart/get should get the cart contents", async () => {
    await userModel.findByIdAndUpdate(
      testUser._id,
      { cartData: { testItemId: 2 } },
      { new: true }
    );

    const response = await request(app)
      .post("/api/cart/get")
      .set("token", token);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.cartData).toEqual({ testItemId: 2 });
  });
});

describe("Order Management", () => {
  beforeEach(async () => {
    await orderModel.deleteMany({});
  });

  it("POST /api/order/place should place a new order", async () => {
    const response = await request(app)
      .post("/api/order/place")
      .set("token", token)
      .send({
        items: [
          { id: "testItemId", quantity: 2, name: "Test Item", price: 10 },
        ],
        amount: 20,
        address: { street: "Test St", city: "Test City" },
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.session_url).toBeDefined();
  });

  it("POST /api/order/userorders should get user orders", async () => {
    await new orderModel({
      userId: testUser._id,
      items: [{ id: "testItemId", quantity: 1 }],
      amount: 10,
      address: { street: "Test St", city: "Test City" },
    }).save();

    const response = await request(app)
      .post("/api/order/userorders")
      .set("token", token);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBe(1);
  });

  it("GET /api/order/list should get all orders (admin)", async () => {
    await new orderModel({
      userId: testUser._id,
      items: [{ id: "testItemId", quantity: 1 }],
      amount: 10,
      address: { street: "Test St", city: "Test City" },
    }).save();

    const response = await request(app).get("/api/order/list");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBe(1);
  });
});
