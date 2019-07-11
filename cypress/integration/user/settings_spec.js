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

  it("greets with Your Settings", () => {
    cy.contains("h1", "Your Settings");
  });

  it("allows to update settings", () => {
    const newBio = "bio updated at " + new Date();
    cy.typeIntoClearField("bio", newBio);
    updateSettings();
    cy.assertAtHomePage();
    goToSettings();
    cy.field("bio").should("have.value", newBio);
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
