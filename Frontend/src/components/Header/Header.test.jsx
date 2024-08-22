import { render, screen } from "@testing-library/react";
import Header from "./Header";

describe("Header component", () => {
  it("renders the header with correct text", () => {
    render(<Header />);

    // Check if the heading is rendered
    const heading = screen.getByText(
      /Feeling hungry\? Order your favorite dishes below!/i
    );
    expect(heading).toBeInTheDocument();

    // Check if the paragraph is rendered
    const paragraph = screen.getByText(
      /Explore our diverse menu, featuring an exquisite selection of dishes crafted with the utmost excellence./i
    );
    expect(paragraph).toBeInTheDocument();

    // Check if the button is rendered
    const button = screen.getByRole("button", { name: /View Menu/i });
    expect(button).toBeInTheDocument();
  });
});
