import assert from "assert";
import { pageElement } from "./selectors";

export const assertElementValue = name => value => () => {
  assert.deepStrictEqual(pageElement(name).value, value);
};