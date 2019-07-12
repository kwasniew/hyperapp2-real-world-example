/// <reference types="cypress" />

const apiUrl = Cypress.env("apiUrl");

Cypress.Commands.add("login", (user = Cypress.env("user")) =>
  cy
    .request("POST", `${apiUrl}/users/login`, {
      user: Cypress._.pick(user, ["email", "password"])
    })
    .its("body.user")
    .should("exist")
    .then(user => {
      localStorage.setItem("session", JSON.stringify(user));
      // with this user set, when we visit the page
      // the web application will have the user logged in
    })
);
Cypress.Commands.add("fastLogin", (user = Cypress.env("user")) =>
  cy
    .wrap(user)
    .then(user => {
      localStorage.setItem("session", JSON.stringify(user));
      // with this user set, when we visit the page
      // the web application will have the user logged in
    })
)

Cypress.Commands.add("hasError", message =>
  cy.get(".error-messages").should("contain", message)
);

Cypress.Commands.add("typeIntoField", (name, text) =>

  cy.element(name).type(text)
);

Cypress.Commands.add("typeIntoClearField", (name, text) =>
  cy.element(name).clear().type(text)
);

Cypress.Commands.add("assertAtHomePage", () => cy.hash().should("be.empty"));

Cypress.Commands.add("element", name => cy.get(`[data-test=${name}]`));
Cypress.Commands.add("elementContains", (name, value) => cy.contains(`[data-test=${name}]`, value));

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
