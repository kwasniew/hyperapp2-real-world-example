import { html } from "../shared/html.js";
import {ListErrors} from "../shared/ListErrors.js";
import {errorsList} from "../shared/selectors.js";

export const SettingsPage = ({user, errors}) => html`
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          ${ListErrors({ errors: errorsList({errors}) })}

          <hr />

          <button class="btn btn-outline-danger">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
`;
