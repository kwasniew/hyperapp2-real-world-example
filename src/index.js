import { app } from "./web_modules/hyperapp.js";
import { html } from "./html.js";
import {RoutePages} from "./Router.js";
import {mapValues, arrayToObject} from "./object.js";
import {view} from "./shared/layout.js";
import {pages} from "./shared/pages.js";

const initialState = {
  page: "/"
};

const SetPage = page => (state, params) => ({ ...state, page });
// const routes = mapValues(SetPage)(pages);
const routes = arrayToObject(SetPage)(Object.keys(pages));


app({
  init: () => [initialState],
  view,
  subscriptions: state => [RoutePages({ routes })],
  node: document.getElementById("app")
});
