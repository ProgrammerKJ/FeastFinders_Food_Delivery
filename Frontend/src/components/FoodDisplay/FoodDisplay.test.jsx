import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import FoodDisplay from "./FoodDisplay";
import { StoreContext } from "../../context/StoreContext";

// Mock the FoodItem component
vi.mock("../FoodItem/FoodItem", () => ({
  default: ({ name }) => <div data-testid="food-item">{name}</div>,
}));

describe("FoodDisplay Component", () => {
  const mockFoodList = [
    {
      _id: "1",
      name: "Pizza",
      description: "Delicious pizza",
      price: 10,
      image: "pizza.jpg",
      category: "Italian",
    },
    {
      _id: "2",
      name: "Burger",
      description: "Juicy burger",
      price: 8,
      image: "burger.jpg",
      category: "American",
    },
    {
      _id: "3",
      name: "Sushi",
      description: "Fresh sushi",
      price: 15,
      image: "sushi.jpg",
      category: "Japanese",
    },
  ];

  const renderFoodDisplay = (category = "All") => {
    return render(
      <StoreContext.Provider value={{ food_list: mockFoodList }}>
        <FoodDisplay category={category} />
      </StoreContext.Provider>
    );
  };

  it("renders the component with the correct title", () => {
    renderFoodDisplay();
    expect(screen.getByText("Top Dishes Near You")).toBeInTheDocument();
  });

  it("displays all food items when category is 'All'", () => {
    renderFoodDisplay();
    const foodItems = screen.getAllByTestId("food-item");
    expect(foodItems).toHaveLength(3);
    expect(screen.getByText("Pizza")).toBeInTheDocument();
    expect(screen.getByText("Burger")).toBeInTheDocument();
    expect(screen.getByText("Sushi")).toBeInTheDocument();
  });

  it("filters food items by category", () => {
    renderFoodDisplay("Italian");
    const foodItems = screen.getAllByTestId("food-item");
    expect(foodItems).toHaveLength(1);
    expect(screen.getByText("Pizza")).toBeInTheDocument();
    expect(screen.queryByText("Burger")).not.toBeInTheDocument();
    expect(screen.queryByText("Sushi")).not.toBeInTheDocument();
  });

  it("renders no food items when category doesn't match any items", () => {
    renderFoodDisplay("Mexican");
    const foodItems = screen.queryAllByTestId("food-item");
    expect(foodItems).toHaveLength(0);
  });

  it("passes correct props to FoodItem components", () => {
    renderFoodDisplay();
    const foodItems = screen.getAllByTestId("food-item");
    expect(foodItems[0]).toHaveTextContent("Pizza");
    expect(foodItems[1]).toHaveTextContent("Burger");
    expect(foodItems[2]).toHaveTextContent("Sushi");
  });
});
