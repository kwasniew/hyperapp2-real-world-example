import { html } from "../html.js";
import { pages, HOME } from "./pages.js";

const header = (page, user) =>
  html`
    <nav class="navbar navbar-light">
      <div class="container">
        <a class="navbar-brand" href="${HOME}">
          conduit
        </a>
      </div>
    </nav>
  `;

export const view = state => console.log(state) || html`
  <div>
    ${header()} ${pages[state.page](state)}
  </div>
`;
