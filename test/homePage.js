import { getByText, wait, waitForElement } from "@testing-library/dom";
import { elements, element, pageElement, pageElements, hasClass } from "./selectors";
import assert from "assert";

// selectors
export const feed = feedName => () => getByText(pageElement("feeds"), feedName);
export const articles = index => (typeof index !== "undefined" ? pageElements("article")[index] : pageElements("article"));
const activePage = () => document.querySelector(".active .page-link");
export const page = label => getByText(document.querySelector(".pagination"), label);
export const tag = index => pageElements("tag")[index];
export const tags = container => Array.from(elements(container)("tag")).map(x => x.textContent);
export const isFavorited = element => hasClass(element)("favorited");
export const isUnfavorited = element => hasClass(element)("unfavorited");
export const unfavorited = () => document.querySelector(".unfavorited");

// actions
export const goToFeed = async feedName => {
  const link = await waitForElement(feed(feedName));
  link.click();
};

export const openArticle = async (title) => {
  const article = await waitForElement(() => {
    const articles = pageElements("article");
    return Array.from(articles).find(article => element(article)("title").textContent === title);
  });
  getByText(article, "Read more...").click();
};

// assertions
export const assertFeedActive = feedName => assert.ok(hasClass(feed(feedName)())("active"));
export const assertFeedInactive = feedName => assert.ok(!hasClass(feed(feedName)())("active"));
export const assertFeeds = (...feeds) => () => {
  assert.deepStrictEqual(pageElements("feed").length, feeds.length);
  feeds.map(feed => {
    Array.isArray(feed) ? assertFeedActive(feed[0]) : assertFeedInactive(feed);
  });
};
export const assertArticleCount = number => () => {
  assert.deepStrictEqual(articles().length, number);
};
export const assertActivePage = label => () => {
  assert.deepStrictEqual(activePage().textContent, label);
};
export const homePage = async () => {
  return await wait(() => {
    assert.deepStrictEqual(window.location.pathname, "/");
    assert.deepStrictEqual(window.location.hash, "");
  });
};
