import { html } from "../shared/html.js";
import {LOGIN} from "../shared/pages.js";
import {ListErrors} from "./ListErrors.js";
import {errorsList} from "./selectors.js";
import {targetValue} from "../shared/lib/events.js";
import {ChangeUsername, ChangeEmail, ChangePassword, SubmitRegister} from "./actions.js";

export const RegisterPage = ({ username, password, email, inProgress, errors }) => html`
<div class="auth-page">
      <div class="container page">
        <div class="row">
          <div class="col-md-6 offset-md-3 col-xs-12">
            <h1 class="text-xs-center">Sign Up</h1>
            <p class="text-xs-center">
              <a href=${LOGIN}>Have an account?</a>
            </p>
            
            ${ListErrors({ errors: errorsList({errors}) })}

            <form onsubmit=${SubmitRegister}>
              <fieldset>
                <fieldset class="form-group">
                  <input
                    class="form-control form-control-lg"
                    type="text"
                    placeholder="Username"
                    value=${username}
                    oninput=${[ChangeUsername, targetValue]}
                  />
                </fieldset>

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
                  Sign up
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
`;