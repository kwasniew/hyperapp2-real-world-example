import { html } from "../shared/html.js";
import { pages } from "./index.js";
import cc from "../web_modules/classcat.js";
import {
  HOME,
  LOGIN,
  NEW_EDITOR,
  REGISTER,
  SETTINGS,
  profile
} from "./links.js";

// Views
const NavItem = ({ page, path }, children) => html`
  <li class="nav-item">
    <a
      href="${path}"
      class="${cc({ "nav-link": true, active: page === path })}"
    >
      ${children}
    </a>
  </li>
`;

const UserImage = ({ user }) => html`
  <img src="${user.image}" class="user-pic" alt="${user.username}" />
`;

const UserLink = ({ user }) => html`
  ${user.image ? UserImage({ user }) : ""} ${user.username}
`;

const UserView = ({ page, user }) => html`
  <ul class="nav navbar-nav pull-xs-right">
    ${NavItem({ page, path: HOME }, "Home")}
    ${NavItem(
      { page, path: NEW_EDITOR },
      html`
        <i class="ion-compose" /> New Post
      `
    )}
    ${NavItem(
      { page, path: SETTINGS },
      html`
        <i class="ion-gear-a" /> Settings
      `
    )}
    ${NavItem({ page, path: profile(user.username) }, UserLink({ user }))}
  </ul>
`;

const AnonymousView = ({ page }) => html`
  <ul class="nav navbar-nav pull-xs-right">
    ${NavItem({ page, path: HOME }, "Home")}
    ${NavItem({ page, path: LOGIN }, "Sign in")}
    ${NavItem({ page, path: REGISTER }, "Sign up")}
  </ul>
`;

const Header = ({ page, user }) =>
  html`
    <nav class="navbar navbar-light">
      <div class="container">
        <a class="navbar-brand" href=${HOME}>
          conduit
        </a>
        ${user.token ? UserView({ page, user }) : AnonymousView({ page })}
      </div>
    </nav>
  `;

export const view = state => html`
  <div>
    ${Header({ page: state.page, user: state.user })}
    ${state.page ? pages[state.page](state) : ""}
  </div>
`;
