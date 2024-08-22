import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import axios from "axios";
import { toast } from "react-toastify";
import Add from "./Add";

vi.mock("axios");
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

global.URL.createObjectURL = vi.fn();

describe("Add Component", () => {
  const mockUrl = "http://test-url.com";

  beforeEach(() => {
    render(<Add url={mockUrl} />);
    vi.clearAllMocks();
  });

  test("renders form elements", () => {
    expect(screen.getByText("Upload Image")).toBeInTheDocument();
    expect(screen.getByText("Product Name")).toBeInTheDocument();
    expect(screen.getByText("Product Description")).toBeInTheDocument();
    expect(screen.getByText("Product Category")).toBeInTheDocument();
    expect(screen.getByText("Product Price")).toBeInTheDocument();
    expect(screen.getByText("ADD")).toBeInTheDocument();
  });

  test("allows input in form fields", () => {
    const nameInput = screen.getByPlaceholderText("Type here");
    const descriptionInput = screen.getByPlaceholderText(
      "Write description here..."
    );
    const priceInput = screen.getByPlaceholderText("$20");

    fireEvent.change(nameInput, { target: { value: "Test Product" } });
    fireEvent.change(descriptionInput, {
      target: { value: "Test Description" },
    });
    fireEvent.change(priceInput, { target: { value: "25" } });

    expect(nameInput).toHaveValue("Test Product");
    expect(descriptionInput).toHaveValue("Test Description");
    expect(priceInput).toHaveValue(25);
  });

  test("submits form data correctly", async () => {
    axios.post.mockResolvedValue({
      data: { success: true, message: "Product added successfully" },
    });

    const nameInput = screen.getByPlaceholderText("Type here");
    const descriptionInput = screen.getByPlaceholderText(
      "Write description here..."
    );
    const priceInput = screen.getByPlaceholderText("$20");
    const fileInput = document.querySelector('input[type="file"]');
    const form = screen.getByRole("form");

    fireEvent.change(nameInput, { target: { value: "Test Product" } });
    fireEvent.change(descriptionInput, {
      target: { value: "Test Description" },
    });
    fireEvent.change(priceInput, { target: { value: "25" } });
    fireEvent.change(fileInput, {
      target: {
        files: [new File(["test"], "test.png", { type: "image/png" })],
      },
    });

    await fireEvent.submit(form);

    await waitFor(
      () => {
        expect(axios.post).toHaveBeenCalledWith(
          `${mockUrl}/api/food/add`,
          expect.any(FormData)
        );
      },
      { timeout: 5000 }
    );

    await waitFor(
      () => {
        expect(toast.success).toHaveBeenCalledWith(
          "Product added successfully"
        );
      },
      { timeout: 5000 }
    );
  });
});
