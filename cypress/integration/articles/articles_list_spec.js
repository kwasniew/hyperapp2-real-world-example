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

const article = index => {
  const indexed = name => `${name}-${index}`;
  const indexedArticle = indexed("article");
  const article = cy
    .get("[data-test=article]")
    .eq(index)
    .as(indexedArticle);
  return Object.assign(article, {
    title() {
      return cy.get("@" + indexedArticle).find("h1");
    },
    description() {
      return cy.get("@" + indexedArticle).find("p");
    },
    hasTags(list) {
      list.map(tag => cy.get("@" + indexedArticle).contains(".tag-pill", tag));
    },
    tags() {
      return cy
        .get("@" + indexedArticle)
        .find(".tag-pill")
        .then(tags => tags.map((i, tag) => tag.innerText).toArray());
    },
    meta() {
      const indexedMeta = indexed("meta");
      const meta = cy
        .get("@" + indexedArticle)
        .find(".article-meta")
        .as(indexedMeta);
      return Object.assign(meta, {
        avatar() {
          return cy.get("@" + indexedMeta).find("img");
        },
        author() {
          return cy.get("@" + indexedMeta).find(".author");
        },
        date() {
          return cy.get("@" + indexedMeta).find(".date");
        }
      });
    },
    favoriteButton() {
      const indexedFavoriteButton = indexed("favoriteButton");
      const button = cy
        .get("@" + indexedArticle)
        .find("[data-test='favorite-count']")
        .as(indexedFavoriteButton);
      return Object.assign(article, button, {
        isUnfavorited() {
          return cy
            .get("@" + indexedFavoriteButton)
            .should("have.class", "unfavorited");
        },
        isFavorited() {
          return cy
            .get("@" + indexedFavoriteButton)
            .should("have.class", "favorited");
        }
      });
    }
  });
};

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

    it("favorite/unfavorite article", () => {
      setupFavorite();

      const firstButton = article(0).favoriteButton();
      firstButton.should("contain", 0).isUnfavorited();
      firstButton.click();
      firstButton.should("contain", 1).isFavorited();
      // cy.get("@favorite").should(xhr => {
      //   expect(xhr.requestBody).to.be.null;
      // });

      const secondButton = article(1).favoriteButton();

      secondButton.should("contain", 200).isFavorited();
      secondButton.click();
      secondButton.should("contain", 199).isUnfavorited();
    });

    it("provide articles preview", () => {
      cy.get(".article-preview").should("have.length", 2);

      const firstArticle = article(0);
      const firstArticleMeta = firstArticle.meta();

      firstArticle.title().should("contain", "Unfavorited Article Title");
      firstArticle
        .description()
        .should("contain", "Unfavorited Article Description");
      firstArticle.hasTags(["tag1", "tag2"]);
      firstArticle.tags().should("deep.equal", ["tag1", "tag2"]);
      firstArticleMeta.avatar().should("be.visible");
      firstArticleMeta.author().should("contain", "testuser1");
      firstArticleMeta.date().should("contain", "Fri Jul 12 2019");

      const secondArticle = article(1);
      const secondArticleMeta = secondArticle.meta();

      secondArticle.title().should("contain", "Favorited Article Title");
      secondArticle
        .description()
        .should("contain", "Favorited Article Description");
      secondArticle.hasTags(["tag3"]);
      secondArticle.tags().should("deep.equal", ["tag3"]);
      secondArticleMeta.author().should("contain", "testuser2");
      secondArticleMeta.date().should("contain", "Sat Jul 13 2019");
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
