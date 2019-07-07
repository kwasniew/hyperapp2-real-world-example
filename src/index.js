import { app } from "./web_modules/hyperapp.js";
import { RoutePages } from "./routing/Router.js";
import { view } from "./shared/view.js";
import { routes } from "./routing/pages.js";

const initialState = {
  // user: {
  //   image:
  //     "https://s3.amazonaws.com/uifaces/faces/twitter/marcoramires/128.jpg",
  //   name: "matt"
  // },
  user: null
};

app({
  init: () => [initialState],
  view,
  subscriptions: state => [RoutePages({ routes })],
  node: document.getElementById("app")
});
