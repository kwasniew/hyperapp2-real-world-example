import { app } from "./web_modules/hyperapp.js";
import { html } from "./html.js";
import {RoutePages} from "./Router.js";
import {mapValues, arrayToObject} from "./object.js";
import {homePage} from "./home/view.js";
import {registerPage} from "./register/view.js";

const initialState = {
  page: "/"
};

const pages = {
  "/": homePage,
  "/login": "login",
  "/register": registerPage,
  "/settings": "settings",
  "/editor/:slug": "editor",
  "/article/:slug": "article",
  "/profile/:username": "userProfile",
  "/profile/:username/favorited": "favoriteProfile",
  "*": homePage
};

const SetPage = page => (state, params) => ({ ...state, page });
// const routes = mapValues(SetPage)(pages);
const routes = arrayToObject(SetPage)(Object.keys(pages));


app({
  init: () => [initialState],
  view: state => pages[state.page](state),
  subscriptions: state => [RoutePages({ routes })],
  node: document.getElementById("app")
});
