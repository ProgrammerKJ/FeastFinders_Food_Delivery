import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import axios from "axios";
import StoreContextProvider, { StoreContext } from "./StoreContext";

vi.mock("axios");

describe("StoreContextProvider", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  it("provides the correct context value", async () => {
    const mockFoodList = [{ _id: "1", name: "Pizza", price: 10 }];
    vi.mocked(axios.get).mockResolvedValueOnce({
      data: { data: mockFoodList },
    });

    let contextValue;
    await act(async () => {
      render(
        <StoreContextProvider>
          <StoreContext.Consumer>
            {(value) => {
              contextValue = value;
              return null;
            }}
          </StoreContext.Consumer>
        </StoreContextProvider>
      );
    });

    await vi.waitFor(() => {
      expect(contextValue.food_list).toEqual(mockFoodList);
    });
    expect(contextValue).toHaveProperty("cartItems", {});
    expect(contextValue).toHaveProperty("addToCart");
    expect(contextValue).toHaveProperty("removeFromCart");
    expect(contextValue).toHaveProperty("getTotalCartAmount");
    expect(contextValue).toHaveProperty("url");
    expect(contextValue).toHaveProperty("token", "");
    expect(contextValue).toHaveProperty("setToken");
  });

  it("fetches food list on mount", async () => {
    const mockFoodList = [{ _id: "1", name: "Pizza", price: 10 }];
    vi.mocked(axios.get).mockResolvedValueOnce({
      data: { data: mockFoodList },
    });

    await act(async () => {
      render(<StoreContextProvider />);
    });

    expect(axios.get).toHaveBeenCalledWith(
      "https://food-delivery-be-as0u.onrender.com/api/food/list"
    );
  });

  it("loads cart data if token exists in localStorage", async () => {
    const mockToken = "mock-token";
    const mockCartData = { 1: 2 };
    localStorage.setItem("token", mockToken);
    vi.mocked(axios.get).mockResolvedValueOnce({ data: { data: [] } });
    vi.mocked(axios.post).mockResolvedValueOnce({
      data: { cartData: mockCartData },
    });

    await act(async () => {
      render(<StoreContextProvider />);
    });

    await vi.waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "https://food-delivery-be-as0u.onrender.com/api/cart/get",
        {},
        { headers: { token: mockToken } }
      );
    });
  });

  it("adds item to cart", async () => {
    const mockFoodList = [{ _id: "1", name: "Pizza", price: 10 }];
    vi.mocked(axios.get).mockResolvedValueOnce({
      data: { data: mockFoodList },
    });

    let addToCart;
    let cartItems;

    await act(async () => {
      render(
        <StoreContextProvider>
          <StoreContext.Consumer>
            {({ addToCart: add, cartItems: items }) => {
              addToCart = add;
              cartItems = items;
              return <button onClick={() => add("1")}>Add to Cart</button>;
            }}
          </StoreContext.Consumer>
        </StoreContextProvider>
      );
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Add to Cart"));
    });

    expect(cartItems).toEqual({ 1: 1 });
  });

  it("removes item from cart", async () => {
    const mockFoodList = [{ _id: "1", name: "Pizza", price: 10 }];
    vi.mocked(axios.get).mockResolvedValueOnce({
      data: { data: mockFoodList },
    });

    let addToCart;
    let removeFromCart;
    let cartItems;

    await act(async () => {
      render(
        <StoreContextProvider>
          <StoreContext.Consumer>
            {({ addToCart: add, removeFromCart: remove, cartItems: items }) => {
              addToCart = add;
              removeFromCart = remove;
              cartItems = items;
              return (
                <>
                  <button onClick={() => add("1")}>Add to Cart</button>
                  <button onClick={() => remove("1")}>Remove from Cart</button>
                </>
              );
            }}
          </StoreContext.Consumer>
        </StoreContextProvider>
      );
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Add to Cart"));
      fireEvent.click(screen.getByText("Add to Cart"));
      fireEvent.click(screen.getByText("Remove from Cart"));
    });

    expect(cartItems).toEqual({ 1: 0 });
  });

  it("calculates total cart amount correctly", async () => {
    const mockFoodList = [
      { _id: "1", name: "Pizza", price: 10 },
      { _id: "2", name: "Burger", price: 5 },
    ];
    vi.mocked(axios.get).mockResolvedValueOnce({
      data: { data: mockFoodList },
    });

    let addToCart;
    let getTotalCartAmount;
    let currentCartItems;

    await act(async () => {
      render(
        <StoreContextProvider>
          <StoreContext.Consumer>
            {({ addToCart: add, getTotalCartAmount: getTotal, cartItems }) => {
              addToCart = add;
              getTotalCartAmount = getTotal;
              currentCartItems = cartItems;
              return (
                <>
                  <button onClick={() => add("1")}>Add Pizza</button>
                  <button onClick={() => add("2")}>Add Burger</button>
                </>
              );
            }}
          </StoreContext.Consumer>
        </StoreContextProvider>
      );
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Add Pizza"));
      fireEvent.click(screen.getByText("Add Pizza"));
      fireEvent.click(screen.getByText("Add Burger"));
    });

    expect(getTotalCartAmount()).toBe(15);
  });
});
