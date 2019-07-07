import { html } from "../shared/html.js";
import cc from "../web_modules/classcat.js";
import { ChangeTab } from "./actions.js";
import { GLOBAL_FEED } from "./feeds.js";

const Banner = () =>
  html`
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>
  `;

const GlobalFeedTab = ({ active }) =>
  html`
    <li class="nav-item">
      <a
        href=""
        class="${cc({ "nav-link": true, active })}"
        onClick=${[ChangeTab, GLOBAL_FEED]}
      >
        Global Feed
      </a>
    </li>
  `;

const ArticleList = ({ articles, articlesCount, currentPage, isLoading }) => {
  if (isLoading) {
    return html`
      <div class="article-preview">Loading...</div>
    `;
  }
  if (articles.length === 0) {
    return html`
      <div class="article-preview">No articles are here... yet.</div>
    `;
  }
  return html`
    <div>
      ${articles.length}
    </div>
  `;
};

export const HomePage = ({
  user,
  tab,
  articles,
  articlesCount,
  currentPage,
  isLoading
}) =>
  console.log(user) ||
  html`
    <div class="home-page" key="home-page">
      ${user ? "" : Banner()}

      <div class="container page">
        <div class="row">
          <div class="col-md-9">
            <div class="feed-toggle">
              <ul class="nav nav-pills outline-active">
                ${GlobalFeedTab({ active: tab === GLOBAL_FEED })}
              </ul>
            </div>
            ${ArticleList({ articles, articlesCount, currentPage, isLoading })}
          </div>
        </div>
      </div>
    </div>
  `;
