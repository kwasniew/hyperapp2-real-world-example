import {Http, WriteToStorage} from "../web_modules/@kwasniew/hyperapp-fx.js";
import {preventDefault} from "../shared/events.js";
import {Redirect} from "../routing/Router.js";
import {HOME} from "../routing/pages.js";
import {API_ROOT} from "../config.js";

const SaveUser = user => WriteToStorage({key: "session", value: user});

export const ChangeUsername = (state, username) => ({...state, username});
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

const defaultAuthFields = {
    email: "",
    password: "",
    inProgress: false,
    errors: {}
};

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
