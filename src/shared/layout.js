import { html } from "../html.js";
import {pages} from "./pages.js";


const header = (page, user) =>
  html`
    <nav class="navbar navbar-light">
      NAV
    </nav>
  `;

export const view = state => html`
  <div>
    ${header()} ${pages[state.page](state)}
  </div>
`;
