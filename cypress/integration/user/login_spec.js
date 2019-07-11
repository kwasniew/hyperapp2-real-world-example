/// <reference types="Cypress" />

describe("login", () => {
  beforeEach(() => {
    cy.visit("/#!/login");
  });

  it("greets with Sign in", () => {
    cy.contains("h1", "Sign In");
  });

  it("links to register", () => {
    cy.contains("Need an account?").should("have.attr", "href", "/register");
  });

  it("requires email", () => {
    cy.get("form")
      .contains("Sign in")
      .click();
    cy.get(".error-messages").should("contain", "email or password is invalid");
  });

  it("requires password", () => {
    cy.get("[data-test=email]").type("hyperapp@gmail.com{enter}");
    cy.get(".error-messages").should("contain", "email or password is invalid");
  });

  it("requires valid username and password", () => {
    cy.get("[data-test=email]").type("hyperapp@gmail.com");
    cy.get("[data-test=password]").type("invalid{enter}");
    cy.get(".error-messages").should("contain", "email or password is invalid");
  });

  it("navigates to home on successful login", () => {
    cy.get("[data-test=email]").type("hyperapp@gmail.com");
    cy.get("[data-test=password]").type("hyperapp{enter}");
    cy.hash().should("be.empty");
  });
});
