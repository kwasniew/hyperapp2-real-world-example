/// <reference types="Cypress" />

describe("register", () => {
  beforeEach(() => {
    cy.visit("#!/register");
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
  });
});
