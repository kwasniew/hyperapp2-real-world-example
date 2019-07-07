export const LoadLoginPage = page => state => {
    return {
        page,
        email: "",
        password: "",
        inProgress: false,
        errors: {}
    };
};