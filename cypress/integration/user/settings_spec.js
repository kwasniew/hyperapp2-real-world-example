const assertSessionCleared = () => cy.window()
  .its("localStorage")
  .invoke("getItem", "session")
  .should("be.null");

const updateSettings = () => cy.contains("Update Settings").click();
const goToSettings = () => cy.contains(".nav-item", "Settings").click();

describe("settings", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/#!/settings");
  });

  it("allows to update prefilled settings", () => {
    cy.element("username").should("have.value", "Test Cypress User");
    cy.element("email").should("have.value", "testingwithcypress@gmail.com");
    cy.element("password").should("be.empty");

    const newBio = "bio updated at " + new Date();
    cy.typeIntoClearField("bio", newBio);
    updateSettings();
    cy.assertAtHomePage();
    goToSettings();
    cy.element("bio").should("have.value", newBio);
  });

  it("prevents profile update with invalid password", () => {
    cy.get("[data-test=password]").type("x");
    updateSettings();
    cy.hasError("password is too short (minimum is 8 characters)");
  });

  it("logs out", () => {
    cy.contains("logout").click();
    cy.assertAtHomePage();
    assertSessionCleared();
  });
});
