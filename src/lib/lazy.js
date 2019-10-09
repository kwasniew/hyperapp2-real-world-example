export const lazy = loader => {
  let loadedModule;
  const lazyActionOrView = function(name) {
    return function lazy(placeholder) {
      if(typeof placeholder !== "undefined") {
        // view
        return loadedModule ? loadedModule[name] : () => placeholder;
      }
      // action
      if(loadedModule) {
        return Promise.resolve(loadedModule[name]);
      }

      return loader().then(module => {
        loadedModule = module;
        return module[name];
      });

    }
  };
  return new Proxy({}, {
    get(_, name) {
      return lazyActionOrView(name);
    }
  });
};