const me = typeof window === "undefined" ? global : window;
export const API_ROOT= me.apiUrl || "https://conduit.productionready.io/api";
// export const API_ROOT = "http://localhost:3000/api";
