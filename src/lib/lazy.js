// const { HomePage, LoadHomePage } = lazy(() => import("../pages/home.js"));
// HomePage(html`<div>Loading</div>`) - presence of an argument makes it a view function. Always returns sync value with either a preloaded view or a placeholder
// LoadHomePage() - absence of arguments makes it a lazy action that always returns a promise
export const lazy = loader => {
  let loadedModule;
  const lazyActionOrView = name => placeholder => {
    if (typeof placeholder !== "undefined") {
      // view
      return loadedModule ? loadedModule[name] : () => placeholder;
    }
    // action
    if (loadedModule) {
      return Promise.resolve(loadedModule[name]);
    }

    return loader().then(module => {
      loadedModule = module;
      return module[name];
    });
  };
  return new Proxy(
    {},
    {
      get(_, name) {
        return lazyActionOrView(name);
      }
    }
  );
};
