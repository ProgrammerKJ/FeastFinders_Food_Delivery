import React from "react";
import { render, screen } from "@testing-library/react";
import Navbar from "./Navbar";

describe("Navbar Component", () => {
  test("renders logo and profile image", () => {
    render(<Navbar />);
    const logoElement = screen.getByAltText("Logo");
    const profileElement = screen.getByAltText("Profile Pic");
    expect(logoElement).toBeInTheDocument();
    expect(profileElement).toBeInTheDocument();
    expect(logoElement).toHaveClass("logo");
    expect(profileElement).toHaveClass("profile");
  });
});
