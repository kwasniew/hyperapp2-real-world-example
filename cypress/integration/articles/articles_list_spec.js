/// <reference types="Cypress" />

const assertFeedActive = feedName =>
  cy.contains("[data-test=feed]", feedName).should("have.class", "active");
const assertFeedInactive = feedName =>
  cy.contains("[data-test=feed]", feedName).should("not.have.class", "active");
const assertFeeds = (...feeds) => {
  cy.get("[data-test=feed]").should("have.length", feeds.length);
  feeds.map(feed => {
    Array.isArray(feed) ? assertFeedActive(feed[0]): assertFeedInactive(feed);
  });
};


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
      cy.contains("[data-test=feed]", "Global Feed").click();
      assertFeeds("Your Feed", ["Global Feed"]);
    });

    it("toggle tag feed when active", () => {
      cy.get("[data-test=tag]")
        .first()
        .as("firstTag")
        .invoke("text")
        .then(text => {
          cy.get("@firstTag").click();
          assertFeeds("Your Feed", "Global Feed", [text]);
        });
    });
  });
});
