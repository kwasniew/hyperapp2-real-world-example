import { HomePage, LoadHomePage } from "../pages/home.js";
import { LoginPage, LoadLoginPage, RegisterPage, LoadRegisterPage } from "../pages/auth.js";
import { SettingsPage, LoadSettingsPage } from "../pages/settings.js";
import { EditorPage, LoadNewEditorPage, LoadEditorPage } from "../pages/editor.js";
import { ArticlePage, LoadArticlePage } from "../pages/article.js";
import { ProfilePage, LoadProfilePage, LoadProfileFavoritedPage } from "../pages/profile.js";

import { ARTICLE, EDITOR, HOME, LOGIN, NEW_EDITOR, PROFILE, PROFILE_FAVORITED, REGISTER, SETTINGS } from "./links.js";
import { fromEntries } from "../lib/object.js";

const pageStructure = [
  [HOME, HomePage, LoadHomePage],
  [LOGIN, LoginPage, LoadLoginPage],
  [REGISTER, RegisterPage, LoadRegisterPage],
  [SETTINGS, SettingsPage, LoadSettingsPage],
  [NEW_EDITOR, EditorPage, LoadNewEditorPage],
  [EDITOR, EditorPage, LoadEditorPage],
  [ARTICLE, ArticlePage, LoadArticlePage],
  [PROFILE, ProfilePage, LoadProfilePage],
  [PROFILE_FAVORITED, ProfilePage, LoadProfileFavoritedPage],
];

export const pages = fromEntries(pageStructure);
export const routes = pageStructure.map(([path, _, initAction]) => {
  return [path, initAction];
});
