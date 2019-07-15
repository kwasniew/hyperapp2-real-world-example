const feed = feedName => cy.elementContains("feed", feedName);

const tag = (index, alias) =>
  cy
    .element("tag")
    .eq(index)
    .as(alias)
    .invoke("text");
const activePage = () => cy.get(".active .page-link");
const page = label => cy.contains(".page-link", label);
const apiUrl = Cypress.env("apiUrl");
const setupGlobalFeed = () => {
  cy.server({ force404: true });
  cy.route({
    method: "GET",
    url: `${apiUrl}/articles?limit=10&offset=0`,
    status: 200,
    response: "fixture:articles/global.json"
  });
};
const setupFavorite = () => {
  cy.server({ force404: true });
  cy.route({
    method: "POST",
    url: `${apiUrl}/articles/unfavorited-article-title/favorite`,
    status: 200,
    response: "fixture:articles/favorited.json"
  }).as("favorite");
  cy.route({
    method: "DELETE",
    url: `${apiUrl}/articles/favorited-article-title/favorite`,
    status: 200,
    response: "fixture:articles/unfavorited.json"
  }).as("unfavorite");
};

const article = index => cy.element("article").eq(index);

describe("articles", () => {
  beforeEach(function () {
    console.log(this.currentTest.title);
    // cy.record(this.currentTest.title);
  });

  context("anonymous E2E", () => {
    beforeEach(() => {
      cy.visit("/");
    });

    it("show active global feed with 10 articles", () => {
      cy.assertFeeds(["Global Feed"]);
      cy.get(".article-preview").should("have.length", 10);
    });
  });

  context("anonymous stubbed", () => {
    beforeEach(() => {
      setupGlobalFeed();
      cy.visit("/");
    });

    it("favorite/unfavorite article", () => {
      setupFavorite();

      article(0).within(() => {
        cy.element("favorite-count")
          .should("have.class", "unfavorited")
          .click()
          .should("have.class", "favorited");
      });
      article(1).within(() => {
        cy.element("favorite-count")
          .should("have.class", "favorited")
          .click()
          .should("have.class", "unfavorited");
      });
    });

    it("provide articles preview", () => {
      cy.get(".article-preview").should("have.length", 2);

      article(0).within(() => {
        cy.element("title").should("contain", "Unfavorited Article Title");
        cy.element("description").should(
          "contain",
          "Unfavorited Article Description"
        );
        cy.element("tag")
          .should("contain", "tag1")
          .and("contain", "tag2")
          .and("have.length", 2);
        cy.element("avatar").should("be.visible");
        cy.element("date").should("contain", "Fri Jul 12 2019");
      });

      article(1).within(() => {
        cy.element("title").should("contain", "Favorited Article Title");
        cy.element("description").should(
          "contain",
          "Favorited Article Description"
        );
        cy.element("tag")
          .should("contain", "tag3")
          .and("have.length", 1);
        cy.element("avatar").should("be.visible");
        cy.element("date").should("contain", "Sat Jul 13 2019");
      });
    });
  });

  context("logged-in", () => {
    beforeEach(() => {
      cy.login();
      cy.visit("/");
    });

    it("show active Your Feed and inactive Global feed", () => {
      cy.assertFeeds(["Your Feed"], "Global Feed");
      feed("Global Feed").click();
      cy.assertFeeds("Your Feed", ["Global Feed"]);
    });

    it("toggle tag feed when active", () => {
      tag(0, "selectedTag").then(text => {
        cy.get("@selectedTag").click();
        cy.assertFeeds("Your Feed", "Global Feed", [text]);

        feed("Global Feed").click();
        cy.assertFeeds("Your Feed", ["Global Feed"]);
      });
    });

    it("paginate articles", () => {
      feed("Global Feed").click();
      activePage().should("have.text", "1");
      page("2").click();
      activePage().should("have.text", "2");
    });
  });
});
