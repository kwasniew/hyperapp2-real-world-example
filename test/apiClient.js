import fetch from "node-fetch";

const apiUrl = "https://conduit.productionready.io/api";

const createArticle = token => async article => {
  const res = await fetch(`${apiUrl}/articles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${token}`
    },
    body: JSON.stringify({ article })
  });
  const body = await res.json();
  return body.article;
};

async function login({ email = "testingwithcypress@gmail.com", password = "testingwithcypress" } = {}) {
  const res = await fetch(`${apiUrl}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user: {
        email,
        password
      }
    })
  });
  const body = await res.json();
  localStorage.setItem("session", JSON.stringify(body.user));
  return body.user;
}

export { login, createArticle };
