import { html } from "../shared/html.js";
import { ListErrors } from "../shared/errors.js";
import { errorsList } from "../shared/selectors.js";
import { targetValue, preventDefault } from "../shared/lib/events.js";
import { Http } from "../web_modules/@kwasniew/hyperapp-fx.js";
import { API_ROOT } from "../config.js";
import { UserSuccess, Logout } from "../shared/user/index.js";
import { formFields, ChangeFieldFromTarget } from "../shared/formFields.js";
import { FormError } from "../shared/formFields.js";
import { authHeader } from "../shared/authHeader.js";

const UpdateSettings = user => {
  const { password, ...userWithoutPassword } = user;
  const submitUser =
    password && password.length > 0 ? user : userWithoutPassword;
  return Http({
    url: API_ROOT + "/user",
    options: {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(user.token)
      },
      body: JSON.stringify({ user: submitUser })
    },
    errorResponse: "json",
    action: UserSuccess,
    error: FormError
  });
};
const SubmitForm = state => [
  { ...state, inProgress: true },
  [
    preventDefault,
    UpdateSettings({
      image: state.image,
      username: state.username,
      bio: state.bio,
      email: state.email,
      password: state.password,
      token: state.user.token
    })
  ]
];

export const LoadSettingsPage = page => state => {
  return {
    page,
    user: state.user,
    ...state.user,
    password: "",
    ...formFields
  };
};

const SettingsForm = ({
  image,
  username,
  bio,
  email,
  password,
  inProgress
}) => html`
  <form onsubmit=${SubmitForm}>
    <fieldset>
      <fieldset class="form-group">
        <input
          class="form-control"
          type="text"
          placeholder="URL of profile picture"
          value=${image}
          oninput=${ChangeFieldFromTarget("image")}
        />
      </fieldset>

      <fieldset class="form-group">
        <input
          class="form-control form-control-lg"
          type="text"
          placeholder="Username"
          value=${username}
          oninput=${ChangeFieldFromTarget("username")}
        />
      </fieldset>

      <fieldset class="form-group">
        <textarea
          class="form-control form-control-lg"
          rows="8"
          placeholder="Short bio about you"
          value=${bio}
          oninput=${ChangeFieldFromTarget("bio")}
        />
      </fieldset>

      <fieldset class="form-group">
        <input
          class="form-control form-control-lg"
          type="email"
          placeholder="Email"
          value=${email}
          oninput=${ChangeFieldFromTarget("email")}
        />
      </fieldset>

      <fieldset class="form-group">
        <input
          class="form-control form-control-lg"
          type="password"
          placeholder="New Password"
          value=${password}
          oninput=${ChangeFieldFromTarget("password")}
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

export const SettingsPage = ({
  image,
  username,
  bio,
  email,
  password,
  inProgress,
  errors
}) => html`
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          ${ListErrors({ errors: errorsList({ errors }) })}
          ${SettingsForm({ image, username, bio, email, password, inProgress })}

          <hr />

          <button class="btn btn-outline-danger" onclick=${Logout}>
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
`;
