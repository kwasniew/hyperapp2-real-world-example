import { app } from "./web_modules/hyperapp.js";
import { RoutePages } from "./lib/Router.js";
import { view } from "./pages/layout.js";
import { routes } from "./pages/index.js";
import { ReadUser } from "./pages/fragments/user.js";
import { logger } from "./lib/logger.js";

const initialState = { user: {} };

app(
  {
    init: () => [initialState, ReadUser, RoutePages({ routes })],
    view,
    node: document.getElementById("app"),
    middleware: logger(console.log)
  }
);
