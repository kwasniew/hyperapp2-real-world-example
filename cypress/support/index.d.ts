/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    login(user: any): Chainable<any>
    fastLogin(user: any): Chainable<any>
    assertAtHome(): Chainable<any>
    hasError(message: string): Chainable<any>
    element(name: string): Chainable<any>
    typeIntoField(name: string, text: string): Chainable<any>
    typeIntoClearField(name: string, text: string): Chainable<any>
    elementContains(title: string): Chainable<any>
    fillInField(name: string, text: string): Chainable<any>
  }
}