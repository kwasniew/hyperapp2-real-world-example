import jsdom from "./jsdom.setup.js";
import "./polly.setup.js";
import { fireEvent, waitForElement, wait, getByText } from "@testing-library/dom";
import { init } from "../src/app.js";
import { login, createArticle, readArticle } from "./apiClient.js";
import { pageElement, element } from "./selectors.js";
import { homePage } from "./homePage.js";
import assert from "assert";
import { typeIntoField } from "./actions.js";
import { assertElementValue } from "./assertions";

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
  return await wait(() => {
    const tagNames = Array.from(tags()).map(tag => tag.textContent);
    assert.deepStrictEqual(tagNames, names);
    assert.deepStrictEqual(tags().length, names.length);
  });
};

const publish = async () => {
  const publishButton = await waitForElement(() => getByText(document.body, "Publish Article"));
  publishButton.click();
};

const assertErrorMessages = async (...messages) => {
  return wait(() => {
    const errorMessages = Array.from(document.querySelectorAll(".error-messages li"));
    assert.deepStrictEqual(errorMessages.map(element => element.textContent), messages);
  });
};

const apiUrl = "https://conduit.productionready.io/api";

describe("article", function() {
  let token;

  beforeEach(async function() {
    jsdom.beforeEach("/#!/editor");
    ({ token } = await login());
    init();
  });

  it("create article", async function() {
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
    ({ token } = await login());
    const article = await createArticle(token)({
      title: "some title",
      description: "some description",
      body: "some body",
      tagList: ["tag1", "tag2"]
    });
    const slug = article.slug;
    location.href = `/#!/editor/${slug}`;
    init();

    await wait(assertElementValue("title")("some title"));
    await wait(assertElementValue("description")("some description"));
    await wait(assertElementValue("body")("some body"));
    await assertTags("tag2", "tag1");

    await typeIntoField("title")("some title updated");
    await typeIntoField("description")("some description updated");
    await typeIntoField("body")("some body updated");
    await deleteTag("tag2");
    await enterTag("tag3");
    await publish();
    await homePage();

    const savedArticle = await readArticle(token)(slug);
    assert.deepStrictEqual(savedArticle.title, "some title updated");
    assert.deepStrictEqual(savedArticle.description, "some description updated");
    assert.deepStrictEqual(savedArticle.body, "some body updated");
    assert.deepStrictEqual(savedArticle.tagList, ["tag3", "tag1"]);
  });

  it("create article failure", async function() {
    jsdom.beforeEach("/#!/editor");
    await login();
    init();

    await publish();
    await assertErrorMessages(
      "title can't be blank and is too short (minimum is 1 character)",
      "body can't be blank",
      "description can't be blank and is too short (minimum is 1 character)"
    );
  });
});
