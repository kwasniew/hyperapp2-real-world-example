import { LoadHomePage, HomePage } from "../home/index.js";
import {
  LoadLoginPage,
  LoadRegisterPage,
  LoginPage,
  RegisterPage
} from "../auth/index.js";
import { LoadSettingsPage, SettingsPage } from "../settings/index.js";
import {
  EditorPage,
  LoadNewEditorPage,
  LoadEditorPage
} from "../editor/index.js";
import { ArticlePage, LoadArticlePage } from "../article/index.js";
import { LoadProfilePage, LoadProfileFavoritedPage, ProfilePage } from "../profile/index.js";

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
  [SETTINGS]: SettingsPage,
  [NEW_EDITOR]: EditorPage,
  [EDITOR]: EditorPage,
  [ARTICLE]: ArticlePage,
  [PROFILE]: ProfilePage,
  [PROFILE_FAVORITED]: ProfilePage
  // "*": HomePage
};

export const routes = {
  [HOME]: LoadHomePage(HOME),
  [LOGIN]: LoadLoginPage(LOGIN),
  [REGISTER]: LoadRegisterPage(REGISTER),
  [SETTINGS]: LoadSettingsPage(SETTINGS),
  [NEW_EDITOR]: LoadNewEditorPage(NEW_EDITOR),
  [EDITOR]: LoadEditorPage(EDITOR),
  [ARTICLE]: LoadArticlePage(ARTICLE),
  [PROFILE]: LoadProfilePage(PROFILE),
  [PROFILE_FAVORITED]: LoadProfileFavoritedPage(PROFILE_FAVORITED)
  // "*": LoadHomePage(HOME)
};

export const article = slug => ARTICLE.replace(":slug", slug);
export const profile = username => PROFILE.replace(":username", username);
export const profileFavorited = username => PROFILE_FAVORITED.replace(":username", username);
export const editor = slug => EDITOR.replace(":slug", slug);
