import { html } from "../shared/html.js";
import cc from "../web_modules/classcat.js";
import { profile, article as articleLink } from "../shared/pages.js";
import { format } from "../shared/date.js";
import { Http } from "../web_modules/@kwasniew/hyperapp-fx.js";
import { preventDefault } from "../shared/lib/events.js";
import { API_ROOT } from "../config.js";
import { pages } from "../shared/selectors.js";

export const GLOBAL_FEED = "global";
export const USER_FEED = "user";
export const TAG_FEED = "tag";

const SetArticles = (state, { articles, articlesCount }) => ({
  ...state,
  isLoading: false,
  articles,
  articlesCount
});

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
      headers: {
        Authorization: `Token ${token}`
      }
    },
    action: UpdateArticle
  });
const UnfavoriteArticle = ({ slug, token }) =>
  Http({
    url: API_ROOT + `/articles/${slug}/favorite`,
    options: {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`
      }
    },
    action: UpdateArticle
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

export const FetchFeed = (path, token) => {
  const options = token
    ? {
        headers: {
          Authorization: `Token ${token}`
        }
      }
    : {};
  return Http({
    url: API_ROOT + path,
    options,
    action: SetArticles
  });
};

export const FetchUserFeed = ({ page, token }) =>
  FetchFeed(`/articles/feed?limit=10&offset=${page * 10}`, token);
export const FetchGlobalFeed = ({ page, token }) =>
  FetchFeed(`/articles?limit=10&offset=${page * 10}`, token);
export const FetchTagFeed = ({ tag, page, token }) =>
  FetchFeed(`/articles?limit=10&tag=${tag}&offset=${page * 10}`, token);

const SetTags = (state, { tags }) => ({ ...state, tags });

export const FetchTags = Http({
  url: API_ROOT + "/tags",
  action: SetTags
});

const FetchArticles = state => {
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

const loadingArticles = {
  articles: [],
  articlesCount: 0,
  isLoading: true,
  currentPageIndex: 0
};

export const ChangePage = (state, { currentPageIndex }) => {
  const newState = {
    ...state,
    ...loadingArticles,
    currentPageIndex
  };

  return [newState, [preventDefault, FetchArticles(newState)]];
};

export const ChangeTab = (state, { name, type }) => {
  const updateFeed = feed => {
    if (feed.type === type) {
      feed.visible = true;
    } else if (feed.type === TAG_FEED) {
      feed.visible = false;
    }
    if (name) {
      feed.name = name;
    }
    return feed;
  };
  const feeds = state.feeds.map(updateFeed);
  const newState = {
    ...state,
    active: type,
    feeds,
    ...loadingArticles
  };
  return [newState, [preventDefault, FetchArticles(newState)]];
};

export const LoadHomePage = page => state => {
  const newState = {
    user: state.user,
    page,
    active: state.user ? USER_FEED : GLOBAL_FEED,
    feeds: [
      { visible: !!state.user, type: USER_FEED },
      { visible: true, type: GLOBAL_FEED },
      { visible: false, type: TAG_FEED, name: "" }
    ],
    tags: [],
    ...loadingArticles
  };
  return [newState, [FetchArticles(newState), FetchTags]];
};

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

const ArticleList = ({ isLoading, articles, pages }) => {
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
  currentPageIndex,
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
            ${ArticleList({
              articles,
              isLoading,
              pages: pages({ count: articlesCount, currentPageIndex })
            })}
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
