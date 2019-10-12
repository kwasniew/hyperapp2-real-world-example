import assert from "assert";
import jsdom from "./jsdom.setup.js";
import "./polly.setup.js";
import { wait, waitForElement } from "@testing-library/dom";
import { init } from "../src/app.js";
import globalFeed from "./fixtures/global.json";
import { login } from "./apiClient.js";
import { element } from "./selectors.js";
import {
  assertFeeds,
  assertArticleCount,
  goToFeed,
  unfavorited,
  assertActivePage,
  tag,
  tags,
  feed,
  articles,
  isFavorited,
  isUnfavorited,
  page
} from "./homePage.js";

const apiUrl = "https://conduit.productionready.io/api";

describe("articles", function() {
  beforeEach(function() {
    jsdom.beforeEach("/");
  });
  context("stubbed response", function() {
    beforeEach(function() {
      const { server } = this.polly;
      server.get(`${apiUrl}/articles?limit=10&offset=0`).intercept((req, res) => {
        res.status(200).json(globalFeed);
      });
      init();
    });
    it("provide articles preview", async () => {
      await wait(assertArticleCount(2));
      const firstArticleSelector = element(articles(0));
      assert.deepStrictEqual(firstArticleSelector("title").textContent, "Unfavorited Article Title");
      assert.deepStrictEqual(firstArticleSelector("description").textContent, "Unfavorited Article Description");
      assert.deepStrictEqual(tags(articles(0)), ["tag1", "tag2"]);
      assert.deepStrictEqual(firstArticleSelector("date").textContent, "Fri Jul 12 2019");
      assert.deepStrictEqual(
        firstArticleSelector("avatar").src,
        "https://static.productionready.io/images/smiley-cyrus.jpg"
      );

      const secondArticleSelector = element(articles(1));
      assert.deepStrictEqual(secondArticleSelector("title").textContent, "Favorited Article Title");
      assert.deepStrictEqual(secondArticleSelector("description").textContent, "Favorited Article Description");
      assert.deepStrictEqual(tags(articles(1)), ["tag3"]);
      assert.deepStrictEqual(secondArticleSelector("date").textContent, "Sat Jul 13 2019");
      assert.deepStrictEqual(
        secondArticleSelector("avatar").src,
        "https://dummyimage.com/100x100/f01818/ffffff&text=+boom"
      );
    });
  });
  context("logged-in", function() {
    beforeEach(async function() {
      await login();
      init();
    });
    it("switch your and global feed", async () => {
      await wait(assertFeeds(["Your Feed"], "Global Feed"));
      feed("Global Feed")().click();
      await wait(assertFeeds("Your Feed", ["Global Feed"]));
    });

    it("toggle tag feed when active", async () => {
      const someTag = await waitForElement(() => tag(0));
      const text = someTag.textContent;
      someTag.click();
      await wait(assertFeeds("Your Feed", "Global Feed", [text]));
      feed("Global Feed")().click();
      await wait(assertFeeds("Your Feed", ["Global Feed"]));
    });

    it("paginate articles", async function() {
      await goToFeed("Global Feed");
      await wait(assertActivePage("1"));
      page("2").click();
      await wait(assertActivePage("2"));
    });

    it("favorite/unfavorite articles", async function() {
      await goToFeed("Global Feed");
      const counter = await waitForElement(unfavorited);
      const count = Number(counter.textContent);
      counter.click();
      await wait(() => {
        assert.ok(isFavorited(counter));
        assert.deepStrictEqual(Number(counter.textContent), count + 1);
      });
      counter.click();
      await wait(() => {
        assert.ok(isUnfavorited(counter));
        assert.deepStrictEqual(Number(counter.textContent), count);
      });
    });
  });
  context("guest", function() {
    beforeEach(init);
    it("show active global feed with 10 articles", async function() {
      await wait(assertFeeds(["Global Feed"]));
      await wait(assertArticleCount(10));
    });
  });
});
