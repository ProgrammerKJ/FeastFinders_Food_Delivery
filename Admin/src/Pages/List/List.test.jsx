import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import axios from "axios";
import { toast } from "react-toastify";
import List from "./List";

vi.mock("axios");
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("List Component", () => {
  const mockUrl = "http://test-url.com";
  const mockFoodList = [
    {
      _id: "1",
      name: "Pizza",
      category: "Italian",
      price: 10,
      image: "pizza.jpg",
    },
    {
      _id: "2",
      name: "Burger",
      category: "Fast Food",
      price: 8,
      image: "burger.jpg",
    },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: { success: true, data: mockFoodList },
    });
    render(<List url={mockUrl} />);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("renders List component", async () => {
    expect(screen.getByText("All Foods List")).toBeInTheDocument();
    expect(screen.getByText("Image")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Categroy")).toBeInTheDocument();
    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Pizza")).toBeInTheDocument();
      expect(screen.getByText("Burger")).toBeInTheDocument();
    });
  });

  test("fetches and displays food list", async () => {
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(`${mockUrl}/api/food/list`);
      expect(screen.getByText("Pizza")).toBeInTheDocument();
      expect(screen.getByText("Burger")).toBeInTheDocument();
      expect(screen.getByText("Italian")).toBeInTheDocument();
      expect(screen.getByText("Fast Food")).toBeInTheDocument();
      expect(screen.getByText("$10")).toBeInTheDocument();
      expect(screen.getByText("$8")).toBeInTheDocument();
    });
  });

  test("removes food item", async () => {
    axios.post.mockResolvedValue({
      data: { success: true, message: "Food removed successfully" },
    });

    await waitFor(() => {
      const removeButtons = screen.getAllByText("X");
      fireEvent.click(removeButtons[0]);
    });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(`${mockUrl}/api/food/remove`, {
        id: "1",
      });
      expect(toast.success).toHaveBeenCalledWith("Food removed successfully");
      expect(axios.get).toHaveBeenCalledTimes(2);
    });
  });

  test("handles error when fetching list", async () => {
    axios.get.mockRejectedValueOnce({ response: { data: { success: false } } });
    render(<List url={mockUrl} />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Error");
    });
  });

  test("handles error when removing food", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { success: false } },
    });

    await waitFor(() => {
      const removeButtons = screen.getAllByText("X");
      fireEvent.click(removeButtons[0]);
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Error");
    });
  });
});
