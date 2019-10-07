import assert from "assert";
import jsdom from "./jsdom.setup.js";
import "./polly.setup.js";
import { wait, waitForElement, getByPlaceholderText, getByText } from "@testing-library/dom";
import { init } from "../src/app.js";
import globalFeed from "./fixtures/global.json";
import fetch from "node-fetch";

const element = (container) => name => container.querySelector(`[data-test=${name}]`);
const pageElement = element(document);
const elements = container => name => container.querySelectorAll(`[data-test=${name}]`);
const pageElements = elements(document);
const feed = feedName => getByText(pageElement("feeds"), feedName);
const assertFeedActive = feedName => assert.ok(hasClass(feed(feedName))("active"));
const assertFeedInactive = feedName => assert.ok(!hasClass(feed(feedName))("active"));
const assertFeeds = (...feeds) => {
  assert.deepStrictEqual(pageElements("feed").length, feeds.length);
  feeds.map(feed => {
    Array.isArray(feed) ? assertFeedActive(feed[0]) : assertFeedInactive(feed);
  });
};
const article = index => pageElements("article")[index];
const activePage = () => document.querySelector(".active .page-link");
const page = label => getByText(document.querySelector(".pagination"), label);
const tag = (index) => pageElements("tag")[index];
const tags = (container) => Array.from(elements(container)("tag")).map(x => x.textContent);
const hasClass = element => className => Array.from(element.classList).includes(className);
const isFavorited = element => hasClass(element)("favorited");
const isUnfavorited = element => hasClass(element)("unfavorited");

const apiUrl = "https://conduit.productionready.io/api";

async function login({ email = "testingwithcypress@gmail.com", password = "testingwithcypress" } = {}) {
  const res = await fetch(`${apiUrl}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user: {
        email,
        password
      }
    })
  });
  const body = await res.json();
  localStorage.setItem("session", JSON.stringify(body.user));
}

describe("articles", function() {
  beforeEach(function() {
    jsdom.beforeEach();
  });
  context("stubbed response", function() {
    beforeEach(function() {
      const { server } = this.polly;
      server.get(`${apiUrl}/articles?limit=10&offset=0`).intercept((req, res) => {
        res.status(200).json(globalFeed);
      });
      init();
    });
    it("provide articles preview", () => {
      return wait(
        () => {
          const article0 = element(article(0));
          assert.deepStrictEqual(article0("title").textContent, "Unfavorited Article Title");
          assert.deepStrictEqual(article0("description").textContent, "Unfavorited Article Description");
          assert.deepStrictEqual(tags(article(0)), ["tag1", "tag2"]);
          assert.deepStrictEqual(article0("date").textContent, "Fri Jul 12 2019");
          assert.deepStrictEqual(article0("avatar").src, "https://static.productionready.io/images/smiley-cyrus.jpg");

          const article1 = element(article(1));
          assert.deepStrictEqual(article1("title").textContent, "Favorited Article Title");
          assert.deepStrictEqual(article1("description").textContent, "Favorited Article Description");
          assert.deepStrictEqual(tags(article(1)), ["tag3"]);
          assert.deepStrictEqual(article1("date").textContent, "Sat Jul 13 2019");
          assert.deepStrictEqual(article1("avatar").src, "https://dummyimage.com/100x100/f01818/ffffff&text=+boom");
        }
      );
    });

  });
  context("logged-in", function() {
    beforeEach(async function() {
      await login();
      init();
    });
    it("switch your and global feed", async () => {
      await wait(() => {
        assertFeeds(["Your Feed"], "Global Feed");
      });
      feed("Global Feed").click();
      await wait(() => {
        assertFeeds("Your Feed", ["Global Feed"]);
      });

    });

    it("toggle tag feed when active", async () => {
      const someTag = await waitForElement(() => tag(0));
      const text = someTag.textContent;
      someTag.click();
      await wait(() => {
        assertFeeds("Your Feed", "Global Feed", [text]);
      });
      feed("Global Feed").click();
      await wait(() => {
        assertFeeds("Your Feed", ["Global Feed"]);
      });
    });

    it("paginate articles", async function() {
      const link = await waitForElement(() => feed("Global Feed"));
      link.click();
      await wait(() => {
        assert.deepStrictEqual(activePage().textContent, "1");
      });
      page("2").click();
      await wait(() => {
        assert.deepStrictEqual(activePage().textContent, "2");
      });
    });

    it("favorite/unfavorite articles", async function() {
      const link = await waitForElement(() => feed("Global Feed"));
      link.click();
      const counter = await waitForElement(
        () => document.querySelector(".unfavorited")
      );
      const count = Number(counter.textContent);
      counter.click();
      await wait(
        () => {
          assert.ok(isFavorited(counter));
          assert.deepStrictEqual(Number(counter.textContent), count + 1);
        }
      );
      counter.click();
      await wait(
        () => {
          assert.ok(isUnfavorited(counter));
          assert.deepStrictEqual(Number(counter.textContent), count);
        }
      );
    });
  });
  context("guest", function() {
    beforeEach(async function() {
      init();
    });
    it("show active global feed with 10 articles", async function() {
      return wait(
        () => {
          assertFeeds(["Global Feed"]);
          assert.deepStrictEqual(document.querySelectorAll(".article-preview").length, 10);
        }
      );
    });
  });
});
