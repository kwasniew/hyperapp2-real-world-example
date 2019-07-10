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
import {
  LoadProfilePage,
  LoadProfileFavoritedPage,
  ProfilePage
} from "../profile/index.js";

export const HOME = "/";
export const LOGIN = "/login";
export const REGISTER = "/register";
export const SETTINGS = "/settings";
export const NEW_EDITOR = "/editor";
export const EDITOR = "/editor/:slug";
export const ARTICLE = "/article/:slug";
export const PROFILE = "/profile/:username";
export const PROFILE_FAVORITED = "/profile/:username/favorited";

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

export const pages = Object.fromEntries(pageStructure);
export const routes = Object.fromEntries(pageStructure.map(([path, _, initAction]) => [path, initAction(path)]));

export const article = slug => ARTICLE.replace(":slug", slug);
export const profile = username => PROFILE.replace(":username", username);
export const profileFavorited = username => PROFILE_FAVORITED.replace(":username", username);
export const editor = slug => EDITOR.replace(":slug", slug);
