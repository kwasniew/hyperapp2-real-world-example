import { app } from "./web_modules/hyperapp.js";
import { html } from "./html.js";
import {RoutePages} from "./routerSubscription.js";
import {mapValues} from "./object.js";

const initialState = {
  page: "home"
};

const pages = {
  "/": "home",
  "/login": "login",
  "/register": "register",
  "/settings": "settings",
  "/editor/:slug": "editor",
  "/article/:slug": "article",
  "/profile/:username": "userProfile",
  "/profile/:username/favorited": "favoriteProfile",
  "*": "home"
};

const SetPage = page => (state, params) => ({ ...state, page });
const routes = mapValues(SetPage)(pages);


app({
  init: () => [initialState],
  view: state =>
    html`
      <div>${state.page} <a href="/register">register</a></div>
    `,
  subscriptions: state => [RoutePages({ routes })],
  node: document.getElementById("app")
});
