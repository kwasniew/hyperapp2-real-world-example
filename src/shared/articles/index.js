import {html} from "../html.js";
import {article as articleLink, profile} from "../pages.js";
import {format} from "../date.js";
import {Http} from "../../web_modules/@kwasniew/hyperapp-fx.js";
import {API_ROOT} from "../../config.js";
import {authHeader} from "../authHeader.js";
import {LogError} from "../errors.js";
import {preventDefault} from "../lib/events.js";

const SetArticles = (state, { articles, articlesCount }) => ({
    ...state,
    isLoading: false,
    articles,
    articlesCount
});

export const FetchFeed = (path, token) => {
    return Http({
        url: API_ROOT + path,
        options: { headers: authHeader(token) },
        action: SetArticles,
        error: LogError
    });
};

const UpdateArticle = (state, { article }) => ({
    ...state,
    articles: state.articles.map(oldArticle =>
        oldArticle.slug === article.slug ? article : oldArticle
    )
});

const FavoriteArticle = ({ slug, token }) =>
    Http({
        url: API_ROOT + `/articles/${slug}/favorite`,
        options: {
            method: "POST",
            headers: authHeader(token)
        },
        action: UpdateArticle,
        error: LogError
    });
const UnfavoriteArticle = ({ slug, token }) =>
    Http({
        url: API_ROOT + `/articles/${slug}/favorite`,
        options: {
            method: "DELETE",
            headers: authHeader(token)
        },
        action: UpdateArticle,
        error: LogError
    });

const ChangeFavorite = (state, slug) => {
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
    isLoading: true,
    currentPageIndex: 0
};

export const GLOBAL_FEED = "global";
export const USER_FEED = "user";
export const TAG_FEED = "tag";

export const FetchUserFeed = ({ page, token }) =>
    FetchFeed(`/articles/feed?limit=10&offset=${page * 10}`, token);
export const FetchGlobalFeed = ({ page, token }) =>
    FetchFeed(`/articles?limit=10&offset=${page * 10}`, token);
export const FetchTagFeed = ({ tag, page, token }) =>
    FetchFeed(`/articles?limit=10&tag=${tag}&offset=${page * 10}`, token);


export const FetchArticles = state => {
    const activeFeed = state.feeds.find(feed => feed.type === state.active);
    const page = state.currentPageIndex;
    const fetches = {
        [USER_FEED]: FetchUserFeed({ page, token: state.user.token }),
        [GLOBAL_FEED]: FetchGlobalFeed({ page, token: state.user.token }),
        [TAG_FEED]: FetchTagFeed({
            tag: activeFeed.name,
            page,
            token: state.user.token
        })
    };
    return fetches[activeFeed.type];
};

export const ChangePage = (state, { currentPageIndex }) => {
    const newState = {
        ...state,
        ...loadingArticles,
        currentPageIndex
    };

    return [newState, [preventDefault, FetchArticles(newState)]];
};

const FavoriteButton = ({ article }) => {
    const style = article.favorited ? "btn-primary" : "btn-outline-primary";

    return html`
    <button
      onclick=${[ChangeFavorite, article.slug]}
      class=${"btn btn-sm btn-primary pull-xs-right " + style}
    >
      <i class="ion-heart" /> ${article.favoritesCount}
    </button>
  `;
};

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
      ${FavoriteButton({ article })}
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

const ListPagination = ({ pages }) => {
    if (pages.length < 2) {
        return "";
    }
    return html`
    <nav>
      <ul class="pagination">
        ${pages.map(
        page =>
            html`
              <li
                class=${page.isCurrent ? "page-item active" : "page-item"}
                key=${String(page.index)}
              >
                <a
                  class="page-link"
                  href=""
                  onClick=${[ChangePage, { currentPageIndex: page.index }]}
                >
                  ${page.humanDisplay}
                </a>
              </li>
            `
    )}
      </ul>
    </nav>
  `;
};

export const ArticleList = ({ isLoading, articles, pages }) => {
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
      ${ListPagination({ pages })}
    </div>
  `;
};
