import {Http} from "../web_modules/hyperapp-fx.js";
import {preventDefault} from "../shared/events.js";
import {Redirect} from "../routing/Router.js";
import {HOME} from "../routing/pages.js";
import {WriteToStorage} from "../web_modules/hyperapp-fx.js";

const API_ROOT = "https://conduit.productionready.io/api";

const defaultAuthFields = {
  email: "",
  password: "",
  inProgress: false,
  errors: {}
};

const SaveUser = user => WriteToStorage({key: "session", value: user});

export const ChangeEmail = (state, email) => ({...state, email});
export const ChangePassword = (state, password) => ({...state, password});

const LoginSuccess = (state, {user}) => [{...state, user}, [SaveUser(user), Redirect({path: HOME})]];
const LoginError = (state, {errors}) => console.log(errors) || ({...state, inProgress: false, errors});

const Login = ({email, password}) => Http({
    url: API_ROOT + "/users/login",
    options: {
      method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({user: {email, password}})
    },
    errorResponse: 'json',
    action: LoginSuccess,
    error: LoginError
});
export const SubmitLogin = state => [{...state, inProgress: true}, [preventDefault, Login({email: state.email, password: state.password})]]

export const LoadLoginPage = page => state => {
  return {
    page,
    ...defaultAuthFields
  };
};

export const LoadRegisterPage = page => state => {
  return {
    page,
    ...defaultAuthFields,
    username: ""
  };
};
