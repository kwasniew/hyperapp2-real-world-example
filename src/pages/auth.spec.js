import assert from "assert";
import jsdom_global from "jsdom-global";
import { LoadLoginPage, LoginPage } from "./auth.js";
import { app } from "../web_modules/hyperapp.js";
import { wait, waitForElement, getByPlaceholderText, getByText } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

jsdom_global();
document.body.innerHTML = "<div></div>";
app({
  init: () => [LoadLoginPage("/login")({ user: {} })],
  view: LoginPage,
  node: document.querySelector("div")
});

describe.skip("Login", () => {
  it("success", async () => {
    const userInput = await waitForElement(
      () => {
        return getByPlaceholderText(document.querySelector("div"), "Email");
      },
      { timeout: 50 }
    );
    userEvent.type(userInput, "test@example.com");
    const passwordInput = await waitForElement(
      () => {
        return getByPlaceholderText(document.querySelector("div"), "Password");
      },
      { timeout: 50 }
    );
    userEvent.type(passwordInput, "invalid_password");
    const signInButton = await waitForElement(
      () => {
        return getByText(document.querySelector("div"), "Sign in");
      },
      { timeout: 50 }
    );
    global.fetch = function() {
      return Promise.resolve({
        status: 200,
        json() {
          return Promise.resolve({
            user: {
              id: 32907,
              email: "testuser@gmail.com",
              createdAt: "2018-07-11T12:35:58.858Z",
              updatedAt: "2018-07-11T12:35:58.864Z",
              username: "testuser",
              bio: "This is a long story ",
              image:
                "https://st2.depositphotos.com/3369547/11386/v/950/depositphotos_113863470-stock-illustration-avatar-man-icon-people-design.jpg",
              token:
                "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MzI5MDcsInVzZXJuYW1lIjoidGVzdHVzZXI5OSIsImV4cCI6MTUzNjQ5NjU1OH0.FahoNcPFJ-nsxnaZjvVVS_FVyGnl0167nWglkiUVxsQ"
            }
          });
        }
      });
    };
    signInButton.click();

    wait(
      () => {
        console.log(document.body.innerHTML);
        assert.ok(document.body.innerHTML);
      },
      { timeout: 50 }
    );
  });
});
