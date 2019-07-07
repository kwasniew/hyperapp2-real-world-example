import { HomePage } from "../home/HomePage.js";
import { registerPage } from "../register/view.js";
import { LoadHomePage } from "../home/actions.js";
import { LoadLoginPage, LoadRegisterPage } from "../auth/actions.js";
import { LoginPage } from "../auth/LoginPage.js";
import { RegisterPage } from "../auth/RegisterPage.js";

// export const pages = {
//   "/": homePage,
//   "/login": "login",
//   "/register": registerPage,
//   "/settings": "settings",
//   "/editor/:slug": "editor",
//   "/article/:slug": "article",
//   "/profile/:username": "userProfile",
//   "/profile/:username/favorited": "favoriteProfile",
//   "*": homePage
// };

export const HOME = "/";
export const LOGIN = "/login";
export const REGISTER = "/register";
export const SETTINGS = "/settings";
export const NEW_EDITOR = "/editor";
export const EDITOR = "/editor/:slug";
export const ARTICLE = "/article/:slug";
export const PROFILE = "/profile/:username";
export const PROFILE_FAVORITED = "/profile/:username/favorited";

export const pages = {
  [HOME]: HomePage,
  [LOGIN]: LoginPage,
  [REGISTER]: RegisterPage,
  [NEW_EDITOR]: registerPage,
  [SETTINGS]: registerPage
};

export const routes = {
  [HOME]: LoadHomePage(HOME),
  [LOGIN]: LoadLoginPage(LOGIN),
  [REGISTER]: LoadRegisterPage(REGISTER)
};

export const article = slug => ARTICLE.replace(":slug", slug);
export const profile = username => PROFILE.replace(":username", username);
