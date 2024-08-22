describe("Front Page Rendering", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("contains correct header text", () => {
    cy.get('[data-test="header-2-text"]').should(
      "have.text",
      "Feeling hungry? Order your favorite dishes below!"
    );
  });

  it("contains correct menu texts", () => {
    cy.get("h1").should("have.text", "Explore Our Menu");
    cy.get(".explore-menu-text").contains("Discover a diverse menu");
  });

  it("contains imgs & app download text", () => {
    cy.get("#app-download > p").should(
      "have.text",
      "For The Most Optimal Experience Download Feast Finder App"
    );
    cy.get('.footer-content-left > [src="/src/assets/FeastFinderLogo.png"]');
    cy.get(".footer-content-center > h2")
      .nextAll("ul")
      .should("have.length", 1);
  });

  it("login popup is functioning correctly", () => {
    cy.get('[data-test="signin-btn-test"]').click();
    cy.get("div.login-popup-title").should("be.visible");
    cy.get("div.login-popup-inputs").should("be.visible");
  });
});
