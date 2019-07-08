import {ReadFromStorage, WriteToStorage} from "../../web_modules/@kwasniew/hyperapp-fx.js";
import {Redirect} from "../lib/Router.js";
import {HOME} from "../pages.js";

const SetUser = (state, { value }) => ({ ...state, user: value });
const SaveUser = user => WriteToStorage({ key: "session", value: user });
export const ReadUser = ReadFromStorage({ key: "session", action: SetUser });

export const UserSuccess = (state, { user }) => [
    { ...state, user },
    [SaveUser(user), Redirect({ path: HOME })]
];
export const UserError = (state, { errors }) => ({
    ...state,
    inProgress: false,
    errors
});