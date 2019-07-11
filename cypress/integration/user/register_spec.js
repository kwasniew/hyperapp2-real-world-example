/// <reference types="Cypress" />

describe("register", () => {
  beforeEach(() => {
    cy.visit("#!/register");
  });

  it("greets with Sign Up and links to login", () => {
    cy.contains("h1", "Sign Up");
    cy.contains("Have an account?").should("have.attr", "href", "/login");
  });

  it("requires username, email, password", () => {
    cy.get("form")
      .contains("Sign up")
      .click();
    cy.hasError("email can't be blank");
    cy.hasError("password can't be blank");
    cy.hasError("username can't be blank and is too short (minimum is 1 character)");
  });


  it("registers new user", () => {
    const username = "visitor";
    const email = "visitor@email.com";
    const password = "visiting";

    cy.server();
    const apiUrl = Cypress.env("apiUrl");
    cy.route({
      method: "POST",
      url: `${apiUrl}/users`,
      status: 201,
      response: {"user": {"token": "validToken", username}}
    });

    cy.get("[data-test=username]").type(username);
    cy.get("[data-test=email]").type(email);
    cy.get("[data-test=password]").type(password);
    cy.get("form").submit();

    cy.hash().should("be.empty");
    cy.contains('[data-test=profile]', username).should('be.visible');
  });
});
