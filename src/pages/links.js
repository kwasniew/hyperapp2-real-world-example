export const HOME = "/";
export const LOGIN = "/login";
export const REGISTER = "/register";
export const SETTINGS = "/settings";
export const NEW_EDITOR = "/editor";
export const EDITOR = "/editor/:slug";
export const ARTICLE = "/article/:slug";
export const PROFILE = "/profile/:username";
export const PROFILE_FAVORITED = "/profile/:username/favorited";

export const article = (slug) => ARTICLE.replace(":slug", slug);
export const profile = (username) => PROFILE.replace(":username", username);
export const profileFavorited = (username) => PROFILE_FAVORITED.replace(":username", username);
export const editor = (slug) => EDITOR.replace(":slug", slug);
