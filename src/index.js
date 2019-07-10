import { app } from "./web_modules/hyperapp.js";
import { RoutePages } from "./shared/lib/Router.js";
import { view } from "./shared/view.js";
import { routes } from "./pages/index.js";
import { ReadUser } from "./pages/fragments/auth.js";
import { logger } from "./shared/lib/logger.js";

const initialState = { user: {} };

app(
  {
    init: () => [initialState, ReadUser, RoutePages({ routes })],
    view,
    node: document.getElementById("app")
  },
  logger(true, console.log)
);
