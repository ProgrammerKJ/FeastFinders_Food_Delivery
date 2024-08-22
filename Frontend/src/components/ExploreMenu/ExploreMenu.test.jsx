import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ExploreMenu from "./ExploreMenu";
import { menu_list } from "../../assets/assets";

// Mock the assets
vi.mock("../../assets/assets", () => ({
  menu_list: [
    { menu_name: "All", menu_image: "all.jpg" },
    { menu_name: "Burger", menu_image: "burger.jpg" },
    { menu_name: "Pizza", menu_image: "pizza.jpg" },
  ],
}));

describe("ExploreMenu Component", () => {
  const mockSetCategory = vi.fn();

  const renderExploreMenu = (category = "All") => {
    return render(
      <ExploreMenu category={category} setCategory={mockSetCategory} />
    );
  };

  it("renders the component with the correct title and text", () => {
    renderExploreMenu();
    expect(screen.getByText("Explore Our Menu")).toBeInTheDocument();
    expect(screen.getByText(/Discover a diverse menu/)).toBeInTheDocument();
  });

  it("renders all menu items", () => {
    renderExploreMenu();
    menu_list.forEach((item) => {
      const menuItem = screen.getByText(item.menu_name);
      expect(menuItem).toBeInTheDocument();
      const image = screen.getByAltText(item.menu_name);
      expect(image).toHaveAttribute("src", item.menu_image);
    });
  });

  it("applies 'active' class to the selected category", () => {
    renderExploreMenu("Burger");
    const burgerImage = screen.getByAltText("Burger");
    expect(burgerImage).toHaveClass("active");
  });

  it("calls setCategory with 'All' when clicking on the current category", () => {
    renderExploreMenu("All");
    const pizzaItem = screen.getByText("Pizza");
    fireEvent.click(pizzaItem);
    expect(mockSetCategory).toHaveBeenCalledWith(expect.any(Function));
    // Call the function passed to setCategory
    const setStateFunction = mockSetCategory.mock.calls[0][0];
    expect(setStateFunction("All")).toBe("Pizza");
  });

  it("calls setCategory with the new category when clicking on a different category", () => {
    renderExploreMenu("All");
    const pizzaItem = screen.getByText("Pizza");
    fireEvent.click(pizzaItem);
    expect(mockSetCategory).toHaveBeenCalledWith(expect.any(Function));
    // Call the function passed to setCategory
    const setStateFunction = mockSetCategory.mock.calls[0][0];
    expect(setStateFunction("All")).toBe("Pizza");
  });

  it("renders a horizontal rule", () => {
    renderExploreMenu();
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });
});
