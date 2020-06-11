import { app } from "hyperapp";
import { RoutePages } from "./lib/router.js";
import { view } from "./pages/layout.js";
import { routes } from "./pages/index.js";
import { ReadUser } from "./pages/fragments/user.js";
// import logger from "hyperapp-v2-basiclogger";

const initialState = { user: {} };

export const init = () =>
  app({
    init: () => [initialState, ReadUser, RoutePages({ routes })],
    view,
    node: document.getElementById("app"),
    // middleware: logger
  });
