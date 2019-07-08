import { html } from "./html.js";

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
