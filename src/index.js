import { app } from "./web_modules/hyperapp.js";
import { RoutePages } from "./shared/lib/Router.js";
import { view } from "./shared/view.js";
import { routes } from "./shared/pages.js";
import {ReadUser} from "./shared/user/index.js";

const initialState = {
  user: null
};

app({
  init: () => [initialState, ReadUser, RoutePages({ routes })],
  view,
  node: document.getElementById("app")
});
