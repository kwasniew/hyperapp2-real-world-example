import Page from "../web_modules/page.js";
import { fromEntries } from "./object.js";

let page = Page.create();
const router = (dispatch, { routes }) => {
  const normalized = normalize(routes);
  page = Page.create();
  const paths = Object.keys(normalized);
  paths.forEach(path => {
    const route = normalized[path];
    page(path, context => {
      if (route.length === 0) {
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

const normalize = routes =>
  fromEntries(
    routes.map(([path, pageAction]) => {
      if (pageAction.name === "lazy") {
        return [path, () => pageAction().then(action => action(path))];
      } else {
        return [path, pageAction(path)];
      }
    })
  );

export const RoutePages = ({ routes }) => [router, { routes }];

const redirectEffect = (dispatch, props) => page.redirect(props.path);
export const Redirect = props => [redirectEffect, props];
export const RedirectAction = path => state => [state, Redirect({ path })];
