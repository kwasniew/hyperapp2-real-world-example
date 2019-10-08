export const element = container => name => container.querySelector(`[data-test=${name}]`);
export const pageElement = element(document);
export const elements = container => name => container.querySelectorAll(`[data-test=${name}]`);
export const pageElements = elements(document);
