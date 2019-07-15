const assertSessionCleared = () =>
  cy
    .window()
    .its("localStorage")
    .invoke("getItem", "session")
    .should("be.null");

const updateSettings = () => cy.contains("Update Settings").click();
const goToSettings = () => cy.contains(".nav-item", "Settings").click();

const listenToUpdateSettings = () => {
  const apiUrl = Cypress.env("apiUrl");
  cy.server();
  cy.route({
    method: "PUT",
    url: `${apiUrl}/user`
  }).as("updateSettings");
};

const waitForUpdatedBio = bio =>
  cy
    .wait("@updateSettings")
    .its("request.body.user.bio")
    .should("equal", bio);

describe("settings", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/#!/settings");
  });

  it("allows to update prefilled settings", () => {
    cy.element("username").should("have.value", "Test Cypress User");
    cy.element("email").should("have.value", "testingwithcypress@gmail.com");
    cy.element("password").should("be.empty");

    const newBio = "bio updated";
    cy.typeIntoClearField("bio", newBio);
    listenToUpdateSettings();
    updateSettings();
    waitForUpdatedBio(newBio);

    cy.assertAtHomePage();
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
