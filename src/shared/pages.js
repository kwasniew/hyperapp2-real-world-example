import { homePage } from "../home/view.js";
import { registerPage } from "../register/view.js";

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
    [HOME]: homePage,
    [LOGIN]: registerPage,
    [REGISTER]: registerPage
};



