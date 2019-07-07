import { html } from "../shared/html.js";
import cc from "../web_modules/classcat.js";
import { ChangeTab, ChangePage } from "./actions.js";
import { GLOBAL_FEED, USER_FEED, TAG_FEED } from "./feeds.js";
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

const FeedTab = ({ active, visible, type, name }, children) =>
  visible
    ? html`
        <li class="nav-item">
          <a
            href=""
            class="${cc({ "nav-link": true, active: active === type })}"
            onClick=${[ChangeTab, { name, type }]}
          >
            ${children}
          </a>
        </li>
      `
    : "";

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

function pages({ articlesCount, currentPage }) {
  const range = [];
  for (let i = 0; i < Math.ceil(articlesCount / 10); ++i) {
    range.push({ number: i, isCurrent: i === currentPage });
  }
  return range;
}

const ListPagination = ({ articlesCount, currentPage }) => {
  if (articlesCount <= 10) {
    return "";
  }
  return html`
    <nav>
      <ul class="pagination">
        ${pages({ articlesCount, currentPage }).map(
          page =>
            html`
              <li
                class=${page.isCurrent ? "page-item active" : "page-item"}
                key=${String(page.number)}
              >
                <a class="page-link" href="" onClick=${[ChangePage, {currentPage: page.number}]}>
                  ${page.number + 1}
                </a>
              </li>
            `
        )}
      </ul>
    </nav>
  `;
};

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
      ${ListPagination({ articlesCount, currentPage })}
    </div>
  `;
};

const Tags = ({ tags }) => html`
  <div class="tag-list">
    ${tags.map(tag => {
      return html`
        <a
          href=""
          class="tag-pill tag-default"
          key="${tag}"
          onClick=${[ChangeTab, { type: TAG_FEED, name: tag }]}
        >
          ${tag}
        </a>
      `;
    })}
  </div>
`;

export const HomePage = ({
  user,
  articles,
  articlesCount,
  currentPage,
  isLoading,
  tags,
  feeds,
  active
}) =>
  html`
    <div class="home-page" key="home-page">
      ${user ? "" : Banner()}

      <div class="container page">
        <div class="row">
          <div class="col-md-9">
            <div class="feed-toggle">
              <ul class="nav nav-pills outline-active">
                ${FeedTab({ ...feeds[0], active }, "Your Feed")}
                ${FeedTab({ ...feeds[1], active }, "Global Feed")}
                ${FeedTab(
                  { ...feeds[2], active },
                  html`
                    <i class="ion-pound" /> ${feeds[2].name}
                  `
                )}
              </ul>
            </div>
            ${ArticleList({ articles, articlesCount, currentPage, isLoading })}
          </div>

          <div class="col-md-3">
            <div class="sidebar">
              <p>Popular Tags</p>

              ${Tags({ tags })}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
