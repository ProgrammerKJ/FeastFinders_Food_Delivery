import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { StoreContext } from "../../context/StoreContext";
import Cart from "./Cart";

// Mock the entire react-router-dom module
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    MemoryRouter: ({ children }) => <div>{children}</div>, // Mock MemoryRouter
  };
});

const mockNavigate = vi.fn();

describe("Cart Component", () => {
  const mockContext = {
    cartItems: { 1: 2, 2: 1 },
    food_list: [
      { _id: "1", name: "Pizza", price: 10, image: "pizza.jpg" },
      { _id: "2", name: "Burger", price: 5, image: "burger.jpg" },
      { _id: "3", name: "Salad", price: 7, image: "salad.jpg" },
    ],
    removeFromCart: vi.fn(),
    getTotalCartAmount: vi.fn(() => 25),
    url: "http://example.com",
  };

  const renderComponent = () => {
    return render(
      <StoreContext.Provider value={mockContext}>
        <Cart />
      </StoreContext.Provider>
    );
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders cart items correctly", () => {
    renderComponent();

    const pizzaItem = screen.getByText("Pizza").closest("div");
    const burgerItem = screen.getByText("Burger").closest("div");

    expect(pizzaItem).toHaveTextContent("$10");
    expect(burgerItem).toHaveTextContent("$5");

    expect(pizzaItem).toHaveTextContent("2");
    expect(burgerItem).toHaveTextContent("1");
  });

  it("calculates and displays totals correctly", () => {
    renderComponent();

    const subtotalElement = screen.getByText("Subtotal").nextElementSibling;
    console.log("Subtotal content:", subtotalElement.textContent);
    expect(subtotalElement).toBeInTheDocument();

    const deliveryFee = screen.getByText("Delivery Fee").nextElementSibling;
    console.log("Delivery Fee content:", deliveryFee.textContent);
    expect(deliveryFee).toHaveTextContent("$2");

    const totalElement = screen.getByText(
      (content, element) =>
        content.startsWith("Total") && element.tagName.toLowerCase() === "b"
    ).nextElementSibling;
    console.log("Total content:", totalElement.textContent);
    expect(totalElement).toBeInTheDocument();
  });

  it("removes item from cart when clicking remove button", () => {
    renderComponent();

    const removeButtons = screen.getAllByText("x");
    fireEvent.click(removeButtons[0]);

    expect(mockContext.removeFromCart).toHaveBeenCalledWith("1");
  });

  it("navigates to order page when clicking checkout button", () => {
    renderComponent();

    const checkoutButton = screen.getByText("PROCEED TO CHECKOUT");
    fireEvent.click(checkoutButton);

    expect(mockNavigate).toHaveBeenCalledWith("/order");
  });

  it("renders promo code input", () => {
    renderComponent();

    expect(screen.getByPlaceholderText("promo code")).toBeDefined();
    expect(screen.getByText("Submit")).toBeDefined();
  });

  it("displays correct image URLs", () => {
    renderComponent();

    const images = document.querySelectorAll("img");
    expect(images).toHaveLength(2);
    expect(images[0].getAttribute("src")).toBe(
      "http://example.com/images/pizza.jpg"
    );
    expect(images[1].getAttribute("src")).toBe(
      "http://example.com/images/burger.jpg"
    );
  });
});
