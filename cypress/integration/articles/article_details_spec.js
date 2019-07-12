const apiUrl = Cypress.env("apiUrl");

const setupOwnArticle = () => {
  cy.server({ force404: true });
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
const setupOtherAuthorArticle = () => {
  cy.server({ force404: true });
  cy.route({
    method: "GET",
    url: `${apiUrl}/articles/other-user-article`,
    status: 200,
    response: "fixture:articles/otherAuthorArticle.json"
  });
  cy.route({
    method: "GET",
    url: `${apiUrl}/articles/other-user-article/comments`,
    status: 200,
    response: "fixture:articles/comments.json"
  });
  cy.route({
    method: "POST",
    url: `${apiUrl}/articles/other-user-article/comments`,
    status: 200,
    response: "fixture:articles/newComment.json"
  }).as("postComment");
  cy.route({
    method: "DELETE",
    url: `${apiUrl}/articles/other-user-article/comments/42498`,
    status: 200,
    response: {}
  }).as("deleteComment");
};
const checkArticle = () => {
  cy.elementContains("title", "Article Title");
  cy.element("avatar").should("be.visible");
  cy.elementContains("date", "Fri Jul 12 2019");
  cy.element("markdown").contains("h1", "markdown test");
  cy.element("tag")
    .should("contain", "javascript")
    .and("contain", "testing");
};

describe("article details", () => {
  context("logged-in", () => {
    beforeEach(() => {
      cy.fastLogin();
    });

    it("show own article", () => {
      setupOwnArticle();
      cy.visit("/#!/article/own-article");

      checkArticle();
      cy.element("authPrompt").should("not.exist");
      cy.element("edit").should("exist");
      cy.element("delete").should("exist");
    });

    it("show someone else's article", () => {
      setupOtherAuthorArticle();
      cy.visit("/#!/article/other-user-article");
      checkArticle();
      cy.element("authPrompt").should("not.exist");
      cy.element("edit").should("not.exist");
      cy.element("delete").should("not.exist");
    });

    it("can comment", () => {
      setupOtherAuthorArticle();
      cy.visit("/#!/article/other-user-article");

      cy.element("comment")
        .eq(0)
        .within(() => {
          cy.elementContains("commentText", "+1");
          cy.element("deleteComment").should("not.exist");
        });
      cy.element("commentInput").type("I don't agree");
      cy.contains("Post Comment").click();

      cy.wait("@postComment");
      cy.element("comment")
        .eq(0)
        .within(() => {
          cy.elementContains("commentText", "I don't agree");
          cy.element("deleteComment").click();
        });
      cy.wait("@deleteComment");
      cy.element("comment").should("have.length", 1);
    });
  });

  context("anonymous", () => {
    it("show article", () => {
      setupOwnArticle();
      cy.visit("/#!/article/own-article");

      checkArticle();
      cy.element("authPrompt").should("exist");
      cy.element("edit").should("not.exist");
      cy.element("delete").should("not.exist");
    });
  });
});
