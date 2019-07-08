import {ReadFromStorage, WriteToStorage, RemoveFromStorage} from "../../web_modules/@kwasniew/hyperapp-fx.js";
import {Redirect} from "../lib/Router.js";
import {HOME} from "../pages.js";

const SESSION = "session";

const SetUser = (state, { value }) => ({ ...state, user: value });
const SaveUser = user => WriteToStorage({ key: SESSION, value: user });
export const ReadUser = ReadFromStorage({ key: SESSION, action: SetUser });

export const UserSuccess = (state, { user }) => [
    { ...state, user },
    [SaveUser(user), Redirect({ path: HOME })]
];
export const UserError = (state, { errors }) => ({
    ...state,
    inProgress: false,
    errors
});

export const Logout = state => [{...state, user: null}, [RemoveFromStorage({key: SESSION}), Redirect({ path: HOME })]]