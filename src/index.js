import { app } from "./web_modules/hyperapp.js";
import { RoutePages } from "./shared/lib/Router.js";
import { view } from "./shared/view.js";
import { routes } from "./shared/pages.js";
import {ReadUser} from "./auth/index.js";

const initialState = {
  // user: {
  //   image:
  //     "https://s3.amazonaws.com/uifaces/faces/twitter/marcoramires/128.jpg",
  //   name: "matt"
  // },
  user: null
};

app({
  init: () => [initialState, ReadUser, RoutePages({ routes })],
  view,
  node: document.getElementById("app")
});
