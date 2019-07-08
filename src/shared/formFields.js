import {targetValue} from "./lib/events.js";

export const formFields = {
    inProgress: false,
    errors: {}
};

export const ChangeField = field => (state, value) => ({ ...state, [field]: value });


export const ChangeFieldFromTarget = field => [ChangeField(field), targetValue]