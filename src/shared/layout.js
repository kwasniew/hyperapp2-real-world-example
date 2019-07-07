import { html } from "../html.js";
import {
  pages,
  profile,
  HOME,
  LOGIN,
  REGISTER,
  NEW_EDITOR,
  SETTINGS
} from "./pages.js";
import cc from "../web_modules/classcat.js";

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
    ${NavItem(
      { page, path: profile(user.name) },
      html`
        ${user.image
          ? html`
              <img src="${user.image}" class="user-pic" alt="${user.name}" />
            `
          : ""}
        ${user.name}
      `
    )}
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
        <a class="navbar-brand" href="${HOME}">
          conduit
        </a>
        ${user ? UserView({ page, user }) : AnonymousView({ page })}
      </div>
    </nav>
  `;

export const view = state =>
  console.log(JSON.stringify(state, null, 4)) ||
  html`
    <div>
      ${Header({ page: state.page, user: state.user })}
      ${pages[state.page](state)}
    </div>
  `;
