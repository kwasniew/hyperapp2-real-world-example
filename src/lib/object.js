export const fromEntries =
  Object.fromEntries || ((arr) => Object.assign({}, ...Array.from(arr, ([k, v]) => ({ [k]: v }))));
