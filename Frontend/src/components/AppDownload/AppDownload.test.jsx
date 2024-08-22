import { render, screen } from "@testing-library/react";
import AppDownload from "./AppDownload";

describe("AppDownload component", () => {
  it("renders the AppDownload component with correct content", () => {
    render(<AppDownload />);

    // Check if the text "For The Most Optimal Experience Download Feast Finder App" is rendered
    const textElement = screen.getByText(
      /For The Most Optimal Experience Download/i
    );
    expect(textElement).toBeInTheDocument();

    // Check if the platform images are rendered
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(2); // Expecting 2 images: Play Store and App Store

    const [playStoreImage, appStoreImage] = images;
    expect(playStoreImage).toHaveAttribute("alt", "Google Play");
    expect(appStoreImage).toHaveAttribute("alt", "App Store");
  });
});
