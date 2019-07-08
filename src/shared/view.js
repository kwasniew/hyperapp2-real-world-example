import { html } from "./html.js";
import { pages } from "./pages.js";
import { Header } from "./Header.js";

export const view = state =>
  // console.log(JSON.stringify(state.isLoading, null, 4)) ||
  html`
    <div>
      ${Header({ page: state.page, user: state.user })}
      ${state.page ? pages[state.page](state) : ""}
    </div>
  `;
