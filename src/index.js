import { app } from "./web_modules/hyperapp.js";
import { RoutePages } from "./routing/Router.js";
import { arrayToObject } from "./shared/object.js";
import { view } from "./shared/layout.js";
import { pages, HOME } from "./routing/pages.js";
import {FetchArticles} from "./home/actions.js";

const initialState = {
  page: HOME,
  user: {
    image:
      "https://s3.amazonaws.com/uifaces/faces/twitter/marcoramires/128.jpg",
    name: "matt"
  },
  isLoading: false
};

const SetPage = page => (state, params) => ({ ...state, page });
const routes = arrayToObject(SetPage)(Object.keys(pages));

app({
  init: () => [initialState, FetchArticles],
  view,
  subscriptions: state => [RoutePages({ routes })],
  node: document.getElementById("app")
});
