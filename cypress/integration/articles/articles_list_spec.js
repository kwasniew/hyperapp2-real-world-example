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
const firstTagText = alias =>
  cy
    .get("[data-test=tag]")
    .first()
    .as(alias)
    .invoke("text");

describe("articles", () => {
  context("anonymous", () => {
    beforeEach(() => {
      cy.visit("/");
    });

    it("show active global feed only", () => {
      assertFeeds(["Global Feed"]);
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
      firstTagText("firstTag").then(text => {
        cy.get("@firstTag").click();
        assertFeeds("Your Feed", "Global Feed", [text]);

        feed("Global Feed").click();
        assertFeeds("Your Feed", ["Global Feed"]);
      });
    });

    it("paginate articles", () => {
      feed("Global Feed").click();
      cy.contains(".active", "1");
      cy.contains(".page-link", "2").click();
      cy.get(".active .page-link").should("have.text", "2");
    });
  });
});
