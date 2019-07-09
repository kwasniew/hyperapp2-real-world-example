export const authHeader = token =>
  token
    ? {
        headers: {
          Authorization: `Token ${token}`
        }
      }
    : {};
