import { html } from "../shared/html.js";
import cc from "../web_modules/classcat.js";
import { Http } from "../web_modules/@kwasniew/hyperapp-fx.js";
import { preventDefault } from "../shared/lib/events.js";
import { API_ROOT } from "../config.js";
import { pages } from "../shared/selectors.js";
import { LogError } from "../shared/errors.js";
import { ArticleList, loadingArticles } from "./fragments/articles.js";
import { FetchArticles } from "./fragments/articles.js";

// Actions & Effects
const SetTags = (state, { tags }) => ({ ...state, tags });

const FetchTags = Http({
  url: API_ROOT + "/tags",
  action: SetTags,
  error: LogError
});

const FetchUserFeed = ({ pageIndex, token }) =>
  FetchArticles(`/articles/feed?limit=10&offset=${pageIndex * 10}`, token);
const FetchGlobalFeed = ({ pageIndex, token }) =>
  FetchArticles(`/articles?limit=10&offset=${pageIndex * 10}`, token);
const FetchTagFeed = ({ tag, pageIndex, token }) =>
  FetchArticles(
    `/articles?limit=10&tag=${tag}&offset=${pageIndex * 10}`,
    token
  );


const GLOBAL_FEED = "global";
const USER_FEED = "user";
const TAG_FEED = "tag";

const feeds = {
  [GLOBAL_FEED]: FetchGlobalFeed,
  [USER_FEED]: FetchUserFeed,
  [TAG_FEED]: FetchTagFeed
};

const FetchFeed = ({
  activeFeedType,
  currentPageIndex,
  user,
  activeFeedName
}) =>
  feeds[activeFeedType]({
    pageIndex: currentPageIndex,
    token: user.token,
    tag: activeFeedName
  });

const ChangeTab = (state, { activeFeedType, activeFeedName }) => {
  const feeds = [
    state.user.token ? USER_FEED : null,
    GLOBAL_FEED,
    activeFeedType === TAG_FEED ? TAG_FEED : null
  ].filter(x => x);
  const newState = {
    ...state,
    activeFeedType,
    activeFeedName: activeFeedName ? activeFeedName : activeFeedType,
    feeds,
    currentPageIndex: 0,
    ...loadingArticles
  };
  return [newState, [preventDefault, FetchFeed(newState)]];
};

const ChangePage = (state, { currentPageIndex }) => {
  const newState = {
    ...state,
    ...loadingArticles,
    currentPageIndex
  };

  return [newState, [preventDefault, FetchFeed(newState)]];
};

export const LoadHomePage = page => state => {
  const feeds = state.user.token ? [USER_FEED, GLOBAL_FEED] : [GLOBAL_FEED];
  const activeFeedType = state.user.token ? USER_FEED : GLOBAL_FEED;
  const activeFeedName = activeFeedType;
  const newState = {
    user: state.user,
    page,
    activeFeedName,
    activeFeedType,
    feeds,
    tags: [],
    currentPageIndex: 0,
    ...loadingArticles
  };
  return [newState, [FetchFeed(newState), FetchTags]];
};

// Views
const Banner = () =>
  html`
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>
  `;

const FeedTab = ({ active, type, name }, children) =>
  html`
    <li class="nav-item">
      <a
        href=""
        class=${cc({ "nav-link": true, active })}
        onclick=${[ChangeTab, { activeFeedName: name, activeFeedType: type }]}
      >
        ${children}
      </a>
    </li>
  `;

const Tags = ({ tags }) => html`
  <div class="tag-list">
    ${tags.map(tag => {
      return html`
        <a
          href=""
          class="tag-pill tag-default"
          onclick=${[
            ChangeTab,
            { activeFeedType: TAG_FEED, activeFeedName: tag }
          ]}
        >
          ${tag}
        </a>
      `;
    })}
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
              <li class=${page.isCurrent ? "page-item active" : "page-item"}>
                <a
                  class="page-link"
                  href=""
                  onclick=${[ChangePage, { currentPageIndex: page.index }]}
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

export const HomePage = ({
  page,
  user,
  articles,
  articlesCount,
  currentPageIndex,
  isLoading,
  tags,
  feeds,
  activeFeedName,
  activeFeedType
}) =>
  html`
    <div class="home-page" key="home-page">
      ${user ? "" : Banner()}

      <div class="container page">
        <div class="row">
          <div class="col-md-9">
            <div class="feed-toggle">
              <ul class="nav nav-pills outline-active">
                ${feeds[0]
                  ? FeedTab(
                      { active: activeFeedType === USER_FEED, type: USER_FEED },
                      "Your Feed"
                    )
                  : ""}
                ${feeds[1]
                  ? FeedTab(
                      {
                        active: activeFeedType === GLOBAL_FEED,
                        type: GLOBAL_FEED
                      },
                      "Global Feed"
                    )
                  : ""}
                ${feeds[2]
                  ? FeedTab(
                      {
                        active: activeFeedType === TAG_FEED,
                        type: TAG_FEED,
                        name: activeFeedName
                      },
                      html`
                        <i class="ion-pound" /> ${activeFeedName}
                      `
                    )
                  : ""}
              </ul>
            </div>
            ${ArticleList(
              { articles, isLoading },
              ListPagination({
                pages: pages({ count: articlesCount, currentPageIndex })
              })
            )}
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
