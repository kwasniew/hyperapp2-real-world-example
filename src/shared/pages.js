import {homePage} from "../home/view.js";
import {registerPage} from "../register/view.js";

export const pages = {
    "/": homePage,
    "/login": "login",
    "/register": registerPage,
    "/settings": "settings",
    "/editor/:slug": "editor",
    "/article/:slug": "article",
    "/profile/:username": "userProfile",
    "/profile/:username/favorited": "favoriteProfile",
    "*": homePage
};