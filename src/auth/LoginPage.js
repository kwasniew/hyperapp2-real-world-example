import { html } from "../shared/html.js";
import { REGISTER } from "../shared/pages.js";
import { ChangeEmail, ChangePassword, SubmitLogin } from "./actions.js";
import { targetValue } from "../shared/lib/events.js";
import {errorsList} from "../shared/selectors.js";
import {ListErrors} from "../shared/ListErrors.js";

export const LoginPage = ({ email, password, inProgress, errors }) => html`
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Sign In</h1>
          <p class="text-xs-center">
            <a href=${REGISTER}>Need an account?</a>
          </p>

          ${ListErrors({ errors: errorsList({errors}) })}

          <form onsubmit=${SubmitLogin}>
            <fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="email"
                  placeholder="Email"
                  value=${email}
                  oninput=${[ChangeEmail, targetValue]}
                />
              </fieldset>

              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  value=${password}
                  oninput=${[ChangePassword, targetValue]}
                />
              </fieldset>

              <button
                class="btn btn-lg btn-primary pull-xs-right"
                type="submit"
                disabled=${inProgress}
              >
                Sign in
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
`;
