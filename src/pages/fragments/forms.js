import { html } from "../../shared/html.js";
import { Console } from "@kwasniew/hyperapp-fx";
//import { targetValue } from "@hyperapp/events";

// Form Fields
export const formFields = { inProgress: false, errors: {} };
const ChangeField = (field) => (state, value) => ({ ...state, [field]: value });
//export const ChangeFieldFromTarget = (field) => [ChangeField(field), targetValue];

// Form Errors
// Actions & Effects
export const LogError = (state, error) => [state, Console(error)];
export const Submitting = (state) => ({ ...state, inProgress: true });
export const FormError = (state, { errors }) => ({ ...state, inProgress: false, errors });
// Selectors
export const errorsList = ({ errors }) =>
  Object.entries(errors).map(([key, values]) => `${key} ${values.join(" and ")}`);
// Views
export const ListErrors = ({ errors }) => html`
  <ul class="error-messages">
    ${errors.map((error) => html` <li>${error}</li> `)}
  </ul>
`;
