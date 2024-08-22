import mongoose from "mongoose";
import orderModel from "../../models/orderModel";

describe("Order Model Test", () => {
  it("create & save order successfully", async () => {
    const validOrder = new orderModel({
      userId: "60d725bca44bd20015b8f9b8",
      items: [{ itemId: "60d725bca44bd20015b8f9b9", quantity: 2 }],
      amount: 29.99,
      address: { street: "123 Test St", city: "Test City", zipCode: "12345" },
    });
    const savedOrder = await validOrder.save();

    expect(savedOrder._id).toBeDefined();
    expect(savedOrder.userId).toBe(validOrder.userId);
    expect(savedOrder.items).toEqual(validOrder.items);
    expect(savedOrder.amount).toBe(validOrder.amount);
    expect(savedOrder.address).toEqual(validOrder.address);
    expect(savedOrder.status).toBe("Food Processing");
    expect(savedOrder.payment).toBe(false);
    expect(savedOrder.date).toBeDefined();
  });

  it("create order without required fields should fail", async () => {
    const orderWithoutRequiredFields = new orderModel({
      userId: "60d725bca44bd20015b8f9b8",
    });
    let err;
    try {
      await orderWithoutRequiredFields.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);

    expect(err.errors).toBeDefined();

    expect(err.errors).toHaveProperty("amount");
    expect(err.errors).toHaveProperty("address");

    expect(err.errors.amount.message).toBe("Path `amount` is required.");
    expect(err.errors.address.message).toBe("Path `address` is required.");

    expect(err.errors).not.toHaveProperty("items");
  });

  it("create order with only required fields should have default values", async () => {
    const orderWithOnlyRequired = new orderModel({
      userId: "60d725bca44bd20015b8f9b8",
      items: [{ itemId: "60d725bca44bd20015b8f9b9", quantity: 1 }],
      amount: 15.99,
      address: {
        street: "456 Test Ave",
        city: "Another City",
        zipCode: "67890",
      },
    });
    const savedOrder = await orderWithOnlyRequired.save();

    expect(savedOrder.status).toBe("Food Processing");
    expect(savedOrder.payment).toBe(false);
    expect(savedOrder.date).toBeDefined();
  });

  it("create order should set current date", async () => {
    const order = new orderModel({
      userId: "60d725bca44bd20015b8f9b8",
      items: [{ itemId: "60d725bca44bd20015b8f9b9", quantity: 1 }],
      amount: 15.99,
      address: { street: "789 Test Blvd", city: "Test Town", zipCode: "13579" },
    });
    const savedOrder = await order.save();

    const timeDifference = new Date() - savedOrder.date;
    expect(timeDifference).toBeLessThan(10000); // Less than 10 seconds difference
  });

  it("should update order status", async () => {
    const order = new orderModel({
      userId: "60d725bca44bd20015b8f9b8",
      items: [{ itemId: "60d725bca44bd20015b8f9b9", quantity: 1 }],
      amount: 15.99,
      address: { street: "101 Test Road", city: "Testville", zipCode: "24680" },
    });
    const savedOrder = await order.save();

    savedOrder.status = "Delivered";
    const updatedOrder = await savedOrder.save();

    expect(updatedOrder.status).toBe("Delivered");
  });
});
