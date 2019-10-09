// import { HomePage, LoadHomePage } from "../pages/home.js";
// import { LoadLoginPage, LoadRegisterPage, LoginPage, RegisterPage } from "../pages/auth.js";
// import { LoadSettingsPage, SettingsPage } from "../pages/settings.js";
// import { EditorPage, LoadEditorPage, LoadNewEditorPage } from "../pages/editor.js";
// import { ArticlePage, LoadArticlePage } from "../pages/article.js";
// import { LoadProfileFavoritedPage, LoadProfilePage, ProfilePage } from "../pages/profile.js";
import { ARTICLE, EDITOR, HOME, LOGIN, NEW_EDITOR, PROFILE, PROFILE_FAVORITED, REGISTER, SETTINGS } from "./links.js";


const lazy = loader => {
  let loadedModule;
  const lazyActionOrView = name => placeholder => {
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
  };
  return new Proxy({}, {
    get(_, name) {
      return lazyActionOrView(name);
    }
  });
};
const { HomePage, LoadHomePage } = lazy(() => import("../pages/home.js"));
const {LoginPage, LoadLoginPage, RegisterPage, LoadRegisterPage} = lazy(() => import("../pages/auth.js"));
const {SettingsPage, LoadSettingsPage} = lazy(() => import("../pages/settings.js"));
const {EditorPage, LoadNewEditorPage, LoadEditorPage} = lazy(() => import("../pages/editor.js"));
const {ArticlePage, LoadArticlePage} = lazy(() => import("../pages/article.js"));
const {ProfilePage, LoadProfilePage, LoadProfileFavoritedPage} = lazy(() => import("../pages/profile.js"));


const pageStructure = [
  [HOME, HomePage, LoadHomePage],
  [LOGIN, LoginPage, LoadLoginPage],
  [REGISTER, RegisterPage, LoadRegisterPage],
  [SETTINGS, SettingsPage, LoadSettingsPage],
  [NEW_EDITOR, EditorPage, LoadNewEditorPage],
  [EDITOR, EditorPage, LoadEditorPage],
  [ARTICLE, ArticlePage, LoadArticlePage],
  [PROFILE, ProfilePage, LoadProfilePage],
  [PROFILE_FAVORITED, ProfilePage, LoadProfileFavoritedPage]
];

const fromEntries = Object.fromEntries || (arr => Object.assign({}, ...Array.from(arr, ([k, v]) => ({ [k]: v }))));
export const pages = fromEntries(pageStructure);
export const routes = fromEntries(pageStructure.map(([path, _, initAction]) => {
  // if (initAction.length === 0) {
  console.log(initAction);
    return [path, () => initAction().then(action => action(path))];
  // } else {
  //   return [path, initAction(path)];
  // }
}));
