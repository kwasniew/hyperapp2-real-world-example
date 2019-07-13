/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    login(): Chainable<any>
    fastLogin(): Chainable<any>
    assertAtHome(): Chainable<any>
    hasError(): Chainable<any>
    element(): Chainable<any>
    typeIntoField(): Chainable<any>
    typeIntoClearField(): Chainable<any>
    elementContains(title: string): Chainable<any>
  }
}