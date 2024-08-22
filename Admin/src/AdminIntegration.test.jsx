import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import axios from "axios";
import { toast } from "react-toastify";
import App from "./App";

vi.mock("axios");
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
  ToastContainer: () => null,
}));

vi.mock("./assets/assets", () => ({
  assets: {
    logo: "mocked-logo.png",
    profile_image: "mocked-profile.png",
    add_icon: "mocked-add-icon.png",
    order_icon: "mocked-order-icon.png",
    parcel_icon: "mocked-parcel-icon.png",
    upload_area: "mocked-upload-area.png",
  },
}));

global.URL.createObjectURL = vi.fn(() => "mocked-object-url");

describe("Admin Panel Integration", () => {
  const mockUrl = "https://food-delivery-be-as0u.onrender.com";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("full user flow through admin panel", async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes("/api/food/list")) {
        return Promise.resolve({
          data: {
            success: true,
            data: [
              {
                _id: "1",
                name: "Pizza",
                category: "Italian",
                price: 10,
                image: "pizza.jpg",
              },
            ],
          },
        });
      } else if (url.includes("/api/order/list")) {
        return Promise.resolve({
          data: {
            success: true,
            data: [
              {
                _id: "1",
                items: [{ name: "Pizza", quantity: 2 }],
                address: { firstName: "John", lastName: "Doe" },
                amount: 20,
                status: "Food Processing",
              },
            ],
          },
        });
      }
    });

    axios.post.mockResolvedValue({
      data: { success: true, message: "Operation successful" },
    });

    render(
      <MemoryRouter initialEntries={["/add"]}>
        <App url={mockUrl} />
      </MemoryRouter>
    );

    expect(screen.getByAltText("Logo")).toBeInTheDocument();
    expect(screen.getByAltText("Profile Pic")).toBeInTheDocument();
    expect(screen.getByText("Upload Image")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Type here"), {
      target: { value: "Burger" },
    });
    fireEvent.change(screen.getByPlaceholderText("Write description here..."), {
      target: { value: "Delicious burger" },
    });
    fireEvent.change(screen.getByPlaceholderText("$20"), {
      target: { value: "15" },
    });

    const file = new File(["dummy content"], "test.png", { type: "image/png" });
    const fileInput = screen.getByTestId("file-input");
    Object.defineProperty(fileInput, "files", {
      value: [file],
    });
    fireEvent.change(fileInput);

    fireEvent.submit(screen.getByRole("form"));

    await waitFor(
      () => {
        expect(axios.post).toHaveBeenCalledWith(
          `${mockUrl}/api/food/add`,
          expect.any(FormData)
        );
      },
      { timeout: 3000 }
    );

    const lastCall = axios.post.mock.calls[axios.post.mock.calls.length - 1];
    const formData = lastCall[1];
    expect(formData.get("name")).toBe("Burger");
    expect(formData.get("description")).toBe("Delicious burger");
    expect(formData.get("price")).toBe("15");
    expect(formData.get("category")).toBe("Salad");
    expect(formData.get("image")).toBeInstanceOf(File);

    await waitFor(
      () => {
        expect(toast.success).toHaveBeenCalledWith("Operation successful");
      },
      { timeout: 3000 }
    );

    fireEvent.click(screen.getByText("List Items"));

    await waitFor(() => {
      expect(screen.getByText("Pizza")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("X"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(`${mockUrl}/api/food/remove`, {
        id: "1",
      });
      expect(toast.success).toHaveBeenCalledWith("Operation successful");
    });

    fireEvent.click(screen.getByText("Orders"));

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    const statusSelect = screen.getByRole("combobox");
    fireEvent.change(statusSelect, { target: { value: "Out For Delivery" } });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(`${mockUrl}/api/order/status`, {
        orderId: "1",
        status: "Out For Delivery",
      });
    });
  });
});
