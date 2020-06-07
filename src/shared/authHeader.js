export const authHeader = (token) => (token ? { Authorization: `Token ${token}` } : {});
