const apiUrl = Cypress.env("apiUrl");
const user = Cypress.env("user");

const checkBasicInformation = () => {
  cy.element("avatar").should("be.visible");
  cy.elementContains("username", user.username);
  cy.element("bio").should("be.visible");
  cy.assertFeeds(["My Articles"], "Favorited Articles");
  cy.get(".article-preview")
    .should("have.length", 5)
    .each(el => cy.wrap(el).contains(user.username))
    .end();
  cy.contains("Favorited Articles").click();
  cy.assertFeeds("My Articles", ["Favorited Articles"]);
};

describe("author details", () => {
  it("view own profile", () => {
    cy.login();
    cy.visit(`/#!/profile/${encodeURIComponent(user.username)}`);
    checkBasicInformation();

    cy.elementContains("editSettings", "Edit Profile Settings");
    cy.element("changeFollow").should("not.exist");
  });

  it("view other profile as loggedIn", () => {
    cy.login();
    cy.visit(`/#!/profile/${encodeURIComponent("Jack H")}`);

    cy.element("editSettings").should("not.exist");
    cy.element("changeFollow").should("exist");
  });

  it("view other profile as anonymous", () => {
    cy.visit(`/#!/profile/${encodeURIComponent(user.username)}`);

    cy.element("editSettings").should("not.exist");
    cy.element("changeFollow").should("not.exist");
  });
});
