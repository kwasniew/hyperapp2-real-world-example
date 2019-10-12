import { fireEvent, waitForElement } from "@testing-library/dom";
import { pageElement } from "./selectors.js";

// TODO: move this wait before action pattern to other places
export const typeIntoField = name => async text => {
  const element = await waitForElement(() => pageElement(name));
  element.value = text;
  fireEvent.input(element);
  return element;
};
