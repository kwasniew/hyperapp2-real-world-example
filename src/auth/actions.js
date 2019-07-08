import {
  Http,
  WriteToStorage,
  ReadFromStorage
} from "../web_modules/@kwasniew/hyperapp-fx.js";
import { preventDefault } from "../shared/lib/events.js";
import { Redirect } from "../shared/lib/Router.js";
import { HOME } from "../shared/pages.js";
import { API_ROOT } from "../config.js";

const SetUser = (state, { value }) => ({ ...state, user: value });

const SaveUser = user => WriteToStorage({ key: "session", value: user });
export const ReadUser = ReadFromStorage({ key: "session", action: SetUser });

export const ChangeUsername = (state, username) => ({ ...state, username });
export const ChangeEmail = (state, email) => ({ ...state, email });
export const ChangePassword = (state, password) => ({ ...state, password });

const AuthSuccess = (state, { user }) => [
  { ...state, user },
  [SaveUser(user), Redirect({ path: HOME })]
];
const AuthError = (state, { errors }) => ({
  ...state,
  inProgress: false,
  errors
});

const Login = ({ email, password }) =>
  Http({
    url: API_ROOT + "/users/login",
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ user: { email, password } })
    },
    errorResponse: "json",
    action: AuthSuccess,
    error: AuthError
  });
export const SubmitLogin = state => [
  { ...state, inProgress: true },
  [preventDefault, Login({ email: state.email, password: state.password })]
];

const Register = ({ email, password, username }) =>
  Http({
    url: API_ROOT + "/users",
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ user: { email, password, username } })
    },
    errorResponse: "json",
    action: AuthSuccess,
    error: AuthError
  });
export const SubmitRegister = state => [
  { ...state, inProgess: true },
  [
    preventDefault,
    Register({
      email: state.email,
      password: state.password,
      username: state.username
    })
  ]
];

const defaultAuthFields = {
  email: "",
  password: "",
  inProgress: false,
  errors: {}
};

export const LoadLoginPage = page => state => {
  return {
    page,
    user: state.user,
    ...defaultAuthFields
  };
};

export const LoadRegisterPage = page => state => {
  return {
    page,
    ...defaultAuthFields,
    user: state.user,
    username: ""
  };
};
