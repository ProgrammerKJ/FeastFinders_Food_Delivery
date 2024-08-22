import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import axios from "axios";
import { toast } from "react-toastify";
import Orders from "./Orders";

vi.mock("axios");
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("../../../../Frontend/src/assets/assets", () => ({
  assets: {
    parcel_icon: "mocked-parcel-icon.png",
  },
}));

describe("Orders Component", () => {
  const mockUrl = "http://test-url.com";
  const mockOrders = [
    {
      _id: "1",
      items: [{ name: "Pizza", quantity: 2 }],
      address: {
        firstName: "John",
        lastName: "Doe",
        street: "123 Main St",
        city: "Test City",
        state: "Test State",
        country: "Test Country",
        zipcode: "12345",
        phone: "1234567890",
      },
      amount: 25,
      status: "Food Processing",
    },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: { success: true, data: mockOrders } });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("renders Orders component", async () => {
    render(<Orders url={mockUrl} />);

    expect(screen.getByText("Order Page")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Pizza x 2")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("123 Main St,")).toBeInTheDocument();
      expect(
        screen.getByText("Test City, Test State, Test Country, 12345")
      ).toBeInTheDocument();
      expect(screen.getByText("1234567890")).toBeInTheDocument();
      expect(screen.getByText("Items: 1")).toBeInTheDocument();
      expect(screen.getByText("$25")).toBeInTheDocument();
    });
  });

  test("fetches orders on component mount", async () => {
    render(<Orders url={mockUrl} />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(`${mockUrl}/api/order/list`);
    });
  });

  test("updates order status", async () => {
    axios.post.mockResolvedValue({ data: { success: true } });
    render(<Orders url={mockUrl} />);

    await waitFor(() => {
      const statusSelect = screen.getByRole("combobox");
      fireEvent.change(statusSelect, { target: { value: "Out For Delivery" } });
    });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(`${mockUrl}/api/order/status`, {
        orderId: "1",
        status: "Out For Delivery",
      });
    });

    // Check if fetchAllOrders is called after status update
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(2);
    });
  });

  test("handles error when fetching orders", async () => {
    axios.get.mockRejectedValue({ response: { data: { success: false } } });
    render(<Orders url={mockUrl} />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Error");
    });
  });

  test("handles error when updating order status", async () => {
    axios.get.mockResolvedValue({ data: { success: true, data: mockOrders } });
    axios.post.mockRejectedValue({ response: { data: { success: false } } });
    render(<Orders url={mockUrl} />);

    await waitFor(() => {
      const statusSelect = screen.getByRole("combobox");
      fireEvent.change(statusSelect, { target: { value: "Out For Delivery" } });
    });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
    });
  });
});
