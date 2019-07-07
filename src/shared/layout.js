import { html } from "../html.js";
import { pages, HOME, LOGIN, REGISTER } from "./pages.js";
import cc from "../web_modules/classcat.js";

const navItem = ({ page, path }, children) => html`
  <li class="nav-item">
    <a
      href="${path}"
      class="${cc({ "nav-link": true, active: page === path })}"
    >
      ${children}
    </a>
  </li>
`;

const userView = (page, user) => html`
  <ul class="nav navbar-nav pull-xs-right"></ul>
`;

const anonymousView = page => html`
  <ul class="nav navbar-nav pull-xs-right">
    ${navItem(
      { page, path: HOME },
      html`
        Home
      `
    )}
    ${navItem(
      { page, path: LOGIN },
      html`
        Sign In
      `
    )}
    ${navItem(
      { page, path: REGISTER },
      html`
        Sign Up
      `
    )}
  </ul>
`;

const header = (page, user) =>
  html`
    <nav class="navbar navbar-light">
      <div class="container">
        <a class="navbar-brand" href="${HOME}">
          conduit
        </a>
        ${user ? userView(page, user) : anonymousView(page)}
      </div>
    </nav>
  `;

export const view = state =>
  console.log(state) ||
  html`
    <div>
      ${header(state.page, state.user)} ${pages[state.page](state)}
    </div>
  `;
