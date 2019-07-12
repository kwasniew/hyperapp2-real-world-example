const apiUrl = Cypress.env("apiUrl");

const setupOwnArticle = () => {
  cy.server({force404: true});
  cy.route({
    method: "GET",
    url: `${apiUrl}/articles/own-article`,
    status: 200,
    response: "fixture:articles/ownArticle.json"
  });
  cy.route({
    method: "GET",
    url: `${apiUrl}/articles/own-article/comments`,
    status: 200,
    response: "fixture:articles/emptyComments.json"
  });
};

describe("article details", () => {
  context("anonymous", () => {
    beforeEach(() => {
      cy.visit("/#!/article/article-with-details");
    });

    it("show article", () => {});
  });
  context("logged-in", () => {
    beforeEach(() => {
      cy.fastLogin();
    });

    it("show own article", () => {
      setupOwnArticle();
      cy.visit("/#!/article/own-article");
      cy.elementContains("title", "Own Article Title");
      cy.element("avatar").should("be.visible");
      cy.elementContains("date", "Fri Jul 12 2019");
      cy.element("edit");
      cy.element("delete");
      cy.element("markdown").contains("h1", "markdown test");
      cy.element("tag").should("contain", "javascript").and("contain", "testing");
      cy.element("commentText");
    });
    it("comment someone else's article", () => {});
  });
});
