import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MyOrders from "./MyOrders";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

// Mock axios
vi.mock("axios");

// Mock the assets import
vi.mock("../../assets/assets", () => ({
  assets: {
    parcel_icon: "mocked-parcel-icon-path",
  },
}));

describe("MyOrders Component", () => {
  const mockOrders = [
    {
      items: [
        { name: "Pizza", quantity: 2 },
        { name: "Burger", quantity: 1 },
      ],
      amount: 30,
      status: "Delivered",
    },
    {
      items: [{ name: "Salad", quantity: 1 }],
      amount: 10,
      status: "In Transit",
    },
  ];

  const mockContextValue = {
    url: "http://test-api.com",
    token: "test-token",
  };

  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();
  });

  it("renders without crashing", () => {
    render(
      <StoreContext.Provider value={mockContextValue}>
        <MyOrders />
      </StoreContext.Provider>
    );
    expect(screen.getByText("My Orders")).toBeInTheDocument();
  });

  it("fetches and displays orders", async () => {
    axios.post.mockResolvedValue({ data: { data: mockOrders } });

    render(
      <StoreContext.Provider value={mockContextValue}>
        <MyOrders />
      </StoreContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Pizza x 2, Burger x 1")).toBeInTheDocument();
      expect(screen.getByText("Salad x 1")).toBeInTheDocument();
      expect(screen.getByText("$30.00")).toBeInTheDocument();
      expect(screen.getByText("$10.00")).toBeInTheDocument();
      expect(screen.getByText("Delivered")).toBeInTheDocument();
      expect(screen.getByText("In Transit")).toBeInTheDocument();
    });
  });

  it("calls fetchOrders when token is available", async () => {
    axios.post.mockResolvedValue({ data: { data: [] } });

    render(
      <StoreContext.Provider value={mockContextValue}>
        <MyOrders />
      </StoreContext.Provider>
    );

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://test-api.com/api/order/userorders",
        {},
        { headers: { token: "test-token" } }
      );
    });
  });

  it("does not call fetchOrders when token is not available", () => {
    render(
      <StoreContext.Provider value={{ ...mockContextValue, token: null }}>
        <MyOrders />
      </StoreContext.Provider>
    );

    expect(axios.post).not.toHaveBeenCalled();
  });

  it("handles API errors gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    axios.post.mockRejectedValue(new Error("API Error"));

    render(
      <StoreContext.Provider value={mockContextValue}>
        <MyOrders />
      </StoreContext.Provider>
    );

    await waitFor(() => {
      expect(
        screen.getByText("Failed to fetch orders. Please try again later.")
      ).toBeInTheDocument();
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching orders:",
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });

  it("handles invalid response format", async () => {
    axios.post.mockResolvedValue({ data: {} }); // Missing 'data' property in response

    render(
      <StoreContext.Provider value={mockContextValue}>
        <MyOrders />
      </StoreContext.Provider>
    );

    await waitFor(() => {
      expect(
        screen.getByText("Failed to fetch orders. Please try again later.")
      ).toBeInTheDocument();
    });
  });

  it("refetches orders when Track Order button is clicked", async () => {
    axios.post
      .mockResolvedValueOnce({ data: { data: mockOrders } })
      .mockResolvedValueOnce({
        data: {
          data: [
            ...mockOrders,
            {
              items: [{ name: "Pasta", quantity: 1 }],
              amount: 15,
              status: "Preparing",
            },
          ],
        },
      });

    render(
      <StoreContext.Provider value={mockContextValue}>
        <MyOrders />
      </StoreContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Pizza x 2, Burger x 1")).toBeInTheDocument();
    });

    const trackOrderButton = screen.getAllByText("Track Order")[0];
    act(() => {
      trackOrderButton.click();
    });

    await waitFor(() => {
      expect(screen.getByText("Pasta x 1")).toBeInTheDocument();
      expect(screen.getByText("$15.00")).toBeInTheDocument();
      expect(screen.getByText("Preparing")).toBeInTheDocument();
    });
  });
});
