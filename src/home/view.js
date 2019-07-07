import { html } from "../shared/html.js";
import cc from "../web_modules/classcat.js";
import { ChangeTab } from "./actions.js";
import { GLOBAL_FEED } from "./feeds.js";
import { profile, article as articleLink } from "../routing/pages.js";
import { format } from "../shared/date.js";

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

const ArticlePreview = ({ article }) => html`
  <div class="article-preview">
    <div class="article-meta">
      <a href=${profile(article.author.username)}>
        <img src=${article.author.image} />
      </a>
      <div class="info">
        <a class="author" href=${profile(article.author.username)}>
          ${article.author.username}
        </a>
        <span class="date">${format(article.createdAt)}</span>
      </div>
    </div>
    <a href=${articleLink(article.slug)} class="preview-link">
      <h1>${article.title}</h1>
      <p>${article.description}</p>
      <span>Read more...</span>
      <ul class="tag-list">
        ${article.tagList.map(tag => {
          return html`
            <li class="tag-default tag-pill tag-outline" key=${tag}>
              ${tag}
            </li>
          `;
        })}
      </ul>
    </a>
  </div>
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
      ${articles.map(article => ArticlePreview({ article }))}
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
