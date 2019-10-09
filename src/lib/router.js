import Page from "../web_modules/page.js";
import { fromEntries } from "./object.js";

let page;
const router = (dispatch, { routes, lazy }) => {
  page = Page.create();
  const normalizedRoutes = normalize(lazy)(routes);
  const paths = Object.keys(normalizedRoutes);
  paths.forEach(path => {
    const route = normalizedRoutes[path];
    page(path, context => {
      if (lazy) {
        route().then(lazyRoute => dispatch(lazyRoute, context.params));
      } else {
        dispatch(route, context.params);
      }
    });
  });

  page.start({ hashbang: true });

  return () => {
    page.stop();
  };
};

const normalize = lazy => routes =>
  fromEntries(
    routes.map(([path, pageAction]) => {
      if (lazy) {
        return [path, () => pageAction().then(action => action(path))];
      } else {
        return [path, pageAction(path)];
      }
    })
  );

export const RoutePages = ({ routes, lazy }) => [router, { routes, lazy }];

const redirectEffect = (dispatch, props) => page.redirect(props.path);
export const Redirect = props => [redirectEffect, props];
export const RedirectAction = path => state => [state, Redirect({ path })];
