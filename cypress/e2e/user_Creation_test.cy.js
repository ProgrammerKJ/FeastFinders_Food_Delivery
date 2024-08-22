describe("User Creation and Login Test", () => {
  beforeEach(() => {
    // Visit the home page (or wherever the login popup can be triggered)
    cy.visit("/");
  });

  it("Should mock user creation process", () => {
    // Intercept the API call for user registration
    cy.intercept("POST", "**/api/user/register", {
      statusCode: 200,
      body: {
        success: true,
        message: "User created successfully",
        token: "mock-jwt-token",
      },
    }).as("userSignup");

    // Open the login popup
    cy.get('[data-test="signin-btn-test"]').click();

    // Ensure we're on the Sign Up state
    cy.contains("h2", "Sign Up").should("be.visible");

    // Fill out the signup form
    cy.get('input[name="name"]').type("Test User");
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("password123");

    // Check the terms checkbox
    cy.get('input[type="checkbox"][data-test="agree-to-terms-test"]').check();

    // Submit the form
    cy.get('button[data-testid="login-button"]').click();

    // Wait for the intercepted request
    cy.wait("@userSignup");

    // Verify that the login popup is closed (indicating successful signup)
    cy.get(".login-popup").should("not.exist");

    // Verify that the user's name is displayed in the navbar or profile area
    cy.get(".navbar-profile").should("be.visible");
  });

  it("Should handle login process", () => {
    // Intercept the API call for user login
    cy.intercept("POST", "**/api/user/login", {
      statusCode: 200,
      body: {
        success: true,
        message: "Login successful",
        token: "mock-jwt-token",
      },
    }).as("userLogin");

    // Open the login popup
    cy.get('[data-test="signin-btn-test"]').click();

    // Switch to Login state
    cy.get('[data-test="span-login-here-btn"]').click();

    // Ensure we're on the Login state
    cy.contains("h2", "Login").should("be.visible");

    // Fill out the login form
    cy.get('input[data-test="email-input"]').type("test@example.com");
    cy.get('input[data-test="password-input"]').type("password123");

    // Check the terms checkbox
    cy.get('input[type="checkbox"][data-test="agree-to-terms-test"]').check();

    // Submit the form
    cy.get('button[data-testid="login-button"]').click();

    // Wait for the intercepted request
    cy.wait("@userLogin");

    // Verify that the login popup is closed (indicating successful login)
    cy.get(".login-popup").should("not.exist");

    // Verify that the user's profile is displayed in the navbar
    cy.get(".navbar-profile").should("be.visible");
  });
});
