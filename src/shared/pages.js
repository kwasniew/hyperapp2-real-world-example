import { HomePage } from "../home/HomePage.js";
import { LoadHomePage } from "../home/actions.js";
import { LoadLoginPage, LoadRegisterPage } from "../auth/actions.js";
import { LoginPage } from "../auth/LoginPage.js";
import { RegisterPage } from "../auth/RegisterPage.js";

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
  // "*": HomePage
};

export const routes = {
  [HOME]: LoadHomePage(HOME),
  [LOGIN]: LoadLoginPage(LOGIN),
  [REGISTER]: LoadRegisterPage(REGISTER),
  // "*": LoadHomePage(HOME)
};

export const article = slug => ARTICLE.replace(":slug", slug);
export const profile = username => PROFILE.replace(":username", username);