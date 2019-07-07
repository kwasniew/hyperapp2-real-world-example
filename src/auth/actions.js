const defaultAuthFields = {
  email: "",
  password: "",
  inProgress: false,
  errors: {}
};

export const ChangeEmail = (state, email) => ({...state, email});
export const ChangePassword = (state, password) => ({...state, password});

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
