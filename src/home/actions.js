import { Http } from "../web_modules/@kwasniew/hyperapp-fx.js";
import { preventDefault } from "../shared/lib/events.js";
import { GLOBAL_FEED, TAG_FEED, USER_FEED } from "./feedNames.js";
import {API_ROOT} from "../config.js";

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
    active: GLOBAL_FEED,
    feeds: [
      { visible: false, type: USER_FEED },
      { visible: true, type: GLOBAL_FEED },
      { visible: false, type: TAG_FEED, name: "" }
    ],
    tags: [],
    ...loadingArticles
  };
  return [newState, [FetchArticles(newState), FetchTags]];
};
