import { html } from "../shared/html.js";

const Banner = () =>
  html`
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>
  `;
export const homePage = ({ user }) => console.log(user) ||
  html`
    <div class="home-page" key="home-page">
      ${user ? "" : Banner()}
    </div>
  `;
