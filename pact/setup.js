import fetch from "node-fetch";

export const PORT = 3000;
global.apiUrl = `http://localhost:${PORT}/api`;
global.fetch = fetch;