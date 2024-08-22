import mongoose from "mongoose";
import foodModel from "../../models/foodModel";

describe("Food Model Test", () => {
  it("create & save food item successfully", async () => {
    const validFood = new foodModel({
      name: "Cheeseburger",
      description: "Juicy beef patty with melted cheese",
      price: 9.99,
      image: "https://example.com/cheeseburger.jpg",
      category: "Burgers",
    });
    const savedFood = await validFood.save();

    expect(savedFood._id).toBeDefined();
    expect(savedFood.name).toBe(validFood.name);
    expect(savedFood.description).toBe(validFood.description);
    expect(savedFood.price).toBe(validFood.price);
    expect(savedFood.image).toBe(validFood.image);
    expect(savedFood.category).toBe(validFood.category);
  });

  it("create food item without required field should fail", async () => {
    const foodWithoutRequiredField = new foodModel({ name: "Invalid Food" });
    let err;
    try {
      await foodWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);

    expect(err.errors.description).toBeDefined();
    expect(err.errors.price).toBeDefined();
    expect(err.errors.image).toBeDefined();
    expect(err.errors.category).toBeDefined();
  });

  it("create food item with invalid price should fail", async () => {
    const foodWithInvalidPrice = new foodModel({
      name: "Invalid Price Food",
      description: "This food has an invalid price",
      price: "not a number",
      image: "https://example.com/invalid.jpg",
      category: "Invalid",
    });
    let err;
    try {
      await foodWithInvalidPrice.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.price).toBeDefined();
  });

  it("should update food item successfully", async () => {
    const food = new foodModel({
      name: "Pizza",
      description: "Delicious pizza with various toppings",
      price: 12.99,
      image: "https://example.com/pizza.jpg",
      category: "Italian",
    });
    const savedFood = await food.save();

    savedFood.price = 14.99;
    const updatedFood = await savedFood.save();

    expect(updatedFood.price).toBe(14.99);
  });
});
