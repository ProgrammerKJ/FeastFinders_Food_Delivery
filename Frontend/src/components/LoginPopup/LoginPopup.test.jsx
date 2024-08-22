import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import LoginPopup from "./LoginPopup";
import { StoreContext } from "../../context/StoreContext";

// Mock axios
vi.mock("axios");

// Mock assets
vi.mock("../../assets/assets", () => ({
  assets: {
    cross_icon: "cross.png",
  },
}));

describe("LoginPopup Component", () => {
  const mockSetShowLogin = vi.fn();
  const mockSetToken = vi.fn();
  const mockUrl = "http://test.com";

  const renderLoginPopup = (contextValue = {}) => {
    return render(
      <StoreContext.Provider
        value={{ url: mockUrl, setToken: mockSetToken, ...contextValue }}
      >
        <LoginPopup setShowLogin={mockSetShowLogin} />
      </StoreContext.Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders sign up form by default", () => {
    renderLoginPopup();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your Name")).toBeInTheDocument();
  });

  it('switches to login form when "Login here" is clicked', () => {
    renderLoginPopup();
    fireEvent.click(screen.getByText(/login here/i));
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Your Name")).not.toBeInTheDocument();
  });

  it("closes popup when cross icon is clicked", () => {
    renderLoginPopup();
    fireEvent.click(screen.getByAltText(""));
    expect(mockSetShowLogin).toHaveBeenCalledWith(false);
  });

  it("handles input changes", () => {
    renderLoginPopup();
    const nameInput = screen.getByPlaceholderText("Your Name");
    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    expect(nameInput.value).toBe("John Doe");
  });

  it("submits sign up form", async () => {
    axios.post.mockResolvedValue({
      data: { success: true, token: "fake-token" },
    });
    renderLoginPopup();

    fireEvent.change(screen.getByPlaceholderText("Your Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Your Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("checkbox"));

    fireEvent.click(screen.getByText("Create Account"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://test.com/api/user/register",
        { name: "John Doe", email: "john@example.com", password: "password123" }
      );
      expect(mockSetToken).toHaveBeenCalledWith("fake-token");
      expect(mockSetShowLogin).toHaveBeenCalledWith(false);
    });
  });

  it("submits login form", async () => {
    axios.post.mockResolvedValue({
      data: { success: true, token: "fake-token" },
    });
    renderLoginPopup();

    fireEvent.click(screen.getByText(/login here/i));
    fireEvent.change(screen.getByPlaceholderText("Your Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("checkbox"));

    fireEvent.click(screen.getByTestId("login-button"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://test.com/api/user/login",
        { email: "john@example.com", password: "password123" }
      );
      expect(mockSetToken).toHaveBeenCalledWith("fake-token");
      expect(mockSetShowLogin).toHaveBeenCalledWith(false);
    });
  });

  it("shows alert on login failure", async () => {
    axios.post.mockResolvedValue({
      data: { success: false, message: "Invalid credentials" },
    });
    const mockAlert = vi.spyOn(window, "alert").mockImplementation(() => {});

    renderLoginPopup();

    fireEvent.click(screen.getByText("Login here"));
    fireEvent.change(screen.getByPlaceholderText("Your Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByRole("checkbox"));

    fireEvent.click(screen.getByTestId("login-button"));

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith("Invalid credentials");
    });

    mockAlert.mockRestore();
  });
});
