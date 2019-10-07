import assert from "assert";
import jsdom from "./jsdom.setup.js";
import "./polly.setup.js";
import { wait, waitForElement, getByPlaceholderText, getByText } from "@testing-library/dom";
import { init } from "../src/app.js";
import globalFeed from "./fixtures/global.json";
import fetch from "node-fetch";

const element = (name, container = document) => container.querySelector(`[data-test=${name}]`);
const elements = (name, container = document) => container.querySelectorAll(`[data-test=${name}]`);
const feed = feedName => getByText(element("feeds"), feedName);
const assertFeedActive = feedName => assert.ok(Array.from(feed(feedName).classList).includes("active"));
const assertFeedInactive = feedName => assert.ok(!Array.from(feed(feedName).classList).includes("active"));
const assertFeeds = (...feeds) => {
  assert.deepStrictEqual(elements("feed").length, feeds.length);
  feeds.map(feed => {
    Array.isArray(feed) ? assertFeedActive(feed[0]) : assertFeedInactive(feed);
  });
};
const article = index => elements("article")[index];
const unfavorited = element => Array.from(element.classList).includes("unfavorited");
const favorited = element => Array.from(element.classList).includes("favorited");
const activePage = () => document.querySelector(".active .page-link");
const page = label => getByText(document.querySelector(".pagination"), label);
const tag = (index) => elements("tag")[index];


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
  context("logged-in", function() {
    beforeEach(async function() {
      await login();
    });
    it("favorite/unfavorite articles", async function() {
      const { server } = this.polly;
      server.get(`${apiUrl}/articles?limit=10&offset=0`).intercept((req, res) => {
        res.status(200).json(globalFeed);
      });
      init();
      const link = await waitForElement(() => feed("Global Feed"), { timeout: 1500 });
      link.click();

      await wait(
        () => {
          assert.deepStrictEqual(document.querySelectorAll(".article-preview").length, 2);
        },
        { timeout: 1500 }
      );

      const button1 = element("favorite-count", article(0));
      const button2 = element("favorite-count", article(1));
      assert.ok(unfavorited(button1));
      assert.ok(favorited(button2));
    });

    it("switch your and global feed", async () => {
      init();
      await wait(() => {
        assertFeeds(["Your Feed"], "Global Feed");
      }, {timeout: 1500});
      feed("Global Feed").click();
      await wait(() => {
        assertFeeds("Your Feed", ["Global Feed"]);
      }, {timeout: 1500});

    });

    it("toggle tag feed when active", async () => {
      init();
      const firstTag = await waitForElement(() => {
        return tag(0)
      }, {timeout: 1500});
      const text = firstTag.text;
      firstTag.click();
      await wait(() => {
        assertFeeds("Your Feed", "Global Feed", [text]);
      }, {timeout: 1500});
      feed("Global Feed").click();
      await wait(() => {
        assertFeeds("Your Feed", ["Global Feed"]);
      }, {timeout: 1500});
    });

    it("paginate articles", async function() {
      init();
      const link = await waitForElement(() => feed("Global Feed"), { timeout: 1500 });
      link.click();
      const currentPage = await waitForElement(() => activePage(), { timeout: 1500 });

      page("2").click();
      await wait(() => {
        assert.deepStrictEqual(activePage().text, "2");
      }, {timeout: 1500});
    });
  });
  context("guest", function() {
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
  });
});
