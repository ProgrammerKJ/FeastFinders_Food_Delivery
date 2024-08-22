import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Home from "./Home";

// Mock the child components
vi.mock("../../components/Header/Header", () => ({
  default: () => <div data-testid="mock-header">Header</div>,
}));

vi.mock("../../components/ExploreMenu/ExploreMenu", () => ({
  default: ({ category, setCategory }) => (
    <div data-testid="mock-explore-menu">
      ExploreMenu
      <button onClick={() => setCategory("Pizza")}>Set Pizza</button>
    </div>
  ),
}));

vi.mock("../../components/FoodDisplay/FoodDisplay", () => ({
  default: ({ category }) => (
    <div data-testid="mock-food-display">FoodDisplay: {category}</div>
  ),
}));

vi.mock("../../components/AppDownload/AppDownload", () => ({
  default: () => <div data-testid="mock-app-download">AppDownload</div>,
}));

describe("Home Component", () => {
  it("renders all child components", () => {
    render(<Home />);

    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
    expect(screen.getByTestId("mock-explore-menu")).toBeInTheDocument();
    expect(screen.getByTestId("mock-food-display")).toBeInTheDocument();
    expect(screen.getByTestId("mock-app-download")).toBeInTheDocument();
  });

  it("passes the correct props to ExploreMenu and FoodDisplay", () => {
    render(<Home />);

    expect(screen.getByTestId("mock-food-display")).toHaveTextContent(
      "FoodDisplay: All"
    );
  });

  it("updates category state when ExploreMenu changes it", () => {
    render(<Home />);

    const setPizzaButton = screen.getByText("Set Pizza");
    fireEvent.click(setPizzaButton);

    expect(screen.getByTestId("mock-food-display")).toHaveTextContent(
      "FoodDisplay: Pizza"
    );
  });
});
