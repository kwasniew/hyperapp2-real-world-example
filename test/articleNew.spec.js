import jsdom from "./jsdom.setup.js";
import "./polly.setup.js";
import { fireEvent, waitForElement, wait, getByText } from "@testing-library/dom";
import { init } from "../src/app.js";
import { login, createArticle } from "./apiClient.js";
import { pageElement, element } from "./selectors.js";
import {goToFeed, homePage} from "./homePage.js";
import assert from "assert";
import {typeIntoField} from "./actions.js";
import { articles, assertFeeds } from "./homePage";
import {assertElementValue} from "./assertions";

const enterTag = async name => {
  const tagInput = await typeIntoField("tags")(name);
  fireEvent.keyUp(tagInput, { key: "Enter", keyCode: 13 });
  await wait(() => assert.deepStrictEqual(tagInput.value, ""));
};

const tags = () => document.querySelectorAll(".tag-pill");

const deleteTag = async name => {
  const tagPill = await waitForElement(() => getByText(document.querySelector(".tag-list"), name));
  element(tagPill)("remove-tag").click();
};

const assertTags = async (...names) => {
  await wait(() => {
    const tagNames = Array.from(tags()).map(tag => tag.textContent);
    assert.deepStrictEqual(tagNames, names);
    assert.deepStrictEqual(tags().length, names.length);
  });
};

const publish = async () => {
  const publishButton = await waitForElement(() => getByText(document.body, "Publish Article"));
  publishButton.click();
};


describe("article", function() {
  let token;

  beforeEach(async function() {
    jsdom.beforeEach("/#!/editor");
    ({token} = await login());
    init();
  });

  it("create article", async () => {
    jsdom.beforeEach("/#!/editor");
    await login();
    init();

    await typeIntoField("title")("JS microlibs");
    await typeIntoField("description")("This is article about using microlibs");
    await typeIntoField("body")("# Title\n## Header\nAvoid bloated JS frameworks");
    await enterTag("javascript");
    await enterTag("mistake");
    await enterTag("frameworks");
    await assertTags("javascript", "mistake", "frameworks");
    await deleteTag("mistake");
    await assertTags("javascript", "frameworks");
    await publish();
    await homePage();
  });

  it("edit article", async () => {
    jsdom.beforeEach("/#!/editor");
    ({token} = await login());
    const article = await createArticle(token)({title: "some title", description: "some description", body: "some body", tagList: ["tag1", "tag2"]});
    const slug = article.slug;
    location.href = `/#!/editor/${slug}`;
    init();

    await wait(assertElementValue("title")("some title"));
    await wait(assertElementValue("description")("some description"));
    await wait(assertElementValue("body")("some body"));
    // assert.deepStrictEqual(tags(), ["tag1", "tag2"]);
    // todo: extract shared tags assertions
  });

  // TODO: edit read, update, create failure
});
