/// <reference types="Cypress" />

const feed = feedName => cy.contains("[data-test=feed]", feedName);
const assertFeedActive = feedName =>
  feed(feedName).should("have.class", "active");
const assertFeedInactive = feedName =>
  feed(feedName).should("not.have.class", "active");
const assertFeeds = (...feeds) => {
  cy.get("[data-test=feed]").should("have.length", feeds.length);
  feeds.map(feed => {
    Array.isArray(feed) ? assertFeedActive(feed[0]) : assertFeedInactive(feed);
  });
};
const tag = (index, alias) =>
  cy
    .get("[data-test=tag]")
    .eq(index)
    .as(alias)
    .invoke("text");
const activePage = () => cy.get(".active .page-link");
const page = label => cy.contains(".page-link", label);
const setupGlobalFeed = () => {
  cy.server();
  const apiUrl = Cypress.env("apiUrl");
  cy.route({
    method: "GET",
    url: `${apiUrl}/articles?limit=10&offset=0`,
    status: 200,
    response: "fixture:articles/global.json"
  });
};
const article = index => cy.get(".article-preview").eq(index);

// const favoriteButton = {
//   isFavorited() {},
//   getCount() {}
// };
//
// const meta = () => ({
//   avatar() {},
//   author() {},
//   date() {}
// });
//
// const article = index => ({
//   meta() {},
//   title() {},
//   description() {},
//   favoriteButton() {}
// });

describe("articles", () => {
  context("anonymous E2E", () => {
    beforeEach(() => {
      cy.visit("/");
    });

    it("show active global feed with 10 articles", () => {
      assertFeeds(["Global Feed"]);
      cy.get(".article-preview").should("have.length", 10);
    });
  });

  context("anonymous stubbed", () => {
    beforeEach(() => {
      setupGlobalFeed();
      cy.visit("/");
    });

    it("provide articles preview", () => {
      cy.get(".article-preview").should("have.length", 2);

      article(0)
        .should("contain", "Unfavorited Article Title")
        .and("contain", "Fri Jul 12 2019")
        .and("contain", "Unfavorited Article Description");
      article(0)
        .find("[data-test='favorite-count']")
        .should("have.class", "unfavorited")
        .should("contain", 0);
      article(0)
        .find("img")
        .should("be.visible");

      article(1)
        .should("contain", "Favorited Article Title")
        .and("contain", "Sat Jul 13 2019")
        .and("contain", "Favorited Article Description");
      article(1)
        .find("[data-test='favorite-count']")
        .should("have.class", "favorited")
        .should("contain", 200);
      article(1)
        .find("img")
        .should("be.visible");
    });
  });

  context("logged-in", () => {
    beforeEach(() => {
      cy.login();
      cy.visit("/");
    });

    it("show active Your Feed and inactive Global feed", () => {
      assertFeeds(["Your Feed"], "Global Feed");
      feed("Global Feed").click();
      assertFeeds("Your Feed", ["Global Feed"]);
    });

    it("toggle tag feed when active", () => {
      tag(0, "selectedTag").then(text => {
        cy.get("@selectedTag").click();
        assertFeeds("Your Feed", "Global Feed", [text]);

        feed("Global Feed").click();
        assertFeeds("Your Feed", ["Global Feed"]);
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
