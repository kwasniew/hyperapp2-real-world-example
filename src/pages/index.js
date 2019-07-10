import {HomePage, LoadHomePage} from "../pages/home.js";
import {LoadLoginPage, LoadRegisterPage, LoginPage, RegisterPage} from "../pages/auth.js";
import {LoadSettingsPage, SettingsPage} from "../pages/settings.js";
import {EditorPage, LoadEditorPage, LoadNewEditorPage} from "../pages/editor.js";
import {ArticlePage, LoadArticlePage} from "../pages/article.js";
import {LoadProfileFavoritedPage, LoadProfilePage, ProfilePage} from "../pages/profile.js";
import {ARTICLE, EDITOR, HOME, LOGIN, NEW_EDITOR, PROFILE, PROFILE_FAVORITED, REGISTER, SETTINGS} from "./links.js";

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

