import { html } from "../shared/html.js";
import cc from "../web_modules/classcat.js";
import { Http } from "../web_modules/@kwasniew/hyperapp-fx.js";
import { preventDefault } from "../shared/lib/events.js";
import { API_ROOT } from "../config.js";
import { pages } from "../shared/selectors.js";
import { LogError } from "../shared/errors.js";
import {
  ArticleList,
  FetchArticles,
  loadingArticles,
  USER_FEED,
  GLOBAL_FEED,
  TAG_FEED
} from "../shared/articles/index.js";

const SetTags = (state, { tags }) => ({ ...state, tags });

export const FetchTags = Http({
  url: API_ROOT + "/tags",
  action: SetTags,
  error: LogError
});

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
    active: state.user.token ? USER_FEED : GLOBAL_FEED,
    feeds: [
      { visible: !!state.user.token, type: USER_FEED },
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
