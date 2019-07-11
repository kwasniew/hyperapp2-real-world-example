/// <reference types="Cypress" />

const submit = () =>
  cy
    .get("form")
    .contains("Sign in")
    .click();

describe("login", () => {
  beforeEach(() => {
    cy.visit("/#!/login");
  });

  it("greets with Sign in and links to register", () => {
    cy.contains("h1", "Sign In");
    cy.contains("Need an account?").should("have.attr", "href", "/register");
  });

  it("requires email", () => {
    submit();
    cy.hasError("email or password is invalid");
  });

  it("requires password", () => {
    cy.typeIntoField("email", "hyperapp@gmail.com{enter}");
    cy.hasError("email or password is invalid")
  });

  it("requires valid username and password", () => {
    cy.typeIntoField("email", "hyperapp@gmail.com");
    cy.typeIntoField("password", "invalid{enter}");
    cy.hasError("email or password is invalid");
  });

  it("navigates to home on successful login", () => {
    cy.typeIntoField("email", "hyperapp@gmail.com");
    cy.typeIntoField("password", "hyperapp{enter}");
    cy.assertAtHomePage();
  });
});
