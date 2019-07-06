import { app } from "./web_modules/hyperapp.js";
import { html } from "./html.js";

const initialState = {
    page: 'home'
};

app({
  init: () => [initialState],
  view: state => html`<div>${state.page}</div>`,
  node: document.getElementById("app")
});
