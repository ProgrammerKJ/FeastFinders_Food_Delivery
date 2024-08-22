import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import App from "./App";

vi.mock("./Components/Navbar/Navbar", () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));
vi.mock("./Components/Sidebar/Sidebar", () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));
vi.mock("./Pages/Add/Add", () => ({
  default: () => <div data-testid="add">Add</div>,
}));
vi.mock("./Pages/List/List", () => ({
  default: () => <div data-testid="list">List</div>,
}));
vi.mock("./Pages/Orders/Orders", () => ({
  default: () => <div data-testid="orders">Orders</div>,
}));

describe("App Component", () => {
  test("renders Navbar and Sidebar", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
  });

  test.each([
    ["/add", "add"],
    ["/list", "list"],
    ["/orders", "orders"],
  ])("renders %s route component", (route, testId) => {
    render(
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });
});
