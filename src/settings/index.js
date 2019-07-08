import { html } from "../shared/html.js";
import {ListErrors} from "../shared/ListErrors.js";
import {errorsList} from "../shared/selectors.js";

export const LoadSettingsPage = page => state => {
    return {
        page,
        user: state.user,
        errors: {}
    };
};

const SettingsForm = ({ image, username, bio, email, password, inProgress }) => html`
<form>
      <fieldset>
        <fieldset class="form-group">
          <input
            class="form-control"
            type="text"
            placeholder="URL of profile picture"
            value=${image}
          />
        </fieldset>

        <fieldset class="form-group">
          <input
            class="form-control form-control-lg"
            type="text"
            placeholder="Username"
            value=${username}
          />
        </fieldset>

        <fieldset class="form-group">
          <textarea
            class="form-control form-control-lg"
            rows="8"
            placeholder="Short bio about you"
            value=${bio}
          />
        </fieldset>

        <fieldset class="form-group">
          <input
            class="form-control form-control-lg"
            type="email"
            placeholder="Email"
            value=${email}
          />
        </fieldset>

        <fieldset class="form-group">
          <input
            class="form-control form-control-lg"
            type="password"
            placeholder="New Password"
            value=${password}
          />
        </fieldset>

        <button
          class="btn btn-lg btn-primary pull-xs-right"
          type="submit"
          disabled=${!!inProgress}
        >
          Update Settings
        </button>
      </fieldset>
    </form>
`;

export const SettingsPage = ({user, errors}) => html`
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          ${ListErrors({ errors: errorsList({errors}) })}
          ${SettingsForm(user)}

          <hr />

          <button class="btn btn-outline-danger">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
`;
