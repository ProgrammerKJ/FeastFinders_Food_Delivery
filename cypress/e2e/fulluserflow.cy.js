describe("Full user functionality testing", () => {
  it("Mimicking a full user sign-in authentication flow, cart interaction, checkout, and logout", () => {
    let initialTotal;

    // Visit the homepage and sign in
    cy.visit("/");
    cy.get('[data-test="signin-btn-test"]').click();
    cy.get('[data-test="span-login-here-btn"]').click();
    cy.get('[data-test="email-input"]').type("Test_User@gmail.com");
    cy.get('[data-test="password-input"]').type("Test_User");
    cy.get('[data-test="agree-to-terms-test"]').click();
    cy.get('[data-testid="login-button"]').click();

    // Wait for the food display to load
    cy.get('[data-testid="food-display"]', { timeout: 10000 }).should(
      "be.visible"
    );

    // Function to click and log
    const clickAndLog = (index) => {
      cy.get('[data-testid^="add-to-cart-button-"]').eq(index).click();
      cy.log(`Clicked item ${index + 1}`);
      // Wait for the counter to appear or update
      cy.get('[data-testid^="item-counter-"]').eq(index).should("be.visible");
      cy.wait(2000); // Wait for 2 seconds after each click
    };

    // Add items to cart
    clickAndLog(0);
    clickAndLog(1);
    clickAndLog(2);

    // Navigate to the cart page
    cy.get('[data-testid="cart-link"]').click();

    // Verify we're on the cart page
    cy.url().should("include", "/cart");

    // Verify cart contents
    cy.get(".cart-items-item").should("have.length", 3);

    // Verify cart totals and store initial total
    cy.get(".cart-total-details")
      .last()
      .find("b")
      .last()
      .invoke("text")
      .then((text) => {
        initialTotal = parseFloat(text.replace("$", ""));
        expect(initialTotal).to.be.greaterThan(0);
      });

    // Click "PROCEED TO CHECKOUT" button
    cy.contains("PROCEED TO CHECKOUT").click();

    // Verify we're on the place order page
    cy.url().should("include", "/order");

    // Fill out the order form
    cy.get('input[name="firstName"]').type("John");
    cy.get('input[name="lastName"]').type("Doe");
    cy.get('input[name="email"]').type("john.doe@example.com");
    cy.get('input[name="street"]').type("123 Main St");
    cy.get('input[name="city"]').type("Anytown");
    cy.get('input[name="state"]').type("CA");
    cy.get('input[name="zipcode"]').type("12345");
    cy.get('input[name="country"]').type("USA");
    cy.get('input[name="phone"]').type("1234567890");

    // Verify the total amount on the place order page
    cy.get(".cart-total-details")
      .last()
      .find("b")
      .last()
      .invoke("text")
      .then((text) => {
        const checkoutTotal = parseFloat(text.replace("$", ""));
        expect(checkoutTotal).to.equal(initialTotal);
      });

    // Intercept the POST request to the order API
    cy.intercept("POST", "**/api/order/place").as("placeOrder");

    // Click "PROCEED TO PAYMENT" button
    cy.contains("PROCEED TO PAYMENT").click();

    // Wait for the order API call to complete
    cy.wait("@placeOrder").then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
      expect(interception.response.body).to.have.property("success", true);
      expect(interception.response.body).to.have.property("session_url");

      const stripeUrl = interception.response.body.session_url;
      cy.log("Redirecting to:", stripeUrl);

      // Verify that the session_url is a valid Stripe URL
      expect(stripeUrl).to.include("https://checkout.stripe.com");
    });

    // Check that we've been redirected away from our original domain
    cy.url().should("not.include", "localhost");

    // Go back to the homepage
    cy.visit("/");

    // Verify we're back on the homepage
    cy.get('[data-testid="food-display"]', { timeout: 10000 }).should(
      "be.visible"
    );

    // Logout
    cy.window().then((win) => {
      win.localStorage.removeItem("token");
    });
    cy.visit("/"); // Force a page reload to reflect the logout state

    // Verify logout
    cy.get('[data-test="signin-btn-test"]').should("be.visible");
  });
});
