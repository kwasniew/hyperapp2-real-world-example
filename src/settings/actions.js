export const LoadSettingsPage = page => state => {
    return {
        page,
        user: state.user,
        errors: {}
    };
};