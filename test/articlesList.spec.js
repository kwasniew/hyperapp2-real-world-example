import assert from "assert";
import jsdom from "./jsdom.setup.js";
import "./polly.setup.js";
import { wait, waitForElement, getByPlaceholderText, getByText } from "@testing-library/dom";
import { init } from "../src/app.js";
import globalFeed from "./fixtures/global.json";

const element = name => document.querySelector(`[data-test=${name}]`);
const elements = name => document.querySelectorAll(`[data-test=${name}]`);
const feed = feedName => getByText(element("feeds"), feedName);
const assertFeedActive = feedName => assert.ok(Array.from(feed(feedName).classList).includes("active"));
const assertFeedInactive = feedName => assert.ok(!Array.from(feed(feedName).classList).includes("active"));
const assertFeeds = (...feeds) => {
  assert.deepStrictEqual(elements("feed").length, feeds.length);
  feeds.map(feed => {
    Array.isArray(feed) ? assertFeedActive(feed[0]) : assertFeedInactive(feed);
  });
};

describe("articles", function() {
  beforeEach(function() {
    jsdom.beforeEach();
  });
  context("anonymous user", function() {
    it("show active global feed with 10 articles", async function() {
      init();

      return wait(
        () => {
          assertFeeds(["Global Feed"]);
          assert.deepStrictEqual(document.querySelectorAll(".article-preview").length, 10);
        },
        { timeout: 1500 }
      );
    });

    it("favorite/unfavorite articles", async function() {
      const { server } = this.polly;
      server.get("https://conduit.productionready.io/api/articles?limit=10&offset=0").intercept((req, res) => {
        res.status(200).json(globalFeed);
      });
      init();
      return wait(
        () => {
          assert.deepStrictEqual(document.querySelectorAll(".article-preview").length, 2);
        },
        { timeout: 1500 }
      );
    });
  });
});
