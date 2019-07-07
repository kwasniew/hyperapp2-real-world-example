import { Http } from "../web_modules/hyperapp-fx.js";
import { preventDefault } from "../shared/events.js";
import { GLOBAL_FEED, TAG_FEED } from "./feeds.js";

const API_ROOT = "https://conduit.productionready.io/api";

const SetArticles = (state, { articles, articlesCount }) => ({
  ...state,
  isLoading: false,
  articles,
  articlesCount
});

export const FetchFeed = path =>
  Http({
    url: API_ROOT + path,
    action: SetArticles
  });

export const FetchGlobalFeed = ({ page }) =>
  FetchFeed(`/articles?limit=10&offset=${page * 10}`);
export const FetchTagFeed = ({ tag, page }) =>
  FetchFeed(`/articles?limit=10&tag=${tag}&offset=${page * 10}`);

const SetTags = (state, { tags }) => ({ ...state, tags });

export const FetchTags = Http({
  url: API_ROOT + "/tags",
  action: SetTags
});

const FetchArticles = state => {
  const activeFeed = state.feeds.find(feed => feed.type === state.active);
  const page = state.currentPageIndex;
  if (activeFeed.type === GLOBAL_FEED) {
    return FetchGlobalFeed({ page });
  } else if (activeFeed.type === TAG_FEED) {
    return FetchTagFeed({ tag: activeFeed.name, page });
  } else {
    return null;
  }
};

export const ChangePage = (state, { currentPageIndex }) => {
  const newState = {
    ...state,
    currentPageIndex
  };

  return [newState, [preventDefault, FetchArticles(newState)]];
};

const loadingArticles = {
  articles: [],
  articlesCount: 0,
  isLoading: true,
  currentPageIndex: 0
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

export const LoadHomePage = page => state => [
  {
    ...state,
    page,
    tags: [],
    ...loadingArticles
  },
  [FetchArticles(state), FetchTags]
];
