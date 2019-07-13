import { html } from "../../shared/html.js";
import { article as articleLink } from "../links.js";
import { format } from "../../shared/date.js";
import { Http } from "../../web_modules/@kwasniew/hyperapp-fx.js";
import { API_ROOT } from "../../config.js";
import { authHeader } from "../../shared/authHeader.js";
import { LogError } from "./forms.js";
import { profile } from "../links.js";

// Actions & Effects
const UpdateArticle = (state, { article }) => ({
  ...state,
  articles: state.articles.map(oldArticle => (oldArticle.slug === article.slug ? article : oldArticle))
});

const Favorite = method => ({ slug, token }) =>
  Http({
    url: API_ROOT + `/articles/${slug}/favorite`,
    options: {
      method,
      headers: authHeader(token)
    },
    action: UpdateArticle,
    error: LogError
  });

const FavoriteArticle = Favorite("POST");
const UnfavoriteArticle = Favorite("DELETE");

const ChangeFavoriteStatus = (state, slug) => {
  const article = state.articles.find(a => a.slug === slug);
  if (!article) {
    return state;
  } else if (article.favorited) {
    return [{ ...state }, UnfavoriteArticle({ slug, token: state.user.token })];
  } else {
    return [{ ...state }, FavoriteArticle({ slug, token: state.user.token })];
  }
};

export const loadingArticles = {
  articles: [],
  articlesCount: 0,
  isLoading: true
};

const SetArticles = (state, { articles, articlesCount }) => ({
  ...state,
  isLoading: false,
  articles,
  articlesCount
});

// Views
export const FetchArticles = (path, token) => {
  return Http({
    url: API_ROOT + path,
    options: { headers: authHeader(token) },
    action: SetArticles,
    error: LogError
  });
};

const FavoriteButton = ({ article }) => {
  const style = article.favorited ? "btn-primary favorited" : "btn-outline-primary unfavorited";

  return html`
    <button onclick=${[ChangeFavoriteStatus, article.slug]} data-test="favorite-count" class=${"btn btn-sm btn-primary pull-xs-right " + style}>
      <i class="ion-heart" /> ${article.favoritesCount}
    </button>
  `;
};

const ArticlePreview = ({ article }) => html`
  <div data-test="article" class="article-preview">
    <div class="article-meta">
      <a href=${profile(article.author.username)}>
        <img data-test="avatar" src=${article.author.image} />
      </a>
      <div class="info">
        <a data-test="author" class="author" href=${profile(article.author.username)}>
          ${article.author.username}
        </a>
        <span data-test="date" class="date">${format(article.createdAt)}</span>
      </div>
      ${FavoriteButton({ article })}
    </div>
    <a href=${articleLink(article.slug)} class="preview-link">
      <h1 data-test="title">${article.title}</h1>
      <p data-test="description">${article.description}</p>
      <span>Read more...</span>
      <ul class="tag-list">
        ${article.tagList.map(tag => {
          return html`
            <li data-test="tag" class="tag-default tag-pill tag-outline">
              ${tag}
            </li>
          `;
        })}
      </ul>
    </a>
  </div>
`;

export const ArticleList = ({ isLoading, articles }, children) => {
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
      ${articles.map(article => ArticlePreview({ article }))} ${children}
    </div>
  `;
};
