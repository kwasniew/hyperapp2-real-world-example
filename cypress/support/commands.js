/// <reference types="cypress" />

const apiUrl = Cypress.env("apiUrl");

Cypress.Commands.add("login", (user = Cypress.env("user")) => {
  cy.request("POST", `${apiUrl}/users/login`, {
    user: Cypress._.pick(user, ["email", "password"])
  })
    .its("body.user")
    .should("exist")
    .then(user => {
      localStorage.setItem("session", JSON.stringify(user));
      // with this user set, when we visit the page
      // the web application will have the user logged in
    });
});

Cypress.Commands.add("hasError", message => {
  cy.get(".error-messages").should("contain", message);
});

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
