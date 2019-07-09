import { targetValue } from "./lib/events.js";
import { Redirect } from "./lib/Router.js";

export const formFields = { inProgress: false, errors: {} };

export const ChangeField = field => (state, value) => ({
  ...state,
  [field]: value
});

export const ChangeFieldFromTarget = field => [ChangeField(field), targetValue];

export const FormError = (state, { errors }) => ({
  ...state,
  inProgress: false,
  errors
});

export const RedirectAction = path => state => [state, Redirect({ path })];
