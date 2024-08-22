import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "./Sidebar";

describe("Sidebar Component", () => {
  test("renders all navigation links", () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );
    expect(screen.getByText("Add Items")).toBeInTheDocument();
    expect(screen.getByText("List Items")).toBeInTheDocument();
    expect(screen.getByText("Orders")).toBeInTheDocument();
  });

  test("navigation links have correct href attributes", () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );
    expect(screen.getByText("Add Items").closest("a")).toHaveAttribute(
      "href",
      "/add"
    );
    expect(screen.getByText("List Items").closest("a")).toHaveAttribute(
      "href",
      "/list"
    );
    expect(screen.getByText("Orders").closest("a")).toHaveAttribute(
      "href",
      "/orders"
    );
  });
});
