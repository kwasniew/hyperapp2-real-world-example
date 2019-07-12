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
// const article = index => cy.get(".article-preview").eq(index);

// const favoriteButton = parent => {
//   const object = parent.find("[data-test='favorite-count']");
//   const selectors = {
//     isUnfavorited() {
//       return object.should("have.class", "unfavorited");
//     },
//     isFavorited() {
//       return object.should("have.class", "favorited");
//     }
//   };
//   return Object.assign(object, selectors);
// };
//
// const meta = parent => {
//   const object = parent.find(".article-meta");
//   const selectors = {
//     avatar() {
//       return object.find("img");
//     },
//     author() {
//       return object.find(".author");
//     },
//     date() {
//       return object.find(".date");
//     }
//   };
//   return Object.assign(object, selectors);
// };
//
// const article = index => {
//   const object = cy.get(".article-preview").eq(index);
//   const selectors = {
//     meta() {
//       return meta(object);
//     },
//     title() {},
//     description() {},
//     favoriteButton() {
//       return favoriteButton(object);
//     }
//   };
//
//   return Object.assign(object, selectors);
// };
//
// const articleList = index => {
//   return {
//     selector: `.article-preview:eq(${index})`,
//     meta: {
//       selector: ".article-meta",
//       avatar: { selector: "img" },
//       author: { selector: ".author" },
//       date: { selector: ".date" }
//     },
//     favoriteButton: {
//       selector: "[data-test='favorite-count']"
//     }
//   };
// };

const articleFromList = index => {
  const indexed = name => `${name}-${index}`;
  const indexedArticle = indexed("article");
  const article = cy.get(`.article-preview:eq(${index})`).as(indexedArticle);
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
      const meta = cy
        .get("@" + indexedArticle)
        .find(".article-meta")
        .as(indexedArticle + "meta");
      return Object.assign(meta, {
        avatar() {
          return cy.get("@" + indexedArticle + "meta").find("img");
        },
        author() {
          return cy.get("@" + indexedArticle + "meta").find(".author");
        },
        date() {
          return cy.get("@" + indexedArticle + "meta").find(".date");
        }
      });
    },
    favoriteButton() {
      const button = cy
        .get("@" + indexedArticle)
        .find("[data-test='favorite-count']")
        .as(indexedArticle + "favoriteButton");
      return Object.assign(article, button, {
        isUnfavorited() {
          return cy
            .get("@" + indexedArticle + "favoriteButton")
            .should("have.class", "unfavorited");
        },
        isFavorited() {
          return cy
            .get("@" + indexedArticle + "favoriteButton")
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

    it.only("provide articles preview", () => {
      cy.get(".article-preview").should("have.length", 2);

      const firstArticle = articleFromList(0);
      const firstArticleMeta = firstArticle.meta();

      firstArticle
        .favoriteButton()
        .should("contain", 0)
        .isUnfavorited();
      firstArticle.title().should("contain", "Unfavorited Article Title");
      firstArticle
        .description()
        .should("contain", "Unfavorited Article Description");
      firstArticle.hasTags(["tag1", "tag2"]);
      firstArticle.tags().should("deep.equal", ["tag1", "tag2"]);
      firstArticleMeta.avatar().should("be.visible");
      firstArticleMeta.author().should("contain", "testuser1");
      firstArticleMeta.date().should("contain", "Fri Jul 12 2019");

      const secondArticle = articleFromList(1);
      const secondArticleMeta = secondArticle.meta();

      secondArticle
        .favoriteButton()
        .should("contain", 200)
        .isFavorited();
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
