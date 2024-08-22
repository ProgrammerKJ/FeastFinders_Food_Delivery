import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Verify from "./Verify";

// Mock dependencies
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
  useSearchParams: vi.fn(),
}));
vi.mock("axios");

describe("Verify Component", () => {
  const mockNavigate = vi.fn();
  const mockSearchParams = new URLSearchParams("?success=true&orderId=123");
  const mockSetSearchParams = vi.fn();
  const mockUrl = "http://test-api.com";

  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useSearchParams.mockReturnValue([mockSearchParams, mockSetSearchParams]);
  });

  it("renders spinner while verifying", () => {
    render(
      <StoreContext.Provider value={{ url: mockUrl }}>
        <Verify />
      </StoreContext.Provider>
    );

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("navigates to /myorders on successful verification", async () => {
    axios.post.mockResolvedValue({ data: { success: true } });

    render(
      <StoreContext.Provider value={{ url: mockUrl }}>
        <Verify />
      </StoreContext.Provider>
    );

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://test-api.com/api/order/verify",
        { success: "true", orderId: "123" }
      );
      expect(mockNavigate).toHaveBeenCalledWith("/myorders");
    });
  });

  it("navigates to / on unsuccessful verification", async () => {
    axios.post.mockResolvedValue({ data: { success: false } });

    render(
      <StoreContext.Provider value={{ url: mockUrl }}>
        <Verify />
      </StoreContext.Provider>
    );

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://test-api.com/api/order/verify",
        { success: "true", orderId: "123" }
      );
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("handles API errors", async () => {
    axios.post.mockRejectedValue(new Error("API Error"));

    render(
      <StoreContext.Provider value={{ url: mockUrl }}>
        <Verify />
      </StoreContext.Provider>
    );

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
});
