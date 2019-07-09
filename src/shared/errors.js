import { html } from "./html.js";
import { Console } from "../web_modules/@kwasniew/hyperapp-fx.js";

export const ListErrors = ({ errors }) => html`
  <ul class="error-messages">
    ${errors.map(
      error =>
        html`
          <li>${error}</li>
        `
    )}
  </ul>
`;

export const LogError = (state, error) => [state, Console(error)];
