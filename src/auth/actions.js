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
