import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

describe("Footer component", () => {
  it("renders the footer with correct content", () => {
    render(<Footer />);

    // Check if the logo image is rendered
    const logo = screen.getByAltText("Logo");
    expect(logo).toBeInTheDocument();

    // Check if the COMPANY section is rendered
    const companyHeading = screen.getByText(/COMPANY/i);
    expect(companyHeading).toBeInTheDocument();

    const companyLinks = ["Home", "About Us", "Delivery", "Privacy Policy"];
    companyLinks.forEach((link) => {
      expect(screen.getByText(link)).toBeInTheDocument();
    });

    // Check if the GET IN TOUCH section is rendered
    const getInTouchHeading = screen.getByText(/GET IN TOUCH/i);
    expect(getInTouchHeading).toBeInTheDocument();

    const contactInfo = ["+1-888-546-3467", "contact@feastfinder.com"];
    contactInfo.forEach((info) => {
      expect(screen.getByText(info)).toBeInTheDocument();
    });

    // Check if the copyright text is rendered
    const copyrightText = screen.getByText(
      /Copyright 2024 © feastfinder\.com - All Rights Reserved\./i
    );
    expect(copyrightText).toBeInTheDocument();
  });
});
