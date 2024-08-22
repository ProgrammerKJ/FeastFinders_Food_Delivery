import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import Navbar from "./Navbar";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the assets import
vi.mock("../../assets/assets", () => ({
  assets: {
    logo: "logo.png",
    search_icon: "search.png",
    basket_icon: "basket.png",
    profile_icon: "profile.png",
    bag_icon: "bag.png",
    logout_icon: "logout.png",
  },
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (ui, { route = "/" } = {}) => {
  window.history.pushState({}, "Test page", route);
  return render(ui, { wrapper: BrowserRouter });
};

describe("Navbar Component", () => {
  const mockSetShowLogin = vi.fn();
  const mockGetTotalCartAmount = vi.fn(() => 0);
  const mockSetToken = vi.fn();

  const defaultProps = {
    setShowLogin: mockSetShowLogin,
  };

  const defaultContextValue = {
    getTotalCartAmount: mockGetTotalCartAmount,
    token: "",
    setToken: mockSetToken,
  };

  const renderNavbar = (props = {}, contextValue = {}) => {
    return renderWithRouter(
      <StoreContext.Provider
        value={{ ...defaultContextValue, ...contextValue }}
      >
        <Navbar {...defaultProps} {...props} />
      </StoreContext.Provider>
    );
  };

  it("renders the logo", () => {
    renderNavbar();
    const logo = screen.getByAltText("Logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "logo.png");
  });

  it("renders menu items", () => {
    renderNavbar();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Menu")).toBeInTheDocument();
    expect(screen.getByText("Mobile App")).toBeInTheDocument();
    expect(screen.getByText("Contact Us")).toBeInTheDocument();
  });

  it("shows Sign In button when not logged in", () => {
    renderNavbar();
    const signInButton = screen.getByText("Sign In");
    expect(signInButton).toBeInTheDocument();
    fireEvent.click(signInButton);
    expect(mockSetShowLogin).toHaveBeenCalledWith(true);
  });

  it("shows profile icon when logged in", () => {
    renderNavbar({}, { token: "fake-token" });
    expect(screen.getByAltText("User profile")).toHaveAttribute(
      "src",
      "profile.png"
    );
  });

  it("navigates to orders page when clicking Orders", () => {
    renderNavbar({}, { token: "fake-token" });
    fireEvent.click(screen.getByText("Orders"));
    expect(mockNavigate).toHaveBeenCalledWith("/myorders");
  });

  it("logs out when clicking Logout", () => {
    renderNavbar({}, { token: "fake-token" });
    fireEvent.click(screen.getByText("Logout"));
    expect(mockSetToken).toHaveBeenCalledWith("");
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("displays dot when cart is not empty", () => {
    renderNavbar({}, { getTotalCartAmount: vi.fn(() => 5) });
    expect(screen.getByTestId("cart-dot")).toHaveClass("dot");
  });

  it("does not display dot when cart is empty", () => {
    renderNavbar();
    expect(screen.queryByTestId("cart-dot")).not.toHaveClass("dot");
  });
});
