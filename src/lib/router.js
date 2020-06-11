import page from "page";
import { fromEntries } from "./object.js";

const router = (dispatch, { routes }) => {
  const normalizedRoutes = normalize(routes);
  const paths = Object.keys(normalizedRoutes);
  paths.forEach((path) => {
    const route = normalizedRoutes[path];
    page(path, (context) => {
      dispatch(route, context.params);
    });
  });

  page.start();

  return () => {
    page.stop();
  };
};

const normalize = (routes) => fromEntries(routes.map(([path, pageAction]) => [path, pageAction(path)]));

export const RoutePages = ({ routes, lazy }) => [router, { routes, lazy }];

const redirectEffect = (dispatch, props) => page.redirect(props.path);
export const Redirect = (props) => [redirectEffect, props];
export const RedirectAction = (path) => (state) => [state, Redirect({ path })];
