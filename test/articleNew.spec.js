import jsdom from "./jsdom.setup.js";
import "./polly.setup.js";
import { fireEvent, waitForElement, wait, getByText } from "@testing-library/dom";
import { init } from "../src/app.js";
import { login } from "./login.js";
import { pageElement, element } from "./selectors.js";
import assert from "assert";

// TODO: move this wait before action pattern to other places
const typeIntoField = name => async text => {
  const element = await waitForElement(() => pageElement(name));
  element.value = text;
  fireEvent.input(element);
  return element;
};

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

const homePage = async () => {
  return await wait(() => {
    assert.deepStrictEqual(window.location.pathname, "/");
  });
};

describe("new article", function() {
  beforeEach(async function() {
    jsdom.beforeEach("/#!/editor");
    await login();
    init();
  });

  it("create", async () => {
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

  // TODO: Update
});
