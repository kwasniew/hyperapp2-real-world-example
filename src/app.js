import { app } from "./web_modules/hyperapp.js";
import { RoutePages } from "./lib/router.js";
import { view } from "./pages/layout.js";
import { routes } from "./pages/index.js";
import { ReadUser } from "./pages/fragments/user.js";
// import logger from "./web_modules/hyperapp-v2-basiclogger.js";

const initialState = { user: {} };

export const init = () =>
  app({
    init: () => [initialState, ReadUser, RoutePages({ routes })],
    view,
    node: document.getElementById("app")
    // middleware: logger
  });
