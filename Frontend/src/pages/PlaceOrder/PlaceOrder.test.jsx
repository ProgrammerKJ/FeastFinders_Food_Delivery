import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { StoreContext } from "../../context/StoreContext";
import PlaceOrder from "./PlaceOrder";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Mock dependencies
vi.mock("axios");
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

describe("PlaceOrder Component", () => {
  const mockContextValue = {
    getTotalCartAmount: vi.fn(() => 50),
    token: "test-token",
    food_list: [
      { _id: "1", name: "Pizza", price: 20 },
      { _id: "2", name: "Burger", price: 15 },
    ],
    cartItems: { 1: 2, 2: 1 },
    url: "http://test-api.com",
  };

  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  it("renders the form correctly", () => {
    render(
      <StoreContext.Provider value={mockContextValue}>
        <PlaceOrder />
      </StoreContext.Provider>
    );

    expect(screen.getByPlaceholderText("First Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Last Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email Address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Street")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("City")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("State")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Zip Code")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Country")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Phone")).toBeInTheDocument();
    expect(screen.getByText("PROCEED TO PAYMENT")).toBeInTheDocument();
  });

  it("updates form data on input change", () => {
    render(
      <StoreContext.Provider value={mockContextValue}>
        <PlaceOrder />
      </StoreContext.Provider>
    );

    const firstNameInput = screen.getByPlaceholderText("First Name");
    fireEvent.change(firstNameInput, { target: { value: "John" } });
    expect(firstNameInput.value).toBe("John");
  });

  it("displays correct cart total", () => {
    render(
      <StoreContext.Provider value={mockContextValue}>
        <PlaceOrder />
      </StoreContext.Provider>
    );

    expect(screen.getByText("$50")).toBeInTheDocument(); // Subtotal
    expect(screen.getByText("$2")).toBeInTheDocument(); // Delivery Fee
    expect(screen.getByText("$52")).toBeInTheDocument(); // Total
  });

  it("navigates to cart if token is not present", () => {
    render(
      <StoreContext.Provider value={{ ...mockContextValue, token: null }}>
        <PlaceOrder />
      </StoreContext.Provider>
    );

    expect(mockNavigate).toHaveBeenCalledWith("/cart");
  });

  it("navigates to cart if cart is empty", () => {
    const emptyCartContext = {
      ...mockContextValue,
      getTotalCartAmount: vi.fn(() => 0),
    };

    render(
      <StoreContext.Provider value={emptyCartContext}>
        <PlaceOrder />
      </StoreContext.Provider>
    );

    expect(mockNavigate).toHaveBeenCalledWith("/cart");
  });

  it("submits the form and places an order", async () => {
    axios.post.mockResolvedValue({
      data: { success: true, session_url: "http://test-payment.com" },
    });

    const { window } = global;
    delete global.window.location;
    global.window.location = { replace: vi.fn() };

    render(
      <StoreContext.Provider value={mockContextValue}>
        <PlaceOrder />
      </StoreContext.Provider>
    );

    fireEvent.change(screen.getByPlaceholderText("First Name"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Last Name"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email Address"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Street"), {
      target: { value: "123 Main St" },
    });
    fireEvent.change(screen.getByPlaceholderText("City"), {
      target: { value: "Anytown" },
    });
    fireEvent.change(screen.getByPlaceholderText("State"), {
      target: { value: "CA" },
    });
    fireEvent.change(screen.getByPlaceholderText("Zip Code"), {
      target: { value: "12345" },
    });
    fireEvent.change(screen.getByPlaceholderText("Country"), {
      target: { value: "USA" },
    });
    fireEvent.change(screen.getByPlaceholderText("Phone"), {
      target: { value: "123-456-7890" },
    });

    fireEvent.click(screen.getByText("PROCEED TO PAYMENT"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://test-api.com/api/order/place",
        expect.any(Object),
        { headers: { token: "test-token" } }
      );
      expect(window.window.location.replace).toHaveBeenCalledWith(
        "http://test-payment.com"
      );
    });

    window.window = window;
  });
});
