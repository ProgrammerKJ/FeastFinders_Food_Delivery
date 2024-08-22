import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import FoodItem from "./FoodItem";
import { StoreContext } from "../../context/StoreContext";

// Mock assets
vi.mock("../../assets/assets", () => ({
  assets: {
    add_icon_white: "add_white.png",
    remove_icon_red: "remove_red.png",
    add_icon_green: "add_green.png",
    rating_starts: "rating_stars.png",
  },
}));

describe("FoodItem Component", () => {
  const mockAddToCart = vi.fn();
  const mockRemoveFromCart = vi.fn();
  const mockUrl = "http://test.com";

  const defaultProps = {
    id: "1",
    name: "Test Food",
    price: 9.99,
    description: "Delicious test food",
    image: "test_food.jpg",
  };

  const renderFoodItem = (props = {}, contextValue = {}) => {
    return render(
      <StoreContext.Provider
        value={{
          cartItems: {},
          addToCart: mockAddToCart,
          removeFromCart: mockRemoveFromCart,
          url: mockUrl,
          ...contextValue,
        }}
      >
        <FoodItem {...defaultProps} {...props} />
      </StoreContext.Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders food item details correctly", () => {
    renderFoodItem();
    expect(screen.getByText("Test Food")).toBeInTheDocument();
    expect(screen.getByText("Delicious test food")).toBeInTheDocument();
    expect(screen.getByText("$9.99")).toBeInTheDocument();
    expect(screen.getByAltText("")).toHaveAttribute(
      "src",
      "http://test.com/images/test_food.jpg"
    );
  });

  it("shows add to cart button when item is not in cart", () => {
    renderFoodItem();
    const addButton = screen.getByAltText("Add Button");
    expect(addButton).toHaveAttribute("src", "add_white.png");
    fireEvent.click(addButton);
    expect(mockAddToCart).toHaveBeenCalledWith("1");
  });

  it("shows counter when item is in cart", () => {
    renderFoodItem({}, { cartItems: { 1: 2 } });
    expect(screen.getByTestId("cart-item-quantity-1")).toHaveTextContent("2");
    expect(screen.getByTestId("decrease-button-1")).toHaveAttribute(
      "src",
      "remove_red.png"
    );
    expect(screen.getByTestId("increase-button-1")).toHaveAttribute(
      "src",
      "add_green.png"
    );
  });

  it("calls removeFromCart when decrease button is clicked", () => {
    renderFoodItem({}, { cartItems: { 1: 2 } });
    const decreaseButton = screen.getByTestId("decrease-button-1");
    fireEvent.click(decreaseButton);
    expect(mockRemoveFromCart).toHaveBeenCalledWith("1");
  });

  it("calls addToCart when increase button is clicked", () => {
    renderFoodItem({}, { cartItems: { 1: 2 } });
    const increaseButton = screen.getByTestId("increase-button-1");
    fireEvent.click(increaseButton);
    expect(mockAddToCart).toHaveBeenCalledWith("1");
  });

  it("displays rating stars", () => {
    renderFoodItem();
    const ratingStars = screen.getByAltText("Rating");
    expect(ratingStars).toHaveAttribute("src", "rating_stars.png");
  });
});
