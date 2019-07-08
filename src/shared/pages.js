import { HomePage } from "../home/index.js";
import { LoadHomePage } from "../home/index.js";
import {
  LoadLoginPage,
  LoadRegisterPage,
  LoginPage,
  RegisterPage
} from "../auth/index.js";
import { SettingsPage } from "../settings/SettingsPage.js";
import { LoadSettingsPage } from "../settings/actions.js";

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
  [SETTINGS]: SettingsPage
  // "*": HomePage
};

export const routes = {
  [HOME]: LoadHomePage(HOME),
  [LOGIN]: LoadLoginPage(LOGIN),
  [REGISTER]: LoadRegisterPage(REGISTER),
  [SETTINGS]: LoadSettingsPage(SETTINGS)
  // "*": LoadHomePage(HOME)
};

export const article = slug => ARTICLE.replace(":slug", slug);
export const profile = username => PROFILE.replace(":username", username);
