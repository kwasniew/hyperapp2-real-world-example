const apiUrl = Cypress.env("apiUrl");
const user = Cypress.env("user");

describe("author details", () => {
  it("own profile", () => {
    cy.login();
    cy.visit(`/#!/profile/${encodeURIComponent(user.username)}`);
    cy.element("avatar").should("be.visible");
    cy.elementContains("username", user.username);
    cy.elementContains("bio", "bio updated at");
    cy.elementContains("editSettings", "Edit Profile Settings");
    cy.element("changeFollow").should("not.exist");
    cy.assertFeeds(["My Articles"], "Favorited Articles");
    cy.get(".article-preview").should("have.length", 5).each(el => cy.wrap(el).contains(user.username)).end();
    cy.contains("Favorited Articles").click();
    cy.assertFeeds("My Articles", ["Favorited Articles"]);
  });

});