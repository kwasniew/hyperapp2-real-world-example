import fetch from "node-fetch";

const apiUrl = "https://conduit.productionready.io/api";

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
}

export { login };
